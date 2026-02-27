# Mobile Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all mobile responsiveness issues on kaliz.ai — broken experience timeline, excessive whitespace in tools section, chat widget UX, and overall spacing/touch targets for iPhone (~390px).

**Architecture:** CSS media query overhaul in `assets/css/main.css` adding/rewriting rules at 480px and 768px breakpoints. Minor JS changes in `index.html` inline scripts for chat widget mobile fullscreen and popover bottom-sheet behavior. Minimal HTML changes.

**Tech Stack:** Vanilla CSS, Vanilla JS, Bootstrap Icons, static HTML (GitHub Pages)

---

### Task 1: Fix Experience Timeline Clipping (Critical)

**Files:**
- Modify: `assets/css/main.css:1004-1065` (existing 768px experience media query)

The experience cards below 480px have text clipping because the grid `32px 1fr` layout leaves content overflowing. The fix removes the timeline visual entirely on small phones and uses simple stacked cards.

**Step 1: Add 480px experience breakpoint in CSS**

Insert this new media query block **after** the existing `@media (max-width: 768px)` experience block (after line 1065):

```css
@media (max-width: 480px) {
  .exp-track {
    padding: 0;
  }

  .exp-spine {
    display: none;
  }

  .exp-row {
    display: block;
  }

  .exp-node {
    display: none;
  }

  .exp-spacer {
    display: none;
  }

  .exp-card {
    padding: 1.25rem;
    border-radius: var(--radius-md);
    margin-bottom: 0.75rem;
  }

  /* Reset all left-aligned card overrides */
  .exp-left .exp-card {
    text-align: left;
  }

  .exp-left .exp-details {
    direction: ltr;
  }

  .exp-left .exp-details li {
    text-align: left;
    padding-left: 1.25rem;
    padding-right: 0;
  }

  .exp-left .exp-details li::before {
    left: 0;
    right: auto;
    content: '>';
  }

  .exp-left .exp-tags {
    justify-content: flex-start;
  }

  .exp-left .exp-badge {
    margin-left: 0;
  }

  .exp-badge {
    font-size: 0.6rem;
  }

  .exp-date {
    font-size: 0.7rem;
  }

  .exp-role {
    font-size: 1.1rem;
  }
}
```

**Step 2: Verify on mobile**

Open Chrome DevTools → Toggle device toolbar → iPhone 14 (390px) → Scroll to Experience section. All cards should be full-width stacked blocks with no clipping.

**Step 3: Commit**

```bash
git add assets/css/main.css
git commit -m "fix: experience timeline clipping on mobile phones

Remove timeline spine and node visuals below 480px, use simple
stacked cards to prevent text clipping on small screens."
```

---

### Task 2: Chat Widget Mobile Fullscreen

**Files:**
- Modify: `assets/css/main.css:2523-2615` (existing 768px responsive block) and `assets/css/main.css:2016-2023` (chat-outer base)
- Modify: `index.html:948-961` (toggleChat function)

**Step 1: Add mobile chat CSS rules**

Add inside the **existing** `@media (max-width: 768px)` block (around line 2595, replacing the existing `.chat-outer` rule there):

```css
  /* Chat widget — mobile minimized = small circle */
  .chat-outer.minimized {
    width: 52px;
    right: 16px;
    bottom: 16px;
  }

  .chat-outer.minimized .chat-inner {
    border-radius: 50%;
    width: 52px;
    height: 52px;
  }

  .chat-outer.minimized .chat-header {
    padding: 0;
    justify-content: center;
    width: 52px;
    height: 52px;
  }

  .chat-outer.minimized .chat-header-text,
  .chat-outer.minimized .chat-minimize-btn {
    display: none;
  }

  .chat-outer.minimized .chat-header-info {
    gap: 0;
  }

  .chat-outer.minimized .chat-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.65rem;
  }

  .chat-outer.minimized .chat-border-glow {
    border-radius: 50%;
  }

  .chat-nudge {
    display: none !important;
  }

  /* Chat widget — mobile expanded = fullscreen */
  .chat-outer:not(.minimized) {
    position: fixed;
    inset: 0;
    width: 100%;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }

  .chat-outer:not(.minimized) .chat-inner {
    border-radius: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: none;
  }

  .chat-outer:not(.minimized) .chat-border-glow {
    display: none;
  }

  .chat-outer:not(.minimized) .chat-messages {
    height: auto;
    flex: 1;
  }

  .chat-outer:not(.minimized) .chat-input-area {
    padding-bottom: calc(0.85rem + env(safe-area-inset-bottom));
  }

  .chat-outer:not(.minimized) .chat-header {
    padding: 1rem 1.25rem;
  }
```

