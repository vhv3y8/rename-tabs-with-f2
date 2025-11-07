// Initialize & Migrate Storage

export const defaultShortcutF2 = {
  ctrlKey: false,
  altKey: false,
  metaKey: false,
  shiftKey: false,
  key: "F2",
}
export const initialStorage = {
  settings: {
    darkmode: false,
    largerWidth: false,
    shortcut: defaultShortcutF2,
  },
}

export async function initializeStorage(storage) {
  return chrome.storage.local.set(storage)
}

export async function migrateStorage(updatedDefaults) {
  const userStorage = await chrome.storage.local.get(null)
  // @ts-ignore
  let migratedStorage = { ...updatedDefaults, ...userStorage }

  console.log("[updatedDefaults]", updatedDefaults)
  console.log("[userStorage]", userStorage)
  console.log("[migratedStorage]", migratedStorage)

  return chrome.storage.local.set(migratedStorage)
}

// Settings

export async function getSettings() {
  return chrome.storage.local.get(["settings"]).then((db) => db.settings)
}

export async function setSettings(settings) {
  return chrome.storage.local.set({ settings })
}
