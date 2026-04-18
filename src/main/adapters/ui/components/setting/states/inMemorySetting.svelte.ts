import { type Setting } from "@chrome/models/Setting"
import type { PlatformMainFacade } from "@main/application/ports/PlatformMainFacade"

export class InMemorySetting {
  private constructor(
    public setting: Setting,
    // maybe just set setting function
    public extensionFacade: PlatformMainFacade,
  ) {
    this.setting = $state(setting)
    $effect.root(() => {
      $effect(() => {
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

// use this to get/set setting
export const setting = $state({} as Setting)
// initialize with this before using setting
export async function initializeSetting(extensionFacade: PlatformMainFacade) {
  const app = await InMemorySetting.build(extensionFacade)
  Object.assign(setting, app.setting)
}