**Step 2: Update toggleChat JS for mobile**

In `index.html`, modify the `toggleChat()` function (line ~948) to handle body scroll lock on mobile:

```javascript
function toggleChat() {
  const widget = document.getElementById('chatWidget');
  const minimizeBtn = document.getElementById('minimizeBtn');
  isChatMinimized = !isChatMinimized;
  if (isChatMinimized) {
    widget.classList.add('minimized');
    minimizeBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
    document.body.style.overflow = '';
  } else {
    widget.classList.remove('minimized');
    minimizeBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
    stopNudge();
    // Lock body scroll on mobile when chat is fullscreen
    if (window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    }
    setTimeout(() => document.getElementById('chatInput').focus(), 300);
  }
}
```

**Step 3: Verify**

DevTools → iPhone 14:
- Minimized: small circle with "AK" avatar at bottom-right
- Tap to expand: fullscreen chat, messages fill viewport, input at bottom
- Tap minimize: returns to circle, page scrollable again

**Step 4: Commit**

```bash
git add assets/css/main.css index.html
git commit -m "feat: mobile fullscreen chat widget

Minimized state becomes a compact 52px circle. Expanded state
fills the entire viewport with messages area using flex-grow.
Hides nudge on mobile. Locks body scroll when chat is open."
```

---

### Task 3: Tools Section Compact Mobile Layout

**Files:**
- Modify: `assets/css/main.css:2568-2589` (existing 768px stack rules)

**Step 1: Rewrite tools mobile styles**

Replace the existing stack-related rules inside `@media (max-width: 768px)` (lines 2568-2589):

```css
  .stack-cell-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .stack-cat {
    min-width: unset;
    font-size: 0.62rem;
    gap: 0.35rem;
  }

  .stack-cell {
    padding: 0.75rem 1rem;
  }

  .stack-bento {
    gap: 0.35rem;
  }

  .stack-chip {
    font-size: 0.72rem;
    padding: 0.4rem 0.65rem;
    gap: 0.35rem;
  }

  .stack-chip i {
    font-size: 0.75rem;
  }

  .stack-chip-hero small {
    display: none;
  }

  .stack-items {
    gap: 0.35rem;
  }
```

**Step 2: Verify**

DevTools → iPhone 14 → Scroll to Tools section. Each category should be a compact card with the label above chips, minimal whitespace, colored left border visible. Chips should be small but still tappable (~40px height from padding).

**Step 3: Commit**

```bash
git add assets/css/main.css
git commit -m "fix: tools section compact mobile layout

Reduce cell padding, chip sizes, and gaps to eliminate excess
whitespace on phones while keeping the techy left-border accent."
```

---

### Task 4: Hero Section Mobile Spacing

**Files:**
- Modify: `assets/css/main.css:2617-2629` (existing 480px media query)

**Step 1: Expand the existing 480px media query**

Add these rules inside the existing `@media (max-width: 480px)` block:

```css
  .hero {
    padding-top: 3rem;
    min-height: auto;
    padding-bottom: 3rem;
  }

  .hero-badge {
    margin-bottom: 1rem;
  }

  .hero-name {
    margin-bottom: 0.5rem;
  }

  .hero-roles {
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }

  .hero-actions {
    gap: 0.75rem;
    width: 100%;
  }

  .hero-actions .btn-primary-gradient,
  .hero-actions .btn-outline {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .hero-social {
    margin-top: 1.5rem;
  }

  .hero-scroll-indicator {
    display: none;
  }
```

**Step 2: Verify**

DevTools → iPhone 14 → Hero section should be tighter: smaller badge margin, name and roles closer, buttons full-width stacked, social links closer, scroll indicator hidden.

