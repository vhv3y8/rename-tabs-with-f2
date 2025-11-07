import * as chromeRuntime from "../../../lib/chrome/runtime"
import { apply } from "../usecases/apply"

// Keydown Handlers
// get local state/ui update functions as parameter

export function createNormalKeydownHandler({
  elements,
  focusPreviousElement,
  focusNextElement,
  setFocusIdxToInitial,
  closeSettingsIfItsVisible,
}) {
  console.log("[createNormalKeydownHandler]")
  // keydown
  return function handleKeydown(e) {
    console.log("[handleKeydown]")
    /* Set keydownElem based on e.key */
    elements.keydownElem = null
    switch (e.key) {
      case "Tab": {
        e.preventDefault()
        if (e.shiftKey) {
          elements.keydownElem = elements.shiftTabKeyBtn
          focusPreviousElement()
        } else {
          elements.keydownElem = elements.tabKeyBtn
          focusNextElement()
        }
        break
      }
      case "Enter": {
        e.preventDefault()
        if (e.ctrlKey) {
          apply()
        } else if (e.shiftKey) {
          elements.keydownElem = elements.shiftEnterKeyBtn
          focusPreviousElement()
        } else {
          elements.keydownElem = elements.enterKeyBtn
          focusNextElement()
        }
        break
      }
      case "Escape": {
        e.preventDefault()
        if (closeSettingsIfItsVisible()) break

        elements.keydownElem = elements.escKeyBtn
        elements.initialFocusTabItem.click()
        setFocusIdxToInitial()
        break
      }
      default: {
        if (e.ctrlKey) {
          elements.keydownElem = elements.ctrlEnterBtn
        } else {
          elements.keydownElem = null
        }
      }
    }

    console.log("[elements.keydownElem]", elements.keydownElem)
    elements.keydownElem && elements.keydownElem.classList.add("keydown")
  }
}

export function createListenShortcutKeydownHandler({ updateShortcutState }) {
  console.log("[createListenShortcutKeydownHandler]")
  return function handleListenShortut(e) {
    e.preventDefault()
    const shortcut = createShortcut(e)
    updateShortcutState(shortcut)
  }
}

function createShortcut(e) {
  let key = e.key
  // if (key === "Control" || key === "Shift") key = ""
  return {
    key,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey,
  }
}

// keyup
export function removeAllKeydownClass() {
  document.querySelectorAll("button.keydown").forEach((elem) => {
    elem.classList.remove("keydown")
  })
}

// pagehide
export async function pageCloseWithoutChangesOnHide(e) {
  // when tab gets reloaded, basically its terminated and recreated.
  // so instead of checking if pagehide is refresh or close here, lets just tabs.query() and focus extension page every time it is created.
  // check onMount lifecycle using tabs focusExtensionPageTabForRefresh function
  await chromeRuntime.fireFocusLastActiveTab()
}
