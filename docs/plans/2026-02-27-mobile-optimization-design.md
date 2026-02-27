# Mobile Optimization Design — kaliz.ai

**Date:** 2026-02-27
**Target:** iPhone standard (~390px), covering 320-430px range
**Approach:** CSS-only responsive overhaul of existing `main.css` + minor JS changes
**Files affected:** `assets/css/main.css`, `assets/js/main.js`, `index.html` (minor)

---

## 1. Experience Timeline Fix (Critical)

**Problem:** At 768px breakpoint, `grid-template-columns: 32px 1fr` clips card text on the left. The "AI Project Manager" card is severely truncated.

**Fix (below 480px):**
- Remove timeline visual: hide `.exp-spine`, `.exp-node`
- Change `.exp-row` from grid to `display: block` — simple stacked cards
- Full-width cards with `padding: 1.25rem`
- Reset all `.exp-left` alignment overrides to left-align

## 2. Tools Section — Compact Techy Mobile Layout

**Problem:** Editorial strip layout (category label 130px min-width + chips side-by-side) creates excessive blank space on mobile when it stacks.

**Fix (below 768px):**
- Category label stacks above chips (already happens) but reduce spacing
- Reduce `.stack-cell` padding to `0.75rem 1rem`
- Reduce `.stack-cat` margin/gap
- Chips: `font-size: 0.7rem`, `padding: 0.35rem 0.6rem`, min-height 40px via padding
- Keep the colored left border accent for techy feel
- Reduce `.stack-bento` gap to `0.35rem`

## 3. Chat Widget — Mobile Fullscreen

**Problem:** Expanded chat takes 70% viewport height with mostly empty space. Minimized bubble is fine but wide.

**Fix (below 768px):**
- Minimized: shrink to 48x48px floating circle button with chat icon, positioned 16px from bottom-right
- Expanded: full-screen modal overlay
  - `position: fixed; inset: 0` with padding for safe areas
  - Header bar with avatar + close button (top)
  - Messages area: `flex: 1` fills available space
  - Input pinned to bottom with proper padding
  - Add `mobile-fullscreen` class toggled via JS
- Hide `.chat-nudge` on mobile
- Hide `.chat-border-glow` on mobile (performance)

## 4. Hero Section Spacing

**Fix (below 480px):**
- `.hero-badge` margin-bottom: `2rem` -> `1rem`
- `.hero-social` margin-top: `3rem` -> `1.5rem`
- `.hero-name` margin-bottom: `1rem` -> `0.5rem`
- Hide `.hero-scroll-indicator`
- Hero buttons: `width: 100%` stacked
- `.hero` padding-top: `3rem`

## 5. Stats Section

**Fix (below 480px):**
- `.stats-grid`: `repeat(2, 1fr)` instead of `1fr` (2x2 grid, not 4 stacked)
- Reduce stat card padding

## 6. Services Section

**Fix (below 480px):**
- `.svc-card` padding: `2.25rem` -> `1.5rem`
- `.svc-number` font-size: `6rem` -> `4rem`
- Featured card layout: single column stack

## 7. Testimonials

**Fix (below 480px):**
- `.testimonial-card` padding: `2.5rem` -> `1.5rem`
- Reduce quote decoration size

## 8. Contact Section

**Fix (below 480px):**
- Contact action buttons: full-width stacked
- Reduce vertical spacing

## 9. Popovers — Bottom Sheet on Mobile

**Fix (below 600px):**
- Convert popovers to bottom-sheet style (slide up from bottom, full-width)
- `position: fixed; bottom: 0; left: 0; right: 0; border-radius: 16px 16px 0 0`
- Remove absolute positioning logic via JS media query check

## 10. Navigation

**Fix (below 480px):**
- `.nav-toggle`: minimum 44x44px touch target
- `.nav` padding: `1rem 1.25rem`
- Add CTA button to mobile menu

## 11. Global Mobile Polish

- All sections: `padding: 3.5rem 0` below 480px
- Container: `padding: 0 1rem`
- Add `-webkit-tap-highlight-color: transparent` to interactive elements
- Input `font-size: 16px` minimum to prevent iOS auto-zoom

## 12. Performance

- Blob sizes reduced further at 480px (already partially done)
- Hide `.blob-3` on mobile
- Lower blur to `80px`
- Consider disabling noise texture overlay on mobile

---

## Implementation Order

1. Experience timeline fix (critical, visible breakage)
2. Chat widget mobile fullscreen
3. Tools section compact layout
4. Hero spacing
5. Services/testimonials/contact spacing
6. Popovers bottom-sheet
7. Navigation touch targets
8. Performance optimizations
9. Global polish
