# Design System Document



## 1. Overview & Creative North Star: The Digital Dossier

This design system is a sophisticated departure from flat, sterile interfaces. It is built upon the concept of **"The Digital Dossier"**—a digital environment that mimics the weight, tactile satisfaction, and organized intimacy of a leather-bound briefcase.



By moving away from traditional rigid grids and embracing skeuomorphic depth, we create an editorial-style experience that feels curated rather than generated. The visual identity is defined by high-contrast typography, layered surfaces that feel like fine paper and leather, and intentional asymmetry that mimics the natural placement of physical objects on a desk or within a folder.



## 2. Colors & Textural Tones

The palette is deeply rooted in organic, muted tones that provide a sense of history and authority.



### Core Palette (Material Design Mapping)

* **Surface/Background (`#210e0b`):** The "Dark Wood" base. Used for the primary viewport background.

* **Primary (`#e3c199`):** The "Beige/Tan" folder tone. Used for primary interactions and key information highlighting.

* **Secondary (`#c5caa8`):** The "Muted Green" folder tone. Used for success states or organizational differentiation.

* **Tertiary (`#e1c296`):** The "Pale Yellow" folder tone. Used for subtle accents.

* **Surface Containers (`#2b1613` to `#472f2b`):** Various tiers of leather textures, moving from deep interior shadows to highlighted flaps.



### The "No-Line" Rule

To maintain the high-end physical feel, **explicitly prohibit the use of 1px solid borders for sectioning.** Structural boundaries must be defined solely through background color shifts or tonal transitions. Use a `surface-container-low` section sitting against a `surface` background to define areas.



### The Glass & Gradient Rule

For elements that need to feel like modern overlays (like floating tooltips or navigation flaps), use semi-transparent surface colors with a `backdrop-filter: blur(12px)`. Incorporate subtle linear gradients (e.g., `primary` to `primary_container`) on buttons to mimic the way light hits a curved leather or paper edge, providing "soul" that flat colors lack.



## 3. Typography

The typographic system establishes a hierarchy of "The Editor" versus "The Clerk," mixing elegant serifs with functional, stamped labels.



* **Display & Headlines (Noto Serif):** Used for titles and high-level section headers. The serif conveys authority and a premium editorial feel. Use `display-lg` (3.5rem) for hero titles to command attention.

* **Body & Titles (Work Sans):** A clean, modern sans-serif that ensures readability within "documents" and folder contents. This is the workhorse of the system.

* **Labels & Metadata (Space Grotesk):** This monospaced choice provides a "stamped" or "typewriter" feel. Use `label-md` for folder tabs, versioning numbers, and "property of" stamps to reinforce the dossier aesthetic.



## 4. Elevation & Depth

In this system, depth is not a decoration; it is the navigation.



* **The Layering Principle:** Stacking `surface-container` tiers is mandatory. A "folder" (`primary_container`) should sit on the "briefcase interior" (`surface_container_low`). The contrast between these two tokens creates a natural lift.

* **Ambient Shadows:** For floating elements like the briefcase flap, use ultra-diffused shadows.

* *Shadow Color:* A tinted version of `on_surface` (deep umber) at 6% opacity.

* *Blur:* Minimum 24px to mimic soft, ambient desk lighting.

* **The "Ghost Border" Fallback:** If a divider is functionally required, use the `outline_variant` token at 15% opacity. Never use a 100% opaque border.

* **Skeuomorphic Detail:** Elements like folder tabs should use a `DEFAULT` (0.25rem) or `lg` (0.5rem) roundedness to mimic die-cut paper. Avoid perfectly sharp corners which feel digital and cold.



## 5. Components



### Buttons & CTAs

* **Primary:** Uses a subtle gradient from `primary` to `primary_container`. High contrast text (`on_primary`) for legibility.

* **Secondary/Tertiary:** No background; use `label-md` (monospaced) with a subtle `outline_variant` "ghost border" to look like a stamped area of a page.

* **Hover States:** Elevate the element slightly by shifting to a higher `surface_container` tier rather than changing the color hue.



### Folders & Cards

* **No Dividers:** Forbid the use of horizontal lines. Use the **Spacing Scale** (e.g., `8` or `12` units of vertical space) to separate content.

* **Visual Soul:** Folders should use the five specific muted tones (Tan, Green, Light Brown, Grey-Brown, Yellow) as their background. Use `body-sm` for the text inside the folder, mimicking a printed label.



### Input Fields

* **Style:** Styled to look like a line on a form. No bounding box. A single `outline_variant` (20% opacity) bottom border.

* **Focus:** The bottom border transitions to `primary` with a soft glow (diffused shadow).



### Stamped Metadata (Custom Component)

* **Description:** Small blocks of text used for "Property of..." or version numbers.

* **Styling:** `label-sm` (Space Grotesk), `on_surface_variant` color, uppercase, with a slight 2-degree rotation to look hand-stamped.



## 6. Do's and Don'ts



### Do:

* **Use Intentional Asymmetry:** If you have three folders, consider slightly different vertical offsets to make them feel "placed" rather than "rendered."

* **Embrace Tonal Shifts:** Use the `surface_container_highest` for elements that are "closest" to the user, like a flap being lifted.

* **Prioritize Typewriter Labels:** Use monospaced fonts for any technical or instructional text to maintain the "clerk" aesthetic.



### Don't:

* **Don't use pure black or pure grey:** All neutrals must be tinted with the deep brown/red of the `surface` token (`#210e0b`).

* **Don't use sharp shadows:** If a shadow looks like a line, it’s too dark. It should feel like a soft glow of darkness.

* **Don't use standard icons:** If an icon is needed, it should have a "hand-drawn" or "etched" quality to match the serif typography. No "bold" or "filled" modern geometric icons.