**Step 3: Commit**

```bash
git add assets/css/main.css
git commit -m "fix: hero section mobile spacing

Tighten vertical spacing, make hero buttons full-width,
hide scroll indicator, reduce overall hero padding on phones."
```

---

### Task 5: Services, Testimonials, Contact Mobile Spacing

**Files:**
- Modify: `assets/css/main.css:2617-2629` (existing 480px media query)

**Step 1: Add section spacing rules to 480px breakpoint**

Append inside `@media (max-width: 480px)`:

```css
  .section {
    padding: 3.5rem 0;
  }

  /* Services */
  .svc-card {
    padding: 1.5rem;
  }

  .svc-number {
    font-size: 4rem;
  }

  .svc-title {
    font-size: 1.05rem;
  }

  .svc-desc {
    font-size: 0.82rem;
  }

  .svc-showcase {
    padding: 0 0.5rem;
  }

  /* Testimonials */
  .testimonial-card {
    padding: 1.5rem;
  }

  .testimonial-quote {
    font-size: 0.92rem;
  }

  .testimonial-quote::before {
    font-size: 2rem;
    vertical-align: -0.5rem;
  }

  /* Contact */
  .contact-actions {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .contact-actions .btn-primary-gradient,
  .contact-actions .btn-outline {
    width: 100%;
    justify-content: center;
  }

  .contact-text {
    font-size: 1rem;
  }

  /* Stats — 2x2 grid instead of single column */
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .stat-card {
    padding: 1.25rem;
  }
```

**Step 2: Verify**

DevTools → iPhone 14 → Check each section: Services cards should have less padding, testimonials tighter, contact buttons full-width stacked, stats in a 2x2 grid.

**Step 3: Commit**

```bash
git add assets/css/main.css
git commit -m "fix: services, testimonials, contact, stats mobile spacing

Reduce card padding, make CTAs full-width, use 2x2 stats grid,
tighten section padding across all content sections on phones."
```

---

### Task 6: Popovers Bottom-Sheet on Mobile

**Files:**
- Modify: `assets/css/main.css:1565-1573` (existing 600px popover media query)
- Modify: `index.html:1133-1174` (positionPopover function)

**Step 1: Replace popover 600px media query**

Replace the existing `@media (max-width: 600px)` popover block with:

```css
@media (max-width: 600px) {
  .popover {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    top: auto !important;
    width: 100% !important;
    max-height: 70vh;
    overflow-y: auto;
    border-radius: 20px 20px 0 0;
    padding: 1.5rem;
    transform: translateY(100%) !important;
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease,
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  .popover.active {
    transform: translateY(0) !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  .popover-svc {
    width: 100% !important;
  }

  .popover-backdrop.active {
    background: rgba(0, 0, 0, 0.5);
  }
}
```

**Step 2: Update positionPopover to skip positioning on mobile**

In `index.html`, modify `positionPopover()` function (line ~1133) to add a mobile check at the top:

```javascript
function positionPopover(popover, anchor) {
  // On mobile, use CSS bottom-sheet positioning
  if (window.innerWidth <= 600) {
    popover.classList.add('active');
    return;
  }

  // Desktop: absolute positioning logic (unchanged)
  popover.style.left = '0';
  popover.style.top = '0';
  popover.classList.add('active');
  // ... rest of existing code unchanged
```

**Step 3: Verify**

DevTools → iPhone 14 → Tap a tool chip or service card. Popover should slide up from bottom as a sheet, full-width, rounded top corners. Tap backdrop to dismiss.

**Step 4: Commit**

```bash
git add assets/css/main.css index.html
git commit -m "feat: bottom-sheet popovers on mobile

Convert absolute-positioned popovers to bottom-sheet style
on screens below 600px. Slide-up animation with backdrop."
```

---

### Task 7: Navigation Touch Targets & Mobile Menu CTA

**Files:**
- Modify: `assets/css/main.css:266-274` (nav-toggle styles)
- Modify: `index.html:82-91` (mobile menu HTML)

**Step 1: Update nav-toggle CSS for larger touch target**

