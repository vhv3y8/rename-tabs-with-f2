import type { Setting } from "./models/Setting"

const ChromeStorage = {
  initializeStorage(storage: Record<string, any>) {
    return chrome.storage.local.set(storage)
  },
  // migrateStorage(updatedDefaults) {
  //   const userStorage = await chrome.storage.local.get(null)
  //   // @ts-ignore
  //   let migratedStorage = deepMerge(updatedDefaults, userStorage)

  //   return chrome.storage.local.set(migratedStorage)
  // },
  setting: {
    async getSettings() {
      return chrome.storage.local.get(["settings"]).then((db) => db.settings)
    },
    async setSettings(settings: Setting) {
      return chrome.storage.local.set({ settings })
    },
  },
}

export default ChromeStorage
