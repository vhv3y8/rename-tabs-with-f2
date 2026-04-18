/**
 * Service Worker
 */

// Initialize & Migrate Storage

export const defaultShortcutF2 = {
  ctrlKey: false,
  altKey: false,
  metaKey: false,
  shiftKey: false,
  key: "F2",
}
export const initialStorage =
  typeof __TEST_MIGRATION__ === "undefined" || !__TEST_MIGRATION__
    ? // initial value
      {
        settings: {
          darkmode: false,
          largerWidth: false,
          shortcut: defaultShortcutF2,
        },
      }
    : // for e2e storage migration test
      {
        settings: {
          SomeNewBoolean: true,
          SomeNewString: "hi",
          darkmode: true,
          largerWidth: true,
          shortcut: {
            ctrlKey: true,
            altKey: true,
            metaKey: true,
            shiftKey: true,
            key: "Q",
          },
        },
      }

export async function initializeStorage(storage) {
  return chrome.storage.local.set(storage)
}

export async function migrateStorage(updatedDefaults) {
  const userStorage = await chrome.storage.local.get(null)
  // @ts-ignore
  let migratedStorage = deepMerge(updatedDefaults, userStorage)

  return chrome.storage.local.set(migratedStorage)
}

function deepMerge(original = {}, toMerge = {}) {
  const isObj = (x) => x && typeof x === "object" && !Array.isArray(x)

  const out = { ...original }

  for (const k in toMerge) {
    const v = toMerge[k]
    const t = out[k]

    if (isObj(t) && isObj(v)) out[k] = deepMerge(t, v)
    else if (Array.isArray(t) && Array.isArray(v)) out[k] = [...t, ...v]
    else out[k] = v
  }

  return out
}

/**
 * Content Script & Extension Page
 */

// Settings

export async function getSettings() {
  return chrome.storage.local.get(["settings"]).then((db) => db.settings)
}

export async function setSettings(settings) {
  return chrome.storage.local.set({ settings })
}
