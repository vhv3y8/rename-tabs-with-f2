import { type Setting } from "@lib/models/Setting"
import type { PlatformMainFacade } from "@main/application/ports/infra/PlatformMainFacade"

export class InMemorySetting {
  setting: Setting
  private constructor(
    private _setting: Setting,
    // maybe just set setting function
    public extensionFacade: PlatformMainFacade,
  ) {
    this.setting = $state(this._setting)
    $effect.root(() => {
      $effect(() => {
        console.trace("[in memory setting update]", { ...this.setting })
        // update storage on setting field update
        this.extensionFacade.setSettings(this.setting)
      })
    })
  }
  // use this method to build instance
  static async build(extensionFacade: PlatformMainFacade) {
    const setting = await extensionFacade.getSettings()
    return new InMemorySetting(setting, extensionFacade)
  }
}
