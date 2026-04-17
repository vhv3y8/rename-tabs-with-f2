import { createShortcut, isValidShortcut } from "../../../../../lib/shortcut"
import { settingModal } from "../settingModal.svelte"

// shortcut listen keydown
export function createListenShortcutKeydownHandler({
  updateShortcutState,
}: {
  updateShortcutState: (shortcut: any) => void
}) {
  if (import.meta.env.MODE === "development")
    console.log("[createListenShortcutKeydownHandler]")

  return function handleListenShortcut(e: KeyboardEvent) {
    e.preventDefault()
    // do nothing if shortcut is not valid
    if (!isValidShortcut(e)) return

    const shortcut = createShortcut(e)
    updateShortcutState(shortcut)
  }
}

export function keydownSettingHandler(e: KeyboardEvent) {
  switch (e.key) {
    // esc to close
    case "Escape": {
      e.preventDefault()
      settingModal.hideIfVisible()
    }
  }
}
