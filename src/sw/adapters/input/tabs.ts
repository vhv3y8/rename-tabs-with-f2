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
    console.log("[sw] [tabs on updated] [changeInfo]", changeInfo)
    if (changeInfo.status === "complete") {
      console.log("[sw] [tabs on updated] [apply by status complete]", tab)
      await checkAndApplyTitleUseCase({
        id: tabId,
        title: tab.title || "",
        url: tab.url || "",
      })
    } else if (changeInfo.title) {
      console.log("[sw] [tabs on updated] [apply by change info title]")
      await checkAndApplyTitleUseCase({
        id: tabId,
        title: changeInfo.title,
        url: tab.url || "",
      })
    }
  }
}
