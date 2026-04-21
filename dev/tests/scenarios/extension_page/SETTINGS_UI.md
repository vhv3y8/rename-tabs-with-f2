# Settings UI

### Shows storage setting correctly

- GIVEN at extension page
- WHEN open settings ui
- THEN show settings value at storage

### Update appearance settings

- GIVEN at extension page settings ui
- WHEN change setting value
- THEN update storage settings current option AND update settings ui AND apply appearance

## Update shortcut

### Listen keyboard input

- GIVEN when listening shortcut update
- WHEN at keyboard inputs
- THEN filter and show input correctly

### OK & Reset to F2

- GIVEN when listening shortcut update
- WHEN press valid shortcut AND click 'ok' button
- THEN update storage settings shortcut AND update settings ui AND show i18n toast

---

- GIVEN when listening shortcut update
- WHEN click 'reset to f2' button
- THEN update storage settings shortcut to F2 AND update settings ui AND show i18n toast

### Cancel

- GIVEN when listening shortcut update
- WHEN click 'cancel' button
- THEN exit listening shortcut mode AND show storage shortcut value
