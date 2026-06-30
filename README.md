# CoverWorks

Design and print custom game case covers for PS4, PS5, and Nintendo Switch.

## Features

- **Workshop** - upload artwork, pick a case format, drag to reposition, zoom with the slider, and export a print-ready PDF
- **My Covers** - save and reopen your designs (stored locally in your browser, nothing leaves your machine)
- **Guide** - exact wrap dimensions for every supported format and print tips
- **History** - timeline of PlayStation and Nintendo case formats

## Supported formats

PS4, PS5, Nintendo Switch (NS1 and NS2), with a custom format option for any case you measure yourself.

## Print tips

- Print at **Actual Size / 100%**, never "Fit to Page"
- Use glossy or semi-gloss photo paper for a retail look
- Trim with a straightedge and sharp blade for a clean spine fold

## Stack

React, TypeScript, Vite, jsPDF for PDF export.

## Getting started

```bash
npm install
npm run dev
```

`npm run build` produces a static `dist/` folder you can host anywhere (Netlify, GitHub Pages, etc).

## Notes

- Case dimensions in `src/data/caseFormats.ts` are good starting points but manufacturing varies a few mm between regions - use the Custom format if you have measured your own case.
- No undo/redo - clear and re-upload to start a panel over.
