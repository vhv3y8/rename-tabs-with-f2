import type { CheckAndApplyTitleUseCase } from "../../application/usecases/checkAndApplyTitle"
import type { FocusLastFocusTabUseCase } from "../../application/usecases/focusLastFocusTab"

export function createTabsOnRemovedHandler(
  bootstrapPromise: Promise<{
    focusLastFocusTabUseCase: FocusLastFocusTabUseCase
  }>,
): Parameters<typeof chrome.tabs.onRemoved.addListener>[0] {
  return async function tabsOnRemovedHandler(tabId, { windowId }) {
    const { focusLastFocusTabUseCase } = await bootstrapPromise
    focusLastFocusTabUseCase(windowId, tabId)
  }
}

export function createTabsOnUpdatedHandler(
  bootstrapPromise: Promise<{
    checkAndApplyTitleUseCase: CheckAndApplyTitleUseCase
  }>,
): Parameters<typeof chrome.tabs.onUpdated.addListener>[0] {
  return async function tabsOnUpdatedHandler(tabId, changeInfo, tab) {
    const { checkAndApplyTitleUseCase } = await bootstrapPromise
    console.log("[tabs on updated] [changeInfo]", changeInfo)
    if (changeInfo.status === "complete") {
      console.log("[tabs on updated] [status is complete]", tab)
      await checkAndApplyTitleUseCase({
        id: tabId,
        originalTitle: tab.title || "",
        url: tab.url || "",
      })
    }
  }
}
