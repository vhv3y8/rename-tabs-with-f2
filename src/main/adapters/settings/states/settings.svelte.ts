import { stringifyShortcut } from "@adapters/shortcut"
import { ChromeMainFacadeImpl } from "@infra/ChromeMainFacade"

class SettingState {
  show = $state(false)
  listen = $state(false)
  shortcutText: string
  settings: Record<any, any> = $state({})
  destroySettingsEffect: any
  constructor() {
    $effect.root(() => {
      $effect(() => {
        // cancel listen mode when setting is closed
        if (!this.show) this.listen = false
      })
    })
    this.shortcutText = $derived.by(() => {
      if (this.settings.shortcut === undefined) return "N/A"
      return stringifyShortcut(this.settings.shortcut)
    })
  }

  async fetchAndSetSettings() {
    this.settings = await ChromeMainFacadeImpl.getSettings()
    this.destroySettingsEffect = $effect.root(() => {
      // update storage on settings $state change
      $effect(() => {
        ChromeMainFacadeImpl.setSettings(this.settings)
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
  tryHiding() {
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
export const settingState = new SettingState()
