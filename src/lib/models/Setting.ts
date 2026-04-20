import { type TargetVersionMigrationRecord } from "./migration"

export type HotKey = {
  ctrlKey: boolean
  altKey: boolean
  metaKey: boolean
  shiftKey: boolean
  key: string
}
export type Setting = {
  darkmode: boolean
  largerWidth: boolean
  hotkey: HotKey
}

// default values
export const F2HotKey: HotKey = {
  ctrlKey: false,
  altKey: false,
  metaKey: false,
  shiftKey: false,
  key: "F2",
}
export const initialSettingPartial = {
  darkmode: false,
  largerWidth: false,
  hotkey: F2HotKey,
} satisfies Partial<Setting>

// maybe use chrome.runtime.onInstalled "update" previousVersion
// for versions before 1.3
// export function resolveSettingExtVersionForLegacy(
//   settingData: any,
// ): "1.0.0" | "1.1.0" | "1.2.0" | "1.2.1" {}

export const settingMigrationMap: TargetVersionMigrationRecord = {
  "1.3.0": (editor) => editor.map("shortcut", "hotkey"),
}
