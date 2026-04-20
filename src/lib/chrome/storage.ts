import { initialSettingPartial, type Setting } from "../models/Setting"

export const chromeInitialSetting: Setting = {
  extVersion: chrome.runtime.getManifest().version,
  ...initialSettingPartial,
}
const INITIAL_STORAGE = {
  settings: chromeInitialSetting,
}

const ChromeStorage = {
  INITIAL_STORAGE,
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

// export const initialStorage =
//   typeof __TEST_MIGRATION__ === "undefined" || !__TEST_MIGRATION__
//     ? // initial value
//       {
//         settings: {
//           darkmode: false,
//           largerWidth: false,
//           shortcut: defaultShortcutF2,
//         },
//       }
//     : // for e2e storage migration test
//       {
//         settings: {
//           SomeNewBoolean: true,
//           SomeNewString: "hi",
//           darkmode: true,
//           largerWidth: true,
//           shortcut: {
//             ctrlKey: true,
//             altKey: true,
//             metaKey: true,
//             shiftKey: true,
//             key: "Q",
//           },
//         },
//       }
