#!/usr/bin/env python3
"""Render a plain-text resume to a text-only PDF with no external tools.

Why this exists: the portfolio links to a resume PDF and DOCX, but only the
.txt was ever produced, so both links 404. pandoc, LibreOffice and cupsfilter
are all unavailable here, and installing a 200MB office suite to typeset one
page is the wrong trade for a private single-user repo.

This emits PDF 1.4 directly: standard Helvetica/Times, no embedding, no
compression. The output is plain selectable text, which is what a resume
downloader actually needs.

Usage:
    .venv/bin/python scripts/build_resume_pdf.py <input.txt> <output.pdf>
"""

from __future__ import annotations

import re
import sys
import zlib
from pathlib import Path

# A4 in points, with a 14mm margin.
PAGE_W, PAGE_H = 595.0, 842.0
MARGIN = 40.0
LINE_H = 11.5

# Helvetica advance widths (1/1000 em) for the printable ASCII range, plus the
# few WinAnsi characters the resume uses. Accurate widths matter: guessing them
# makes long lines overflow the right edge.
_HELV = {
    " ": 278, "!": 278, '"': 355, "#": 556, "$": 556, "%": 889, "&": 667,
    "'": 191, "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333,
    ".": 278, "/": 278, "0": 556, "1": 556, "2": 556, "3": 556, "4": 556,
    "5": 556, "6": 556, "7": 556, "8": 556, "9": 556, ":": 278, ";": 278,
    "<": 584, "=": 584, ">": 584, "?": 556, "@": 1015, "A": 667, "B": 667,
    "C": 722, "D": 722, "E": 667, "F": 611, "G": 778, "H": 722, "I": 278,
    "J": 500, "K": 667, "L": 556, "M": 833, "N": 722, "O": 778, "P": 667,
    "Q": 778, "R": 722, "S": 667, "T": 611, "U": 722, "V": 667, "W": 944,
    "X": 667, "Y": 667, "Z": 611, "[": 278, "\\": 278, "]": 278, "^": 469,
    "_": 556, "`": 333, "a": 556, "b": 556, "c": 500, "d": 556, "e": 556,
    "f": 278, "g": 556, "h": 556, "i": 222, "j": 222, "k": 500, "l": 222,
    "m": 833, "n": 556, "o": 556, "p": 556, "q": 556, "r": 333, "s": 500,
    "t": 278, "u": 556, "v": 500, "w": 722, "x": 500, "y": 500, "z": 500,
    "{": 334, "|": 260, "}": 334, "~": 584, "•": 350, "–": 556, "—": 1000,
}
_HELV_B = {k: int(v * 1.06) for k, v in _HELV.items()}  # Helvetica-Bold
_TIMES = {k: 500 for k in _HELV}
_TIMES.update({
    " ": 250, "A": 722, "B": 667, "C": 667, "D": 722, "E": 611, "F": 556,
    "G": 722, "H": 722, "I": 333, "J": 389, "K": 722, "L": 611, "M": 889,
    "N": 722, "O": 722, "P": 556, "Q": 722, "R": 667, "S": 556, "T": 611,
    "U": 722, "V": 722, "W": 944, "X": 722, "Y": 722, "Z": 611,
    "a": 444, "b": 500, "c": 444, "d": 500, "e": 444, "f": 333, "g": 500,
    "h": 500, "i": 278, "j": 278, "k": 500, "l": 278, "m": 778, "n": 500,
    "o": 500, "p": 500, "q": 500, "r": 333, "s": 389, "t": 278, "u": 500,
    "v": 500, "w": 722, "x": 500, "y": 500, "z": 444,
    "0": 500, "1": 500, "2": 500, "3": 500, "4": 500, "5": 500, "6": 500,
    "7": 500, "8": 500, "9": 500, ".": 250, ",": 250, ":": 278, ";": 278,
    "-": 333, "(": 333, ")": 333, "/": 278, "'": 180, "•": 350,
})


def width(text: str, size: float, bold: bool = False) -> float:
    table = _HELV_B if bold else _HELV
    return sum(table.get(ch, 556) for ch in text) * size / 1000.0


def wrap(text: str, size: float, max_w: float, bold: bool = False) -> list[str]:
    """Greedy word wrap. Splits over-long single words so nothing is clipped."""
    if not text:
        return [""]
    lines: list[str] = []
    cur = ""
    for word in text.split(" "):
        trial = f"{cur} {word}".strip()
        if width(trial, size, bold) <= max_w or not cur:
            if width(trial, size, bold) > max_w and not cur:
                # One word wider than the line: break it by character.
                chunk = ""
                for ch in word:
                    if width(chunk + ch, size, bold) > max_w and chunk:
                        lines.append(chunk)
                        chunk = ch
                    else:
                        chunk += ch
                cur = chunk
                continue
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def classify(line: str) -> tuple[str, float, bool]:
    """Return (font, size, bold) for one source line."""
    s = line.strip()
    if not s:
        return "blank", 0.0, False
    if re.match(r"^[A-Z][A-Z &/,'-]{3,}$", s) and not s.startswith("•"):
        return "head", 10.5, True          # section headings
    if len(s) <= 40 and s.isupper():
        return "head", 10.5, True
    if re.match(r"^[\d/]{4}\s*[–-]\s*(Present|\d{4})", s):
        return "job", 10.0, True          # job title + dates line
    if s.startswith("•"):
        return "body", 9.5, False
    return "body", 9.5, False


