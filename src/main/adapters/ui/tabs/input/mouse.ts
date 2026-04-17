import { notConnectedCard } from "../states/notConnected.svelte"
import { fireReload } from "../states/reload.svelte"
import { tabItemComponents } from "../states/tabItemComponents.svelte"

// reload
export function clickReloadBtnHandler(e: MouseEvent) {
  fireReload()
}
// dismiss
export function clickDismissBtnHandler(e: MouseEvent) {
  notConnectedCard.hideCardIfVisible()
  tabItemComponents.focusNextItem()
}

// click tab item
export function createClickTabItemHandler(
  focusTabInput: () => void,
  focusableIdx: number,
) {
  return function clickTabItemHandler() {
    focusTabInput()
    tabItemComponents.updateCurrentFocusIdx(focusableIdx)
  }
}
