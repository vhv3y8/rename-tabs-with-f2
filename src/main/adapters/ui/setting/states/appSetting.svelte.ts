import { type Setting } from "@chrome/models/Setting"
import { ChromeFacade } from "@main/infra/platform/impl/ChromeMainFacade"

export class AppSetting {
  private constructor(public setting: Setting) {
    this.setting = $state(setting)
    $effect.root(() => {
      $effect(() => {
        // update storage on setting field update
        ChromeFacade.setSettings(this.setting)
      })
    })
  }
  // use this method to build instance
  static async build() {
    const setting = await ChromeFacade.getSettings()
    return new AppSetting(setting)
  }
}
// const app = await AppSetting.build()
// export const setting = app.setting
