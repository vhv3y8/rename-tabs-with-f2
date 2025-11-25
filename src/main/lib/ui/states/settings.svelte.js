import * as chromeStorage from "$$lib/chrome/storage"

// Settings
export let settings = $state(await chromeStorage.getSettings())

export const destroySettingsEffect = $effect.root(() => {
  // update storage on settings $state change
  $effect(() => {
    chromeStorage.setSettings(settings)
  })
})