Replace the `.nav-toggle` block (line 266-274):

```css
.nav-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
}
```

**Step 2: Add CTA to mobile menu HTML**

Find the mobile menu in `index.html` (line ~82-91) and add a CTA button after the last link:

```html
  <div class="mobile-menu" id="mobileMenu">
    <button class="mobile-menu-close" id="mobileMenuClose"><i class="bi bi-x-lg"></i></button>
    <a href="#about" class="mobile-link">About</a>
    <a href="#experience" class="mobile-link">Experience</a>
    <a href="#services" class="mobile-link">Services</a>
    <a href="#testimonials" class="mobile-link">Testimonials</a>
    <a href="#contact" class="mobile-link nav-cta" style="font-size: 1rem; padding: 0.75rem 2rem; margin-top: 1rem;">Get in Touch</a>
  </div>
```

**Step 3: Add 480px nav padding**

Add inside `@media (max-width: 480px)`:

```css
  .nav {
    padding: 1rem 1.25rem;
  }

  .nav.scrolled {
    padding: 0.6rem 1.25rem;
  }
```

**Step 4: Commit**

```bash
git add assets/css/main.css index.html
git commit -m "fix: navigation touch targets and mobile menu CTA

Increase hamburger button to 44x44px minimum, add Get in Touch
CTA to mobile menu, tighten nav padding on phones."
```

---

### Task 8: Performance Optimizations

**Files:**
- Modify: `assets/css/main.css:2617-2629` (existing 480px media query)

**Step 1: Add performance rules to 480px breakpoint**

Append inside `@media (max-width: 480px)`:

```css
  /* Performance — reduce GPU load on mobile */
  .blob {
    filter: blur(80px);
  }

  .blob-3 {
    display: none;
  }

  /* Disable noise texture overlay on mobile */
  body::after {
    display: none;
  }

  /* Reduce scroll-top button overlap */
  .scroll-top {
    bottom: 80px;
    left: 16px;
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
```

**Step 2: Commit**

```bash
git add assets/css/main.css
git commit -m "perf: reduce GPU load on mobile phones

Lower blob blur, hide third blob and noise overlay on mobile.
Reposition scroll-to-top to avoid chat widget overlap."
```

---

### Task 9: Global Mobile Polish

**Files:**
- Modify: `assets/css/main.css` (add to existing 480px block + base styles)

**Step 1: Add global mobile polish**

Add to the base styles section (near `a` reset around line 84):

```css
button, a, [tabindex], input, select, textarea {
  -webkit-tap-highlight-color: transparent;
}
```

Add inside `@media (max-width: 480px)`:

```css
  /* Prevent iOS auto-zoom on input focus */
  input, select, textarea {
    font-size: 16px;
  }

  .container {
    padding: 0 1rem;
  }

  .footer-inner {
    gap: 0.75rem;
  }

  .footer-copy {
    font-size: 0.72rem;
  }
```

**Step 2: Final verification**

DevTools → iPhone 14 → Scroll through entire page. Check:
- No horizontal scroll
- All text readable
- All buttons tappable
- Chat widget minimized/expanded works
- Popovers slide up as bottom sheets
- No text clipping anywhere
- Smooth scrolling, no jank

**Step 3: Commit**

```bash
git add assets/css/main.css
git commit -m "fix: global mobile polish

Add tap-highlight removal, prevent iOS auto-zoom on inputs,
tighten container and footer padding for phones."
```

---

## Implementation Summary

| Task | Priority | Files | Est. Lines Changed |
|------|----------|-------|-------------------|
| 1. Experience timeline fix | Critical | main.css | ~50 |
| 2. Chat widget fullscreen | High | main.css, index.html | ~70 |
| 3. Tools section compact | High | main.css | ~25 |
| 4. Hero spacing | Medium | main.css | ~30 |
| 5. Section spacing | Medium | main.css | ~40 |
| 6. Popovers bottom-sheet | Medium | main.css, index.html | ~30 |
| 7. Nav touch targets | Low | main.css, index.html | ~15 |
| 8. Performance | Low | main.css | ~15 |
| 9. Global polish | Low | main.css | ~15 |
