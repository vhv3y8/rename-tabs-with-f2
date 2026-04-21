import {
  fillMissingDeeplyAfterMigration,
  MigrationAggregator,
} from "@lib/models/migration"
import {
  initialSettingPartial,
  settingMigrationMap,
  type Setting,
} from "../models/Setting"
import * as semver from "semver"

export const chromeInitialSetting: Setting = {
  ...initialSettingPartial,
}
const INITIAL_STORAGE = {
  settings: chromeInitialSetting,
}

const ChromeStorage = {
  async initializeStorage() {
    return chrome.storage.local.set(INITIAL_STORAGE)
  },
  async migrateStorage(
    previousVersion: string,
    updatedDefaults: any = INITIAL_STORAGE,
  ) {
    let userStorage = await chrome.storage.local.get(null)
    console.log("[migration] [userStorage]", userStorage)

    previousVersion = semver.coerce(previousVersion)?.version || previousVersion
    if (semver.valid(userStorage.version)) previousVersion = userStorage.version
    console.log("[migration] [previous version]", previousVersion)

    let migratedStorage: any = {}
    // settings
    migratedStorage.settings = new MigrationAggregator(
      settingMigrationMap,
    ).migrate(userStorage.settings, previousVersion)

    // always set version
    const version = chrome.runtime.getManifest().version
    migratedStorage.version = version
    // fill missing fields
    migratedStorage = fillMissingDeeplyAfterMigration(
      migratedStorage,
      updatedDefaults,
    )
    console.log("[migration] [migratedStorage]", migratedStorage)
    return chrome.storage.local.set(migratedStorage)
  },
  // getFullStorage() {
  //   return chrome.storage.local.get(null)
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
