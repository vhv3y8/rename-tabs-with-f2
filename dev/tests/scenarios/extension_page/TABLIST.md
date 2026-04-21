# Tablist

e2e: `e2e/tests/extension_page/tablist.test.js`

## Basic

### Show current window tabs in appearance order

- GIVEN there are multiple tabs in current window
- WHEN at extension page
- THEN list current window tab items in appearance order

### Focus last focus tab item initially

- GIVEN at extension page
- WHEN last focus tab is content script available
- THEN focus that tab item AND select all text

---

- GIVEN at extension page
- WHEN last focus tab is NOT content script available
- THEN ???

## Movement

### Move to next, previous

- GIVEN at extension page
- WHEN press key Enter or Tab
- THEN move to next item AND select all text

---

- GIVEN at extension page
- WHEN press key Shift+Enter or Shift+Tab
- THEN move to previous item AND select all text

---

- GIVEN when focusing last tab item / first tab item
- WHEN moving to next item / previous item
- THEN focus first item / last item AND select all text

### Move to initial

- GIVEN when focusing not initial tab item
- WHEN press Escape
- THEN focus initial tab item AND select all text

### Click tab item

- GIVEN at extension page
- WHEN click tab item
- THEN focus that tab item input AND select all text

## Content script unavailable tabs

### Not focusable / Blur / Tooltip on hover

- GIVEN there are content script unavailable tabs
- WHEN at extension page
- THEN make unavailable tabs not focusable AND blur their ui AND show tooltip on hover

### Initial tab is content script unavailable

- GIVEN initial tab(last focus tab) is content script unavailable
- WHEN at extension page
- THEN focus first content script available tab item by order AND set them as initial tab item ?

### All tabs are content script unavailable

- GIVEN
- WHEN
- THEN
