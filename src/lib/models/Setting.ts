import { type TargetVersionMigrationRecord } from "./migration"

export type HotKey = {
  ctrlKey: boolean
  altKey: boolean
  metaKey: boolean
  shiftKey: boolean
  key: string
}
export type Setting = {
  pointColor: "cornflower" | "mutedcoral" | "coralorange"
  darkmode: boolean
  largerWidth: boolean
  persistAndApplyTitles: boolean
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
  pointColor: "cornflower",
  darkmode: false,
  largerWidth: false,
  persistAndApplyTitles: false,
  hotkey: F2HotKey,
} satisfies Setting

export const settingMigrationMap: TargetVersionMigrationRecord = {
  "1.3.0": (editor) => editor.map("shortcut", "hotkey"),
}
