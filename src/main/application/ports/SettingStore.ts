import type { Setting } from "@chrome/models/Setting"

export interface SettingStore {
  get setting(): Setting
  set setting(value: Setting)
}
