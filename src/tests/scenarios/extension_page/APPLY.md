# Apply

e2e: `e2e/tests/extension_page/apply.test.js`

### Basic

- GIVEN at extension page AND some title input has changed
- WHEN press ctrl + enter
- THEN apply title changes to each tab AND close extension page AND focus last focused tab

---

- GIVEN at extension page AND some title input has changed
- WHEN click 'ctrl + enter' ui button
- THEN apply title changes to each tab AND close extension page AND focus last focused tab

### Last focus tab content script unavailable

- GIVEN at extension page AND last focus tab is NOT content script available
- WHEN apply
- THEN close extension page AND focus last focus tab anyway

### Multiple windows with extension page

- GIVEN there are multiple windows with extension page opened
- WHEN apply
- THEN close extension page AND focus back to that window's last focus tab
