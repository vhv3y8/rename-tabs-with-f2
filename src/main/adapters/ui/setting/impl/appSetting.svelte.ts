import type { SettingStore } from "@application/ports/SettingStore"
import { type Setting } from "@chrome/models/Setting"
import { ChromeMainFacadeImpl } from "@main/infra/ChromeMainFacade"

export class AppSetting implements SettingStore {
  private constructor(public setting: Setting) {
    $effect.root(() => {
      $effect(() => {
        // update storage on setting field update
        ChromeMainFacadeImpl.setSettings(this.setting)
      })
    })
  }
  // use this method to build instance
  static async build() {
    const setting = await ChromeMainFacadeImpl.getSettings()
    return new AppSetting(setting)
  }
}
