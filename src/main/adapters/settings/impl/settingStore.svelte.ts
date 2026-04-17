import type { SettingStore } from "@application/ports/SettingStore"
import { initialSetting, type Setting } from "@chrome/models/Setting"

export class AppSettings implements SettingStore {
  setting: Setting = initialSetting
  constructor() {}
}
