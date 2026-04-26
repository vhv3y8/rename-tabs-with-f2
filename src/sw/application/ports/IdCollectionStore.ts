export interface IdCollectionStore {
  // extension main page tab
  isMainPageTab(tabId: number): Promise<boolean>
  setMainPageTabId(tabId: number): Promise<void>
  removeMainPageTabId(tabId: number): Promise<void>

  // last focus tab
  windowHasLastFocusTab(windowId: number): Promise<boolean>
  getLastFocusTabId(windowId: number): Promise<number | null>
  setLastFocusTabId(windowId: number, lastFocusTabId: number): Promise<void>
  removeLastFocusTabId(id: number): Promise<void>
}
