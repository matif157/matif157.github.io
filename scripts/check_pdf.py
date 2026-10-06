#!/usr/bin/env python3
"""Validate a PDF built by build_resume_pdf.py, with no PDF library.

Scope: hand-rolled PDF 1.4 with a classic xref table. It does not parse
cross-reference streams or object streams, so a PDF 1.5+ file written by a real
typesetter will report INVALID even when perfectly fine. Use it on this
repository's generated resumes only, not as a general PDF validator.

Checks: header and trailer, every xref offset lands on its object header, every
"N 0 R" reference resolves, the /Pages and /Catalog tree is consistent, and the
text operators decompress and are recoverable.
"""
import re, sys, zlib

def check(path):
    d = open(path, "rb").read()
    errs = []
    if not d.startswith(b"%PDF-"): errs.append("missing %PDF header")
    if not d.rstrip().endswith(b"%%EOF"): errs.append("missing %%EOF")

    objs = {int(m.group(1)): m.group(2) for m in re.finditer(rb"(\d+) 0 obj\n(.*?)\nendobj", d, re.S)}
    if not objs: errs.append("no objects parsed")

    # xref offsets must land exactly on their object header
    offs = [int(m.group(1)) for m in re.finditer(rb"^(\d{10}) 00000 n", d, re.M)]
    for i, off in enumerate(offs, start=1):
        if not re.match(rb"%d 0 obj" % i, d[off:off + 24]):
            errs.append(f"xref offset {off} does not land on object {i}")

    # every reference must resolve
    for oid, body in objs.items():
        for ref in re.findall(rb"(\d+) 0 R", body):
            if int(ref) not in objs:
                errs.append(f"object {oid} references missing object {ref.decode()}")

    # tree shape
    pages_id = next((o for o, b in objs.items() if b"/Type /Pages" in b), None)
    page_ids = [o for o, b in objs.items() if re.search(rb"/Type /Page[^s]", b)]
    if pages_id is None: errs.append("no /Type /Pages node")
    else:
        kids = [int(x) for x in re.findall(rb"(\d+) 0 R", re.search(rb"/Kids \[([^\]]*)\]", objs[pages_id]).group(1))]
        if sorted(kids) != sorted(page_ids):
            errs.append(f"/Kids {kids} does not match page objects {sorted(page_ids)}")
        for p in page_ids:
            pm = re.search(rb"/Parent (\d+) 0 R", objs[p])
            if not pm or int(pm.group(1)) != pages_id:
                errs.append(f"page {p} has wrong /Parent")
        cm = re.search(rb"/Count (\d+)", objs[pages_id])
        if cm and int(cm.group(1)) != len(page_ids):
            errs.append("/Count disagrees with number of pages")

    # recoverable text
    text = []
    for s in re.findall(rb"stream\r?\n(.*?)\r?\nendstream", d, re.S):
        try: raw = zlib.decompress(s)
        except zlib.error: continue
        text += [m.decode("latin-1") for m in re.findall(rb"\((.*?)\) Tj", raw)]
    if not text: errs.append("no extractable text")

    return errs, text, len(page_ids)

if __name__ == "__main__":
    bad, txt, n = check(sys.argv[1])
    print(f"pages: {n} | text ops: {len(txt)}")
    print("VALID" if not bad else "INVALID")
    for e in bad: print("  !", e)
    sys.exit(1 if bad else 0)
