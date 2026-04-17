import { reloadState } from "../states/reload.svelte"

export function createTabsUpdatedReloadingHandler(): Parameters<
  typeof chrome.tabs.onUpdated.addListener
>[0] {
  return function tabsOnUpdated(id, { status }, { index }) {
    if (reloadState.isWaiting())
      reloadState.tabIdxStatusRecord[index].status = status || ""
    // allReloadingTabStatus[index]["status"] = status

    if (import.meta.env.MODE === "development")
      console.log("[reload] [tabs.onUpdated]", { id, status })
  }
}
