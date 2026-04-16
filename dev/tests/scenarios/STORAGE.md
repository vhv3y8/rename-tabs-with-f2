# Storage

### Initialization

- GIVEN extension is not installed
- WHEN install extension
- THEN storage is initialized as default storage value

### Migration

- GIVEN extension is already installed
- WHEN extension updates with storage value change and user opens browser?
- THEN storage should be migrated with updated default, overwritten by user settings value
