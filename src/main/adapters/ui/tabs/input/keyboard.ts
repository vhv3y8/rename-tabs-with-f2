import { notConnected } from "@main/bootstrap.svelte"
import { notConnectedCard } from "../states/notConnected.svelte"
import { fireReload } from "../states/reload.svelte"
import { settingModal } from "../../setting/settingModal.svelte"
import {
  cancelAllMoveAroundKeydowns,
  cancelAllNotConnectedCardKeydowns,
  keydowns,
} from "../../reactivity/keys.svelte"
import { tabItemComponents } from "../states/tabItemComponents.svelte"

// move around tab components
export function keydownMoveAroundTabItemsHandler(e: KeyboardEvent) {
  if (settingModal.listen) return

  switch (e.key) {
    case "Tab": {
      e.preventDefault()
      if (e.shiftKey) {
        keydowns.shiftTab = true
        tabItemComponents.focusPreviousItem()
      } else {
        keydowns.tab = true
        tabItemComponents.focusNextItem()
      }
      break
    }
    case "Enter": {
      e.preventDefault()
      if (e.shiftKey) {
        keydowns.shiftEnter = true
        tabItemComponents.focusPreviousItem()
      } else {
        keydowns.enter = true
        tabItemComponents.focusNextItem()
      }
      break
    }
    case "Escape": {
      e.preventDefault()
      // if (settingModal.hideIfVisible()) break
      keydowns.esc = true
      tabItemComponents.focusInitialItem()
      break
    }
    default: {
      cancelAllMoveAroundKeydowns()
    }
  }
}

// not connected card
export async function keydownNotConnectedCardHandler(e: KeyboardEvent) {
  if (settingModal.listen) return

  switch (e.code) {
    // shift + w close card
    case "KeyW": {
      if (e.shiftKey && notConnectedCard.show) {
        e.preventDefault()
        notConnectedCard.hideCardIfVisible()

        if (import.meta.env.MODE === "development")
          console.log("[KeyW, shiftKey]")
      }
      break
    }
    // shift + r fire reload
    case "KeyR": {
      if (
        e.shiftKey &&
        notConnectedCard.show &&
        0 < notConnected.reloadConnectableTabs.length
      ) {
        e.preventDefault()
        await fireReload()

        if (import.meta.env.MODE === "development")
          console.log("[KeyR, shiftKey]")
      }
      break
    }
    default: {
      cancelAllNotConnectedCardKeydowns()
    }
  }
}
