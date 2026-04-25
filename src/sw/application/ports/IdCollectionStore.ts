export interface IdCollectionStore {
  updateMainTabIdCollection(): Promise<void>
  updateLastFocusTabIdCollection(): Promise<void>

  // extension main page tab
  isMainPageTab(tabId: number): boolean
  setMainPageTabId(tabId: number): Promise<void>
  removeMainPageTabId(tabId: number): Promise<void>

  // last focus tab
  windowHasLastFocusTab(windowId: number): boolean
  getLastFocusTabId(windowId: number): number
  setLastFocusTabId(windowId: number, lastFocusTabId: number): Promise<void>
  removeLastFocusTabId(id: number): Promise<void>
}
