import type { CheckAndFocusLastFocusTabUseCase } from "../../application/usecases/focusLastFocusTab"

export function createTabsOnRemovedHandler(
  checkAndFocusLastFocusTabUseCase: CheckAndFocusLastFocusTabUseCase,
): Parameters<typeof chrome.tabs.onRemoved.addListener>[0] {
  return async function tabsOnRemovedHandler(tabId, { windowId }) {
    checkAndFocusLastFocusTabUseCase(windowId, tabId)
  }
}

export function createTabsOnUpdatedHandler(): Parameters<
  typeof chrome.tabs.onUpdated.addListener
>[0] {
  return function tabsOnUpdatedHandler(tabId, changeInfo, tab) {
    //
  }
}
