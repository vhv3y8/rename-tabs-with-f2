export function createTabsOnRemovedHandler(): Parameters<
  typeof chrome.tabs.onRemoved.addListener
>[0] {
  return async function tabsOnRemovedHandler(tabId, { windowId }) {
    if (extensionTabIdSet.has(tabId) && winIdLastFocusTabIdMap.has(windowId)) {
      // focus last focus tab of the window
      const lastFocusTabId = winIdLastFocusTabIdMap.get(windowId)
      await ChromeTabs.operate.focusTab(lastFocusTabId)

      // remove tab id and window id from collections
      extensionTabIdSet.delete(tabId)
      winIdLastFocusTabIdMap.delete(windowId)
    }
  }
}
