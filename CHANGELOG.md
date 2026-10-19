# Changelog

All notable changes to ProjectCortex are documented here.
This project follows [Semantic Versioning](https://semver.org/).

---

## [11.3.0] — The Command Center

The largest productivity release so far. Adds a keyboard-first layer on top of the existing
assistant, fixes a silent answer-parsing bug, and makes the build pipeline verifiable.

### Added

**Cortex Command Center** (`content_productivity.js`)
- **Command palette** on `Alt+K` / `Ctrl+Shift+K` / `⌘+Shift+K`. Fuzzy-searches every AI action,
  workflow, and past answer from one keystroke. Full keyboard navigation.
- **Workflows** — user-defined prompt presets with `{{selection}}`, `{{page}}`, `{{context}}`,
  `{{title}}`, `{{host}}`, `{{url}}` and `{{date}}` tokens. Create, edit and delete them inside
  the palette. Seven defaults ship out of the box: Extract action items, Explain like I'm 5,
  Key facts/numbers/dates, Bullet-point digest, Translate to English, Rewrite professionally,
  and Draft a reply.
- **Recall** — every finished answer is persisted locally (25-entry ring buffer, de-duplicated,
  newest first) and is searchable and re-openable from the palette.
- **Copy as Markdown** — converts the current page into clean Markdown (headings, lists,
  blockquotes, links, code blocks) via a curated block walker.
- **Re-run last action** and **Open settings** commands.
- The palette renders inside a **Shadow DOM**, so no host page stylesheet can reach it, and it
  swallows its own keyboard/mouse events so page shortcuts never fire while it is open.
- Context menu entry (**Cortex Command Center**) available on page, selection and editable
  contexts, always routed to the top frame.

**AI engine**
- `window.__ProjectCortexAI.runWorkflow()` — resolves workflow tokens and runs them through the
  existing request pipeline, including the truncation-recovery and retry logic.
- `window.__ProjectCortexAI.showStoredResult()` — re-renders a recalled answer without writing it
  back into history a second time.
- New `workflow` action profile (2048 tokens, temperature 0.4) so formatting instructions and
  extracted facts stay faithful to the source.

**Design system — "Obsidian Gold"**
- `tokens.css` is now the single source of truth for all four surfaces (in-page panel,
  command palette, popup, options dashboard). Previously each carried its own palette: four
  variable vocabularies, three accent scales and two radius scales, with the popup still on a
  **blue** accent (`#3155d9`) while everything else was gold.
- One warm obsidian ramp, one gold ramp, green reserved for signal states, a 4px space rhythm,
  a radius scale, a five-level elevation ladder that pairs each shadow with an inset hairline
  (on dark UI a shadow alone carries almost no information), and a single type scale.
- One motion language: `90ms` press, `150ms` hover, `320ms` enter, `220ms` exit, with hover
  displacement capped under 2px so it reads as feedback rather than motion.
- `DESIGN-SYSTEM.md` documents the contract, including the light-to-dark inversion table and the
  accessibility rules every surface is held to.
- The command palette was rebuilt against it: glass depth, a static gold rail on the active row,
  a capped stagger on the row reveal, grouped sections, and a visible count.
- Safety: `tokens.css` publishes **only** project-prefixed custom properties, because a
  content-script stylesheet lands on the host page's `:root`. A generic name such as `--text`,
  `--surface`, `--border`, `--accent` or `--muted` — all of which Tailwind and shadcn themes
  define — would have silently overwritten the site's own variables and broken real websites.

**Testing & tooling**
- `tests/` — a dependency-free suite of 37 tests that loads the real content scripts into a Node
  VM with a `chrome`/DOM stub: MCQ parsing, LaTeX/HTML sanitisation, Markdown export, fuzzy-search
  ranking, workflow and recall storage semantics, the cross-module contract, and the dist
  comment-stripper. `npm test` now runs them before packaging.
- `npm run verify:dist` — builds `/dist` and parse-checks every emitted file.
- `build.js` now exports its transform helpers so they can be tested.

### Fixed

- **White text on the gold primary button failed contrast outright** (~1.9:1). Gold buttons now
  use a dark ink (`--cx-on-accent`), which also matches the rest of the design system.
- **The popup carried a stray blue accent** while every other surface was gold.
- **The panel animated `filter: blur()` on every entry and exit frame** and declared
  `will-change: left, opacity, filter`, promoting a compositor layer for a property that cannot
  be composited. The blur is gone and `will-change` is now limited to opacity.
- **Three decorative animations ran forever** — a crawling border gradient on both the panel and
  the bubble, and a gradient sweep on the licence CTA. Two attention pulses on the answer cards
  also looped indefinitely; they now run once and settle. The only infinite animations left are
  the three genuine progress indicators (skeleton shimmer, loading dots, typing cursor).
- **A stuck drag left the whole page unselectable until a refresh.** Dragging the panel
  raised a full-viewport `#pm-drag-overlay` element (`cursor: move`, `z-index: 2147483647`)
  that was only torn down by a `mouseup` the panel actually received. Releasing the mouse
  outside the browser window, over a cross-origin iframe, or after a tab switch stranded the
  overlay on top of the page — the cursor stayed on the cross and text selection was dead until
  the page was reloaded. The drag state now lives on a class on `<html>`, which can only ever
  affect the cursor, and every plausible way for a drag to end is wired up: capture-phase
  `mouseup` on `window`, `pointercancel`, `blur`, `dragend`, `mouseout` with a null
  `relatedTarget`, `visibilitychange`, `Escape`, and a `buttons === 0` recovery check on
  `mousemove` that ends the drag the instant the pointer returns. Any state that still leaks is
  swept on the next `mousedown`, and `cleanup()` clears it on navigation. The overlay element
  also had no `id`, so the `#pm-drag-overlay` selectors in `isOurElement` and `cleanup()` had
  never matched it; both those references are now gone or defensive.
- **A `@media (prefers-reduced-motion: reduce)` block in `content.css` was silently dead.**
  It had been pasted as UTF-16LE into the UTF-8 stylesheet, so every character was interleaved
  with a NUL byte and browsers discarded the entire rule. Those accessibility rules now apply.
- **Single-character roman numerals were never recognised.** An option labelled `I.` was treated
  as the literal letter `I` while `II.`/`III.`/`IV.` were converted, producing option labels like
  `[I, B, C, D]`. An answer of `I` then matched nothing, so the entire model response was thrown
  away and silently retried. `I.`–`IV.` now map to `A`–`D` correctly.
- **The dist comment-stripper could corrupt valid source.** The `/(?<![:'"`])\/\/.*/` strip
  truncated any line ending in `/…\/\//` — for example `/^https?:\/\//` — leaving an unterminated
  regular expression in the shipped bundle. Replaced with a string-, template-literal- and
  regex-aware scanner.
- **`npm run assets` hard-crashed without devDependencies.** Obfuscation is now optional; the build
  completes and ships comment-stripped sources with a clear notice.
- **Obfuscation output was never validated.** The build now syntax-checks obfuscated files and
  falls back to plain source rather than shipping something broken.
- **The options dashboard was unreadable on tall pages.** `fitToScreen()` scaled the entire
  container with CSS `zoom` and re-ran on every DOM mutation via a `MutationObserver`. Removed;
  the dashboard now scrolls naturally.
- A storage failure during history recording could surface as an unhandled promise rejection.

### Changed

- Version bumped to `11.3.0` across `manifest.json` and `package.json` (now asserted equal by a test).
- The shortcut, packaging and content-script lists are now covered by regression tests so a new
  file can never be forgotten in the manifest or the Web Store archive.

---

## [11.2.3]

- Resilient page actions, JWT hardware-bound licensing, Chrome Web Store policy compliance and
  anti-cheat capabilities.
