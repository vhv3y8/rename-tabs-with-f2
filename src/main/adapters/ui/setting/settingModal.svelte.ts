import { stringifyShortcut } from "@lib/utils/shortcut"
import { ChromeMainFacadeImpl } from "@infra/ChromeMainFacade"
import type { SettingStore } from "@main/application/ports/SettingStore"
import { app } from "@main/bootstrap.svelte"

export class SettingModalState {
  show = $state(false)
  // hot key update
  listen = $state(false)
  hotKeyText: string

  // settings: Record<any, any> = $state({})
  // settingStore: SettingStore
  destroySettingsEffect: any
  constructor(public store: SettingStore) {
    $effect.root(() => {
      $effect(() => {
        // cancel listen mode when setting is closed
        if (!this.show) this.listen = false
      })
    })
    this.hotKeyText = $derived.by(() => {
      if (this.store.setting.hotkey === undefined) return "N/A"
      return stringifyShortcut(this.store.setting.hotkey)
    })
  }

  async fetchAndSetSettings() {
    this.store.setting = await ChromeMainFacadeImpl.getSettings()
    this.destroySettingsEffect = $effect.root(() => {
      // update storage on settings $state change
      $effect(() => {
        ChromeMainFacadeImpl.setSettings(this.store.setting)
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
export const settingModal = new SettingModalState(app)
