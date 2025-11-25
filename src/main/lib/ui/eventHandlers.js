import { apply } from "../application/usecases/apply"

// Keydown handler factories
// get local state/ui update functions as parameter

export function createNormalKeydownHandler({
  elements,
  focusPreviousElement,
  focusNextElement,
  focusInitialElement,
  closeSettingsIfItsVisible,
}) {
  if (import.meta.env.MODE === "development")
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
        focusInitialElement()
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

    if (import.meta.env.MODE === "development")
      console.log("[elements.keydownElem]", elements.keydownElem)
    if (elements.keydownElem !== null)
      elements.keydownElem.classList.add("keydown")
  }
}

export function createListenShortcutKeydownHandler({ updateShortcutState }) {
  if (import.meta.env.MODE === "development")
    console.log("[createListenShortcutKeydownHandler]")
  return function handleListenShortut(e) {
    e.preventDefault()
    const shortcut = createShortcut(e)
    updateShortcutState(shortcut)
  }
}

export function createShortcut(e) {
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

// Keyup

export function removeAllKeydownClass() {
  document.querySelectorAll("button.keydown").forEach((elem) => {
    elem.classList.remove("keydown")
  })
}
