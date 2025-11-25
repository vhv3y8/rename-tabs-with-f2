# Close extension page without applying

### Basic

- GIVEN at extension page
- WHEN close extension page tab
- THEN focus back to last focus tab

### Last focus tab content script unavailable

- GIVEN at extension page AND last focus tab is NOT content script available
- WHEN close icon by exit
- THEN focus back to last focus tab anyway

### Multiple windows with extension page

- GIVEN there are multiple windows with extension page opened
- WHEN close extension page tab
- THEN focus back to that window's last focus tab
