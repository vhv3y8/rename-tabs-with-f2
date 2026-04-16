import { reloadState } from "../states/reload.svelte"

// tabs update listener
chrome.tabs.onUpdated.addListener((id, { status }, { index }) => {
  if (reloadState.isWaiting())
    reloadState.tabIdxStatusRecord[index].status = status || ""
  // allReloadingTabStatus[index]["status"] = status

  if (import.meta.env.MODE === "development")
    console.log("[reload] [tabs.onUpdated]", { id, status })
})
