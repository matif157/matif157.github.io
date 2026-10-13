# matif157.github.io

Personal portfolio for **Muhammad Atif — CRM & Business Software Developer**.

A React + Vite single-page portfolio based on the AxFolio design system (dark ink + ember + cream theme, particle field, magic cursor, preloader curtain, tabbed sections). All site content lives in one file: `src/data/portfolio.js`.

Live at **https://matif157.github.io** — deployed from the `docs/` folder via GitHub Pages.

## Stack
- React 18 + Vite 5
- Fraunces · Hanken Grotesk · JetBrains Mono (Google Fonts)
- GitHub Pages hosting (source: main branch → `/docs`)

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # compiles static site into docs/
npm run preview  # preview the production build
```

## Structure

```
src/
  data/portfolio.js   ← all site content (profile, about, expertise, work, socials)
  components/         ← Hero, About, Expertise, Work, Contact, Navbar, Preloader, ParticleField, Footer, DownloadCV
  App.jsx             ← tab routing / panels
  index.css           ← full theme (design tokens, motion system, responsive)
public/               ← resume PDF/DOCX, favicon, og image
```