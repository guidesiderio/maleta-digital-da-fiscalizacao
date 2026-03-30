# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Maleta Digital da Fiscalização" (Digital Briefcase for Oversight) is a static front-end application for UFPI's (Universidade Federal do Piauí) Department of Contract Oversight. It presents official documents (PDFs) inside a skeuomorphic 3D briefcase UI — users click to open the lid, browse colored folders, and view documents in a modal.

The app is pure HTML/CSS/JS with no build system, no bundler, no framework, and no package manager. Open `index.html` directly in a browser to run it.

## Architecture

- **index.html** — Single page with the briefcase structure: institutional header, lid, base with folder slots, modal overlay, and footer.
- **data.js** — `folders` array defining folder names and their documents (title, PDF file path, description). Loaded as a global before `script.js`.
- **script.js** — All runtime logic: folder rendering, lid open/close animation orchestration, modal open/close, Google Docs Viewer URL generation for PDFs, footer date stamp.
- **style.css** — Complete styling (~740 lines). Implements the "Digital Dossier" design system with 3D CSS transforms for the lid, five folder color themes (c1–c5), modal animations, and responsive breakpoints at 640px and 520px (horizontal scroll-snap for folders on mobile).
- **assets/** — Institutional logo PNG and PDF documents referenced by `data.js`.
- **DESIGN.md** — Design system specification ("The Digital Dossier"). Defines color tokens, typography rules (Noto Serif / Work Sans / Space Grotesk), elevation/depth principles, and component guidelines. All visual changes must follow this document.

## Key Conventions

- **Language**: All UI text is in Brazilian Portuguese (pt-BR).
- **Design system compliance**: Visual changes must follow DESIGN.md — no pure black/grey (all neutrals tinted with deep brown #210e0b), no 1px solid borders for sectioning (use tonal shifts), no sharp shadows.
- **Folder colors**: Five muted tones (Tan, Green, Light Brown, Grey-Brown, Pale Yellow) mapped to CSS classes `.c1`–`.c5` with matching `NUM_HEX` values in script.js.
- **PDF viewing**: Documents open via Google Docs Viewer (`docs.google.com/viewer?url=...`) in a new tab.
- **Fonts**: Three Google Fonts loaded via CSS @import — Noto Serif (display/headlines), Work Sans (body), Space Grotesk (labels/metadata).
- **Adding documents**: Add entries to the `folders` array in `data.js` and place the PDF in `assets/`.
- **Accessibility**: Keyboard navigation with focus-visible outlines, ARIA roles on folders, `prefers-reduced-motion` support, `touch-action: manipulation` on interactive elements.
- **UI/UX skill**: The `.agents/skills/ui-ux-pro-max/` directory contains a comprehensive design intelligence skill with style databases, color palettes, and UX guidelines referenced during development.
