# ProjectCortex — Design System

**Obsidian Gold.** One token layer (`tokens.css`) shared by all four surfaces. This document is the
contract; `tokens.css` is the implementation. Read this before changing any stylesheet.

---

## 1. Surfaces

| Surface | File | Loaded by |
|---|---|---|
| In-page assistant panel | `content.css` | content script |
| Command palette | `PCX_CSS` in `content_productivity.js` | shadow DOM |
| Extension popup | `popup.html` | extension page |
| Options dashboard | `options.html` | extension page |

All four read the same tokens. **Never hardcode a colour, radius, duration or font stack** — if the
token you need is missing, add it to `tokens.css` rather than inventing a literal.

### How the tokens reach each surface

- **Content scripts** get `tokens.css` from the `css` array in `manifest.json`, injected *before*
  `content.css`.
- **Extension pages** link it: `<link rel="stylesheet" href="tokens.css">` in `<head>`, before the
  inline `<style>`.
- **Shadow DOM** (the palette) inherits custom properties through its host element, so no extra
  wiring is needed.

### Why `tokens.css` declares custom properties *only*

The content-script stylesheet is injected into the host page. Anything else in a `:root` block —
`color-scheme`, `font-family`, a reset — would leak into and visibly break whatever site the user is
on. Custom properties are inert: they do nothing until something references them. `color-scheme:
dark` therefore belongs on the **extension pages only**, never in `tokens.css`.

---

## 2. Colour

Warm near-black surfaces, gold identity, green as a signal. Warm rather than blue-black so the gold
does not have to fight a cold backdrop.

### Primitives

| Ramp | Steps |
|---|---|
| Obsidian | `--cx-ink-0 #0B0A07` · `ink-1 #12100B` · `ink-2 #1A1712` · `ink-3 #241F17` · `ink-4 #312A1F` · `ink-5 #453B2B` |
| Gold | `--cx-gold-300 #F2D071` · `400 #E8B830` · `500 #D4A017` · `600 #B8860B` · `700 #8A6508` |
| Signal | `--cx-green-400 #10B981` · `500 #059669` · `600 #047857` |
| Danger | `--cx-red-400 #F87171` · `500 #EF4444` · `600 #B42318` |

### Semantic tokens (use these, not the primitives)

| Token | Use for |
|---|---|
| `--cx-canvas`, `--cx-canvas-raised` | flat page backgrounds |
| `--cx-glass`, `--cx-glass-soft`, `--cx-glass-strong` | floating surfaces over unknown content |
| `--cx-surface`, `--cx-surface-raised`, `--cx-surface-sunken` | resting card / raised card / inset well |
| `--cx-surface-hover`, `--cx-surface-active`, `--cx-surface-selected` | interaction states |
| `--cx-border`, `--cx-border-soft`, `--cx-border-faint`, `--cx-border-strong`, `--cx-hairline` | dividers and outlines |
| `--cx-text`, `--cx-text-secondary`, `--cx-text-tertiary`, `--cx-text-disabled` | text hierarchy |
| `--cx-accent`, `--cx-accent-bright`, `--cx-accent-deep`, `--cx-accent-faint`, `--cx-on-accent` | gold identity |
| `--cx-signal`, `--cx-signal-deep`, `--cx-signal-faint`, `--cx-signal-border` | success / verified |
| `--cx-danger`, `--cx-danger-deep`, `--cx-danger-faint`, `--cx-danger-border` | errors / destructive |
| `--cx-scrim` | modal backdrop |

### Contrast floors

Body text ≥ **4.5:1**, primary headings ≥ **7:1**. Gold `#D4A017` on `--cx-canvas` is ~7.9:1 and is
safe for text; it is not safe as small text on `--cx-ink-4`. Gold buttons use **dark** text
(`--cx-on-accent`), never white.

### The light → dark inversion

The old surfaces were light cream. When migrating a rule, apply this in order:

| Legacy value | Becomes |
|---|---|
| `rgba(0,0,0,α)` as a fill or border | `rgba(255,255,255,α)` → `--cx-border-faint` / `--cx-border-soft` / `--cx-surface-sunken` |
| `rgba(255,255,255,α)` as a raised fill on cream | `--cx-surface-raised` / `--cx-surface-hover` |
| cream / beige (`#e1d7c2`, `#f7f8fa`, `rgba(225,215,194,*)`, `rgba(245,240,232,*)`) | `--cx-canvas` / `--cx-glass*` |
| `#1a1a1a`, `#17212e`, `#fff` **as page text** | `--cx-text` |
| `#333`, `#555`, `#666`, `#888`, `#7a7a7a`, `#9a9a9a`, `#596576`, `#6b6b6b` | `--cx-text-secondary` / `--cx-text-tertiary` |
| `#aaa` | `--cx-text-tertiary` |
| gold literals `#b8860b #d4a017 #e8b830 #c9951e` | `--cx-accent-*` |
| green literals `#059669 #065f46 #4a9e7e` | `--cx-signal*` |
| red literals `#ef4444 #b42318 #dc2626` | `--cx-danger*` |
| `#fff` / `color: white` **on a gold, green or dark chip** | keep, or `--cx-on-accent` for gold |
| macOS traffic lights `#ff5f57 #ff3d30 #ffbd2e #28c840` | **keep verbatim** — authentic chrome |

---

## 3. Type

System-first stacks. **No web font is fetched**: the extension must work offline, and a remote
stylesheet inside a content script would leak the user's browsing to a third party. Inter and
JetBrains Mono are used when the user already has them.

