import * as chromeStorage from "$$lib/chrome/storage"
import { stringifyShortcut } from "../shortcut"

// Settings
export let settings = $state(await chromeStorage.getSettings())

export const destroySettingsEffect = $effect.root(() => {
  // update storage on settings $state change
  $effect(() => {
    chromeStorage.setSettings(settings)
  })
})

// ui
export let settingsState = $state({
  showSettings: false,
  listeningShortcut: false,
})

// let showSettings = $state(false)

$effect.root(() => {
  $effect(() => {
    // cancel listen mode when setting is closed
    if (!settingsState.showSettings) settingsState.listeningShortcut = false
  })
})

export function toggleShowSettings() {
  settingsState.showSettings = !settingsState.showSettings
}

export function hideSettingsPopover() {
  settingsState.showSettings = false
}

export function closeSettingsIfItsVisible() {
  if (settingsState.showSettings) {
    settingsState.showSettings = false
    return true
  }
  return false
}

// Listening shortcut
// export let isListeningShortcut = $state(false)

export function startShortcutListen() {
  settingsState.listeningShortcut = true
}

export function endShortcutListen() {
  settingsState.listeningShortcut = false
}

let globalShortcutText = $derived(stringifyShortcut(settings.shortcut))

export function getGlobalShortcutText() {
  return globalShortcutText
}
