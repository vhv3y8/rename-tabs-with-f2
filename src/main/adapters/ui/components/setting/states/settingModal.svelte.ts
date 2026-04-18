import { stringifyShortcut } from "@lib/shortcut"
import { setting, type InMemorySetting } from "./inMemorySetting.svelte"
import { ChromeFacade } from "@main/infra/platform/impl/ChromeMainFacade"
import type { Setting } from "@lib/chrome/models/Setting"

export class SettingModalState {
  show = $state(false)
  // hot key update
  listen = $state(false)
  hotKeyText: string
  // setting update effect
  destroySettingsEffect: any
  constructor(public setting: Setting) {
    $effect.root(() => {
      $effect(() => {
        // cancel listen mode when setting is closed
        if (!this.show) this.listen = false
      })
    })
    this.hotKeyText = $derived.by(() => {
      if (this.setting.hotKey === undefined) return "N/A"
      return stringifyShortcut(this.setting.hotKey)
    })
  }

  async fetchAndSetSettings() {
    this.setting = await ChromeFacade.getSettings()
    this.destroySettingsEffect = $effect.root(() => {
      // update storage on settings $state change
      $effect(() => {
        ChromeFacade.setSettings(this.setting)
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
export const settingModal = new SettingModalState(setting)
