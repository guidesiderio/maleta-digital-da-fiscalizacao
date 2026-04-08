# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Maleta Digital da Fiscalização" (Digital Briefcase for Oversight) is a static front-end application for UFPI's (Universidade Federal do Piauí) Pró-Reitoria de Administração. It presents official documents (PDFs) inside a skeuomorphic 3D briefcase UI — users click to open the lid, browse colored folders, search documents, and view/download PDFs in a modal overlay.

The app is pure HTML/CSS/JS with no build system, no bundler, no framework, and no package manager. It is also a PWA (Progressive Web App) with offline support. Open `index.html` directly in a browser to run it.

## Architecture

### Application files

- **index.html** — Single page with the briefcase structure: institutional header (UFPI + Pró-Reitoria de Administração), handle/lid/base with folder slots, modal overlay (outside `.wrap` for correct `position:fixed`), footer, and inline Service Worker registration.
- **js/data.js** — `LAST_UPDATED` constant (synced with `sw.js` cache name) and `folders` array defining 4 folder objects, each with `name` and `docs` array (`title`, `file`, `description`, `date`, `size`). Single source of truth for all document data. Loaded as a global before `js/script.js`.
- **js/script.js** (~550 lines) — All runtime logic: folder rendering, lid open/close animation orchestration, modal open/close with focus trap, search/filter with accent normalization, toast notifications, deep linking via URL hash, keyboard shortcuts, print index generation, PWA install prompt, footer date stamp. Title (`<h1>`) lives inside `.base` and fades via JS on open.
- **css/style.css** (~1750 lines) — Complete styling. Dark navy background (`#0a1e30` / `#112F4E`), briefcase in wood/leather browns (`#3a1f1a` / `#472f2b`), golden hardware accents (`#e3c199` / `#c49642`). Implements CSS custom properties for all design tokens, 3D CSS transforms for the lid, four folder color themes (c1–c4), modal as fixed overlay with scroll, search bar, toast notifications, keyboard shortcuts popover, print styles, and responsive breakpoints at 640px and 520px (horizontal scroll-snap for folders on mobile).
- **sw.js** — Service Worker for PWA offline support. Pre-caches the app shell on install, uses **network-first** strategy for HTML/JS/CSS/PDFs (always fetches fresh, falls back to cache offline) and cache-first only for static assets (images, icons, fonts). Cache name must be synced with `LAST_UPDATED` in `js/data.js`.
- **manifest.json** — PWA manifest enabling standalone installation with UFPI logo icon, theme color `#112F4E`, background color `#0a1e30`.
- **vercel.json** — Vercel deployment configuration with security headers (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection) and cache-control headers (no-cache for HTML/JS/CSS/SW, long cache for images/icons, 30 days for PDFs).

### Assets

