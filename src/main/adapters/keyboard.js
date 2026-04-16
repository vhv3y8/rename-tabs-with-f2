import { cancelAllKeydowns, keydowns } from "./keys.svelte"
import {
  closeSettingsIfItsVisible,
  settingsState,
} from "./settings/states/settings.svelte"

import { fireReload } from "./tabs/states/reload.svelte"
import { focusTabItem } from "./tabs/states/tabItems.svelte"
import {
  getRefreshAndBrowserUnavailableTabs,
  getShowUnavailableCard,
  hideUnavailableCardIfItsVisible,
} from "./tabs/states/unavailable.svelte"
import { createShortcut, isValidShortcut } from "./shortcut"
import { apply } from "../application/usecases/apply"

// global keydown
export async function keydownHandler(e) {
  if (settingsState.listeningShortcut) return

  let handledByCode = true
  switch (e.code) {
    case "KeyW": {
      if (e.shiftKey && getShowUnavailableCard()) {
        e.preventDefault()
        hideUnavailableCardIfItsVisible()

        if (import.meta.env.MODE === "development")
          console.log("[KeyW, shiftKey]")
      }
      break
    }
    case "KeyR": {
      if (
        e.shiftKey &&
        getShowUnavailableCard() &&
        0 < getRefreshAndBrowserUnavailableTabs().refreshUnavailableTabs.length
      ) {
        e.preventDefault()
        await fireReload()

        if (import.meta.env.MODE === "development")
          console.log("[KeyR, shiftKey]")
      }
      break
    }
    default: {
      handledByCode = false
    }
  }

  if (!handledByCode) {
    switch (e.key) {
      case "Tab": {
        e.preventDefault()
        if (e.shiftKey) {
          keydowns.shiftTab = true
          focusTabItem({ next: false })
        } else {
          keydowns.tab = true
          focusTabItem({ next: true })
        }
        break
      }
      case "Enter": {
        e.preventDefault()
        if (e.ctrlKey) {
          apply()
        } else if (e.shiftKey) {
          keydowns.shiftEnter = true
          focusTabItem({ next: false })
        } else {
          keydowns.enter = true
          focusTabItem({ next: true })
        }
        break
      }
      case "Escape": {
        e.preventDefault()
        if (closeSettingsIfItsVisible()) break

        keydowns.esc = true
        focusTabItem({ initial: true })
        break
      }
      default: {
        if (e.ctrlKey) {
          keydowns.ctrlEnter = true
        } else {
          cancelAllKeydowns()
        }
      }
    }
  }
}

// // shortcut listen keydown
// export function createListenShortcutKeydownHandler({ updateShortcutState }) {
//   if (import.meta.env.MODE === "development")
//     console.log("[createListenShortcutKeydownHandler]")

//   return function handleListenShortcut(e) {
//     e.preventDefault()
//     // do nothing if shortcut is not valid
//     if (!isValidShortcut(e)) return

//     const shortcut = createShortcut(e)
//     updateShortcutState(shortcut)
//   }
// }

// global keyup
export function keyupHandler() {
  cancelAllKeydowns()
}
