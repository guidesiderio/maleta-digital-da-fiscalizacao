# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Maleta Digital da Fiscalização" (Digital Briefcase for Oversight) is a static front-end application for UFPI's (Universidade Federal do Piauí) Department of Contract Oversight. It presents official documents (PDFs) inside a skeuomorphic 3D briefcase UI — users click to open the lid, browse colored folders, search documents, and view/download PDFs in a modal.

The app is pure HTML/CSS/JS with no build system, no bundler, no framework, and no package manager. It is also a PWA (Progressive Web App) with offline support. Open `index.html` directly in a browser to run it.

## Architecture

- **index.html** — Single page with the briefcase structure: institutional header, lid, base with folder slots, modal overlay, footer, and service worker registration.
- **data.js** — `LAST_UPDATED` constant (synced with `sw.js` cache name) and `folders` array defining folder names and their documents (title, PDF file path, description, date, size). Loaded as a global before `script.js`.
- **script.js** — All runtime logic (~560 lines): folder rendering, lid open/close animation orchestration, modal open/close with focus trap, search/filter with accent normalization, toast notifications, deep linking via URL hash, keyboard shortcuts, print index generation, PWA install prompt, footer date stamp.
- **style.css** — Complete styling (~900+ lines). Implements the "Digital Dossier" design system with CSS custom properties for all design tokens, 3D CSS transforms for the lid, five folder color themes (c1–c5), modal animations, search bar, toast notifications, keyboard shortcuts popover, print styles, and responsive breakpoints at 640px and 520px (horizontal scroll-snap for folders on mobile).
- **sw.js** — Service Worker for PWA offline support. Pre-caches the app shell on install, uses cache-first strategy for static assets and network-first for PDFs. Cache name must be synced with `LAST_UPDATED` in `data.js`.
- **manifest.json** — PWA manifest enabling standalone installation with app icon, theme color, and metadata.
- **assets/** — Institutional logo PNG and PDF documents referenced by `data.js`.
- **DESIGN.md** — Design system specification ("The Digital Dossier"). Defines color tokens, typography rules (Noto Serif / Work Sans / Space Grotesk), elevation/depth principles, and component guidelines. All visual changes must follow this document.
- **MELHORIAS.md** — Enhancement roadmap v1 (10 improvements, all implemented).
- **MELHORIAS-v2.md** — Enhancement roadmap v2 (15 improvements, Tier 1 and Tier 2 implemented, Tier 3 pending).
- **skills-lock.json** — Locks the UI/UX Pro Max skill version for Claude AI features.

## Key Conventions

- **Language**: All UI text is in Brazilian Portuguese (pt-BR).
- **Design system compliance**: Visual changes must follow DESIGN.md — no pure black/grey (all neutrals tinted with deep brown #210e0b), no 1px solid borders for sectioning (use tonal shifts), no sharp shadows. All color values use CSS custom properties defined in `:root`.
- **Folder colors**: Five muted tones (Tan, Green, Light Brown, Grey-Brown, Pale Yellow) mapped to CSS classes `.c1`–`.c5` with matching `NUM_HEX` values in script.js.
- **PDF viewing**: Documents open directly via native browser PDF viewer (`target="_blank"`). A download button is also available.
- **Deep linking**: URL hash format `#pasta-N` (folder) and `#pasta-N/doc-M` (document). Auto-opens briefcase and modal on load. "Copy link" button on each document.
- **Search**: Client-side accent-insensitive filter above folders. Filters by title and description. Auto-opens modal if single match.
- **Keyboard shortcuts**: `/` or `Ctrl+K` (focus search), `Escape` (close modal/clear search), `1`–`5` (open folder), `?` (show shortcuts help).
- **Toast notifications**: `showToast(message, duration)` for user feedback (link copied, app installed, new version).
- **Print support**: `@media print` styles + dynamically generated document index via `beforeprint` event. "Imprimir índice" button in footer.
- **PWA**: Manifest + Service Worker enable standalone installation and offline access. `beforeinstallprompt` intercepted to show install button.
- **Cache versioning**: `LAST_UPDATED` in `data.js` must be synced with `CACHE_NAME` in `sw.js` when updating content. Format: `'maleta-YYYY-MM-DD'`.
- **Fonts**: Three Google Fonts loaded via CSS @import — Noto Serif (display/headlines), Work Sans (body), Space Grotesk (labels/metadata).
- **Adding documents**: Add entries to the `folders` array in `data.js` (with `title`, `file`, `description`, `date`, `size`), place the PDF in `assets/`, update `LAST_UPDATED` in `data.js` and `CACHE_NAME` in `sw.js`.
- **Accessibility**: eMAG / WCAG 2.0 AA compliant — skip link, keyboard navigation with focus-visible outlines, ARIA roles on folders, focus trap in modal, focus return on modal close, `aria-live` announcements, `prefers-reduced-motion` support, `touch-action: manipulation` on interactive elements.
- **Auto-open**: Briefcase auto-opens on recurring visits within the same session (`sessionStorage`).
- **UI/UX skill**: The `.agents/skills/ui-ux-pro-max/` directory contains a comprehensive design intelligence skill with style databases, color palettes, and UX guidelines referenced during development.