```
--cx-font-sans   Inter, Outfit, -apple-system, ..., sans-serif
--cx-font-mono   JetBrains Mono, Geist Mono, ui-monospace, ..., monospace
```

| Token | Size | Tracking | Use |
|---|---|---|---|
| `--cx-text-display` | 26px | `--cx-track-display` -0.03em | panel headline |
| `--cx-text-title` | 19px | `--cx-track-title` -0.02em | section title |
| `--cx-text-heading` | 15px | -0.015em | result section header |
| `--cx-text-body` | 13px | `--cx-track-body` | body copy |
| `--cx-text-small` | 12px | — | secondary copy |
| `--cx-text-micro` | 11px | — | hints |
| `--cx-text-label` | 10px | `--cx-track-label` +0.14em | UPPERCASE eyebrow labels |

Weights: `--cx-weight-normal 400` · `medium 500` · `semibold 600` · `bold 700` · `black 800`.
Line heights: `--cx-leading-display 1.2` · `title 1.3` · `body 1.55` · `tight 1.2` (mono/dense).

---

## 4. Space, radius, elevation

**Space** — 4px rhythm: `--cx-space-1 4px` · `2 8` · `3 12` · `4 16` · `5 20` · `6 24` · `8 32` · `10 40`.

**Radius** — `--cx-radius-xs 6px` · `sm 9` · `md 12` · `lg 16` · `xl 20` · `full 999`.

**Elevation** — on dark UI a shadow carries less information than a light ring, so each level pairs
a drop shadow with an inset hairline. That pairing is what makes a dark surface read as *floating*
rather than as a hole in the page.

`--cx-elev-1` resting · `--cx-elev-2` raised · `--cx-elev-3` overlay · `--cx-elev-4` the panel ·
`--cx-elev-glow` accent focus/active.

**Controls** — `--cx-control-sm 28px` · `md 34` · `lg 42`. Desktop pointer targets; the 44px touch
floor is a mobile concern and does not apply here.

---

## 5. Motion

One ladder, one easing family, all surfaces.

| Token | Value | Use |
|---|---|---|
| `--cx-dur-instant` | 90ms | press feedback |
| `--cx-dur-fast` | 150ms | hover |
| `--cx-dur-base` | 200ms | small state changes |
| `--cx-dur-enter` | 320ms | entrances |
| `--cx-dur-exit` | 220ms | exits — always shorter than the entrance |
| `--cx-dur-panel` | 460ms | the big panel slide |
| `--cx-stagger` | 26ms | per-item list reveal |

Easing: `--cx-ease-out` (default), `--cx-ease-in`, `--cx-ease-in-out`, `--cx-ease-spring` (gentle
overshoot only), `--cx-ease-linear`.

### Rules

1. **Animate `transform`, `opacity`, `color`, `background-color`, `border-color`, `box-shadow` only.**
   Never `width`, `height`, `margin`, or `top`. The single exception is the fixed panel's `left`
   slide: the panel is `position: fixed`, so it cannot reflow the page.
2. **Hover displacement <= 2px.** Beyond that it reads as motion instead of feedback.
3. **Never move a pressed element's box** — a pressed state must not trigger layout jitter.
4. **Exits are shorter than entrances.**
5. **No infinite or decorative animation.** Infinite loops are reserved for genuine progress
   indicators (the loading skeleton). A perpetually glowing border is decoration, not information.
6. **Always attach the reverse transition**, so a hover state cannot stick when the pointer leaves
   fast.
7. **Never animate `height` for content reveal** — the panel body scrolls.

### Reduced motion

`tokens.css` collapses every duration to ~1ms under `prefers-reduced-motion: reduce`. Components that
animate **must** drive their durations from the tokens so this single override is enough. Add a
component-level media block only when a rule needs to skip motion entirely (e.g. render the final
state with no transition).

---

## 6. Accessibility contract

Non-negotiable, checked before any UI change ships.

- **Visible focus on every operable control**, including inside modals and the shadow DOM:
  `:focus-visible { outline: none; box-shadow: var(--cx-focus-ring); }`. Never `outline: none`
  without a replacement.
- **Use real `<button>` elements.** A clickable `<div>`/`<span>` needs `role`, an accessible name,
  keyboard operation and visible focus — a native button already has all four.
- **Never reveal the only affordance on hover.** Actions must be reachable and discoverable without
  a pointer.
- **Tab order must match visual order**, and a modal must trap focus and restore it on close.
- **Focus must not be obscured** (WCAG 2.2 AA). A persistent overlay must not cover the focused
  control.
- **Colour is never the only indicator.** Pair it with text, an icon or a border.
- **Decorative icons get `aria-hidden="true"`**; icon-only buttons get `aria-label`.
- **Contrast**: body >= 4.5:1, headings >= 7:1, in the shipped theme.
- **`prefers-reduced-motion` respected** everywhere motion is used.
- **Announce async state** — `role="status"` / `aria-live="polite"` for loading and results.

---

## 7. Migration checklist

Per surface:

- [ ] `tokens.css` loaded before the local stylesheet
- [ ] local `:root` token block deleted (`color-scheme: dark` may stay on extension pages)
- [ ] zero hardcoded colours, radii, durations or font stacks left
- [ ] every hover has a matching reverse transition
- [ ] no infinite/decorative animation
- [ ] `:focus-visible` on every operable control
- [ ] `prefers-reduced-motion` handled
- [ ] no ID or class used by JS renamed
- [ ] `npm test` green

Audit helper:

```bash
python css-audit.py content.css     # lists every remaining hex + rgba literal with counts
```