- **assets/img/logo-ufpi.png** — Institutional logo PNG (only image used by the app).
- **assets/icons/** — Favicon files: `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`.
- **favicon.ico** — Root favicon.
- **assets/docs/** — PDF documents organized in subfolders matching folder names:
  - `Manual/` — 1 PDF (Manual de Gestão e Fiscalização)
  - `Portaria e Resolução/` — 2 PDFs
  - `Legislação/` — 2 PDFs
  - `Procedimentos/` — 10 PDFs (fluxos de processos contratuais)

### Documentation

- **docs/DESIGN.md** — Design system specification ("The Digital Dossier"). Defines color tokens, typography rules (Noto Serif / Work Sans / Space Grotesk), elevation/depth principles, and component guidelines. All visual changes must follow this document.
- **docs/MELHORIAS.md** — Enhancement roadmap v1 (10 improvements, all implemented).
- **docs/MELHORIAS-v2.md** — Enhancement roadmap v2 (15 improvements, Tier 1 and Tier 2 implemented, Tier 3 partially implemented).
- **docs/DEPLOY.md** — Deployment guide with hosting info (Vercel) and recommended HTTP security headers for Apache, Netlify, Cloudflare Pages, and GitHub Pages.

### Tooling

- **skills-lock.json** — Locks the `frontend-design` and `ui-ux-pro-max` skill versions for Claude Code.
- **.agents/skills/** — Claude Code skill definitions (`frontend-design`, `ui-ux-pro-max`).
- **.gitignore** — Ignores `.claude/`, `.playwright-mcp/`, OS files, IDE files, logs, `node_modules/`, `.env`.

## Key Conventions

- **Language**: All UI text is in Brazilian Portuguese (pt-BR).
- **Design system compliance**: Visual changes must follow `docs/DESIGN.md` — no pure black/grey (all neutrals tinted with deep brown `#210e0b`), no 1px solid borders for sectioning (use tonal shifts), no sharp shadows. All color values use CSS custom properties defined in `:root`.
- **Color palette**: Dark navy background (`--surface: #0a1e30`, `--surface-container-low: #112F4E`), wood/leather briefcase (`--surface-container: #3a1f1a`, `--surface-container-high: #472f2b`), golden accents (`--primary: #e3c199`, `--primary-dark: #c49642`).
- **Folder colors**: Four muted tones mapped to CSS classes `.c1`–`.c4` with matching `NUM_HEX` values in `js/script.js`: Gold (`#cc9a52`), Green (`#6d8e60`), Purple (`#8078bc`), Coral (`#cc6a48`).
- **4 folders**: Manual, Portaria e Resolução, Legislação, Procedimentos. Defined in `js/data.js`.
- **PDF viewing**: Documents open directly via native browser PDF viewer (`target="_blank"`). A download button is also available.
- **Modal as fixed overlay**: The modal (`#modalOv`) is placed outside `.wrap`/`.scene`/`.case-wrap` in the HTML so that `position: fixed` works correctly regardless of 3D transform context.
- **Title placement**: The `<h1>` "Maleta Digital da Fiscalização" lives inside `.base` (not in the lid), and its opacity is controlled by JS — fades out on open, fades in on close.
- **Deep linking**: URL hash format `#pasta-N` (folder) and `#pasta-N/doc-M` (document). Auto-opens briefcase and modal on page load via `handleHash()`.
- **Auto-open disabled**: The `sessionStorage`-based auto-open on recurring visits was removed. The briefcase only opens on explicit user click or deep-link hash.
- **Search**: Client-side accent-insensitive filter above folders (dynamically inserted by JS). Filters by title and description. Auto-opens modal if single match.
- **Keyboard shortcuts**: `/` or `Ctrl+K` (focus search), `Escape` (close modal/clear search), `1`–`4` (open folder), `?` (show shortcuts help).
- **Toast notifications**: `showToast(message, duration)` for user feedback (link copied, app installed, new version).
- **Print support**: `@media print` styles + dynamically generated document index via `beforeprint` event. "Imprimir índice" button in footer.
- **PWA**: Manifest + Service Worker enable standalone installation and offline access. `beforeinstallprompt` intercepted to show install button.
- **Cache versioning**: `LAST_UPDATED` in `js/data.js` must be synced with `CACHE_NAME` in `sw.js` when updating content. Format: `'maleta-YYYY-MM-DD'`.
- **Fonts**: Three Google Fonts loaded asynchronously via `<link>` with `preconnect` in `index.html` — Noto Serif (display/headlines), Work Sans (body), Space Grotesk (labels/metadata). System font fallbacks defined for each (Georgia, system-ui, Segoe UI).
- **Adding documents**: Add entries to the `folders` array in `js/data.js` (with `title`, `file`, `description`, `date`, `size`), place the PDF in the corresponding subfolder of `assets/docs/`, update `LAST_UPDATED` in `js/data.js` and `CACHE_NAME` in `sw.js`.
- **Accessibility**: eMAG / WCAG 2.0 AA compliant — skip link, keyboard navigation with focus-visible outlines, ARIA roles on folders, focus trap in modal, focus return on modal close, `aria-live` announcements, `prefers-reduced-motion` support, `touch-action: manipulation` on interactive elements.
- **Hosting**: Deployed on Vercel (Hobby plan), auto-deploys from `main` branch. Production URL: `maleta-digital-da-fiscalizacao.vercel.app`. Security headers and cache-control configured via `vercel.json`. Cache problem solved: HTML/JS/CSS are served with `no-cache` headers and the SW uses network-first, so deploys are reflected immediately without Ctrl+Shift+R. Also compatible with GitHub Pages (static files, no build step).
- **Favicons**: Full favicon set in `assets/icons/` + `favicon.ico` at root, referenced via `<link>` tags in `index.html`.