def build_lines(text: str) -> list[tuple[str, float, float, float, bool]]:
    """Flatten source text into drawable lines: (font, size, x, y, text, bold)."""
    out: list[tuple[str, float, float, float, bool]] = []
    usable = PAGE_W - 2 * MARGIN
    y = PAGE_H - MARGIN

    raw = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    for line in raw:
        kind, size, bold = classify(line)
        if kind == "blank":
            y -= LINE_H * 0.45
            continue
        s = line.strip()
        indent = 0.0
        if s.startswith("•"):
            s = "• " + s.lstrip("• ").strip()
            indent = 0.0

        font = "F1" if bold else "F2"
        if kind == "head":
            font, size, bold = "F1", 10.5, True

        max_w = usable - indent
        for i, piece in enumerate(wrap(s, size, max_w, bold)):
            if i == 0 and kind == "head":
                y -= size + 2
                out.append(("F1", size, MARGIN + indent, y, piece, True))
                out.append(("rule", 0.5, MARGIN, y - 3.5, "", False))
            else:
                y -= LINE_H
                out.append((font, size, MARGIN + indent, y, piece, bold))
    return out


# Unicode to WinAnsiEncoding code points. Latin-1 is not the same table: the
# bullet U+2022 has no latin-1 code point and encodes to "?" if passed through
# naively, which is how the first build lost every bullet in the resume.
_WINANSI = {
    "•": b"\x95",   # bullet
    "‘": b"\x91", "’": b"\x91",
    "“": b"\x93", "”": b"\x94",
    "–": b"\x96",   # en dash
    "—": b"\x97",   # em dash
    "…": b"\x85",
    " ": b"\x20", " ": b"\x20",
}


def winansi(s: str) -> bytes:
    """Encode to WinAnsi bytes, substituting only what WinAnsi lacks."""
    out = bytearray()
    for ch in s:
        mapped = _WINANSI.get(ch)
        if mapped is not None:
            out += mapped
        else:
            try:
                out += ch.encode("cp1252")
            except UnicodeEncodeError:
                out += b"?"
    return bytes(out)


def esc_bytes(s: str) -> bytes:
    """Escape a string for a PDF literal string, in WinAnsi bytes."""
    raw = winansi(s)
    raw = raw.replace(b"\\", b"\\\\").replace(b"(", b"\\(").replace(b")", b"\\)")
    return raw


def pdf(src: Path, dst: Path) -> int:
    lines = build_lines(src.read_text(encoding="utf-8", errors="replace"))
    per_page = int((PAGE_H - 2 * MARGIN) // LINE_H) + 4
    pages = [lines[i : i + per_page] for i in range(0, len(lines), per_page)] or [[]]

    objects: list[bytes] = []

    def add(body: bytes) -> int:
        objects.append(body)
        return len(objects)

    font_ids = {
        add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"): "F1",
        add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"): "FB",
        add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>"): "F2",
    }

    content_ids = []
    for page in pages:
        ops: list[bytes] = [b"BT"]
        for font, size, x, y, piece, bold in page:
            if font == "rule":
                ops.append(b"ET")
                ops.append(
                    f"{x} {y:.2f} m {PAGE_W - MARGIN:.2f} {y:.2f} l S".encode()
                )
                ops.append(b"BT")
                continue
            key = "FB" if bold else font
            ops.append(
                f"/{key} {size:.2f} Tf 1 0 0 1 {x:.2f} {y:.2f} Tm (".encode()
                + esc_bytes(piece)
                + b") Tj"
            )
        ops.append(b"ET")
        stream = zlib.compress(b"\n".join(ops))
        content_ids.append(add(
            b"<< /Length " + str(len(stream)).encode()
            + b" /Filter /FlateDecode >>\nstream\n" + stream + b"\nendstream"
        ))

    # Write the content-stream objects first (done above), then the Page objects
    # for each stream, then the Pages node that lists them, then the catalog.
    # Object order does not have to match document order; only the /Parent and
    # /Kids references must resolve, which they do because ids are assigned by
    # `add` and recorded as we go.
    fonts = f"{font_ids[1]} 0 R {font_ids[2]} 0 R {font_ids[3]} 0 R"
    page_ids: list[int] = []
    for cid in content_ids:
        page_ids.append(
            add(
                f"<< /Type /Page /MediaBox [0 0 {PAGE_W:.0f} {PAGE_H:.0f}] "
                f"/Resources << /Font << {fonts} >> >> "
                f"/Contents {cid} 0 R >>".encode()
            )
        )
    kids = " ".join(f"{pid} 0 R" for pid in page_ids)
    pages_id = add(f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>".encode())
    for pid in page_ids:
        # Retro-fit /Parent now that the Pages id is known.
        objects[pid - 1] = objects[pid - 1].replace(
            b"/Type /Page ",
            f"/Type /Page /Parent {pages_id} 0 R ".encode(),
        )
    catalog_id = add(f"<< /Type /Catalog /Pages {pages_id} 0 R >>".encode())

    out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]
    for i, body in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{i} 0 obj\n".encode() + body + b"\nendobj\n"
    xref_at = len(out)
    out += f"xref\n0 {len(objects) + 1}\n".encode()
    out += b"0000000000 65535 f \n"
    for off in offsets[1:]:
        out += f"{off:010d} 00000 n \n".encode()
    out += (
        f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\n"
        f"startxref\n{xref_at}\n%%EOF\n"
    ).encode()
    dst.write_bytes(bytes(out))
    return len(pages)


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    if not src.exists():
        print(f"! not found: {src}")
        return 1
    pages = pdf(src, dst)
    print(f"wrote {dst} ({pages} page(s), {dst.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())