import { ChromeFacade } from "@main/infra/platform/impl/ChromeMainFacade"
import type { Setting } from "@lib/models/Setting"
import { chromeInitialSetting } from "@lib/chrome/storage"

export class SettingModalState {
  show = $state(false)
  // hot key update
  listen = $state(false)
  // setting update effect
  destroySettingsEffect: any
  // setting: Setting
  constructor() {
    // this.setting = chromeInitialSetting
    $effect.root(() => {
      $effect(() => {
        // cancel listen mode when setting is closed
        console.log("[setting modal show change]", this.show)
        if (!this.show) this.listen = false
      })
    })
  }

  // show
  toggleShow() {
    this.show = !this.show
  }
  hide() {
    this.show = false
  }
  hideIfVisible() {
    if (this.show) {
      this.show = false
      return true
    }
    return false
  }
  // listen
  startListening() {
    this.listen = true
  }
  endListening() {
    this.listen = false
  }
}
export const settingModal = new SettingModalState()
