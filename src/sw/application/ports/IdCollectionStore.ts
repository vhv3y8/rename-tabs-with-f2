export interface IdCollectionStore {
  initialize(): void

  // extension main page tab
  setMainPageTabId(tabId: number): void
  isMainPageTab(tabId: number): boolean
  removeMainPageTabId(tabId: number): void

  // last focus tab
  setLastFocusTabId(windowId: number, lastFocusTabId: number): void
  getLastFocusTabId(): number
  windowHasLastFocusTab(windowId: number): boolean
  removeLastFocusTabId(id: number): void
}
