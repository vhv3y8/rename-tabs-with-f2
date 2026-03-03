import { cancelAllKeydowns, keydowns } from "./states/keys.svelte"
import {
  closeSettingsIfItsVisible,
  settingsState,
} from "./states/settings.svelte"

import { fireReload } from "./states/tabs/reload.svelte"
import { focusTabItem } from "./states/tabs/tabElems.svelte"
import {
  getShowUnavailableCard,
  hideUnavailableCardIfItsVisible,
  // setShowUnavailableCard,
  // toggleShowUnavailableCard,
} from "./states/tabs/unavailableCard.svelte"
import { createShortcut, isValidShortcut } from "./shortcut"
import { apply } from "../application/usecases/apply"

// global keydown
export async function keydownHandler(e) {
  if (settingsState.listeningShortcut) return

  let handledByCode = true
  switch (e.code) {
    case "KeyW": {
      if (e.shiftKey) {
        console.log("[KeyW, shiftKey]")
        // dismissUnavailableCard(e)
        // if (getShowUnavailableCard()) {
        //   setShowUnavailableCard(false)
        // }
        hideUnavailableCardIfItsVisible()
      }
      break
    }
    case "KeyR": {
      if (e.shiftKey) {
        e.preventDefault()
        console.log("[KeyR, shiftKey]")
        // await handleReload(e)
        await fireReload()
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
          // elements.keydownElem = elements.shiftTabKeyBtn
          keydowns.shiftTab = true
          // focusPreviousElement()
          focusTabItem({ next: false })
        } else {
          // elements.keydownElem = elements.tabKeyBtn
          keydowns.tab = true
          // focusNextElement()
          focusTabItem({ next: true })
        }
        break
      }
      case "Enter": {
        e.preventDefault()
        if (e.ctrlKey) {
          apply()
        } else if (e.shiftKey) {
          // elements.keydownElem = elements.shiftEnterKeyBtn
          keydowns.shiftEnter = true
          // focusPreviousElement()
          focusTabItem({ next: false })
        } else {
          // elements.keydownElem = elements.enterKeyBtn
          keydowns.enter = true
          // focusNextElement()
          focusTabItem({ next: true })
        }
        break
      }
      case "Escape": {
        e.preventDefault()
        if (closeSettingsIfItsVisible()) break

        // elements.keydownElem = elements.escKeyBtn
        keydowns.esc = true
        // focusInitialElement()
        focusTabItem({ initial: true })
        break
      }
      default: {
        if (e.ctrlKey) {
          // elements.keydownElem = elements.ctrlEnterBtn
          keydowns.ctrlEnter = true
        } else {
          // elements.keydownElem = null
          cancelAllKeydowns()
        }
      }
    }
  }
}

// shortcut listen keydown
export function createListenShortcutKeydownHandler({ updateShortcutState }) {
  if (import.meta.env.MODE === "development")
    console.log("[createListenShortcutKeydownHandler]")

  return function handleListenShortcut(e) {
    e.preventDefault()
    // do nothing if shortcut is not valid
    if (!isValidShortcut(e)) return

    const shortcut = createShortcut(e)
    updateShortcutState(shortcut)
  }
}

// global keyup
export function keyupHandler() {
  cancelAllKeydowns()
}
