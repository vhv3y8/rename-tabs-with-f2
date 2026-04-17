import { reload } from "../states/reload.svelte"

export function createReloadingTabsUpdatedHandler(): Parameters<
  typeof chrome.tabs.onUpdated.addListener
>[0] {
  return function tabsOnUpdated(id, { status }, { index }) {
    // TODO: check if tab is on list
    if (reload.isWaiting())
      reload.tabIdxStatusRecord[index].status = status || ""
    // allReloadingTabStatus[index]["status"] = status

    if (import.meta.env.MODE === "development")
      console.log("[reload] [tabs.onUpdated]", { id, status })
  }
}
