import type { CheckAndApplyTitleUseCase } from "../../application/usecases/checkAndApplyTitle"
import type { FocusLastFocusTabUseCase } from "../../application/usecases/focusLastFocusTab"

export function createTabsOnRemovedHandler(
  focusLastFocusTabUseCase: FocusLastFocusTabUseCase,
): Parameters<typeof chrome.tabs.onRemoved.addListener>[0] {
  return async function tabsOnRemovedHandler(tabId, { windowId }) {
    focusLastFocusTabUseCase(windowId, tabId)
  }
}

export function createTabsOnUpdatedHandler(
  checkAndApplyTitleUseCase: CheckAndApplyTitleUseCase,
): Parameters<typeof chrome.tabs.onUpdated.addListener>[0] {
  return async function tabsOnUpdatedHandler(tabId, changeInfo, tab) {
    console.log("[tabs on updated] [changeInfo]", changeInfo)

    if (changeInfo.status === "complete") {
      await checkAndApplyTitleUseCase({
        id: tabId,
        originalTitle: changeInfo.title,
        url: changeInfo.url,
      })
    }
  }
}
