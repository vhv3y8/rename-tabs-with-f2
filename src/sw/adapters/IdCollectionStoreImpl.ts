import type { IdCollectionStore } from "../application/ports/IdCollectionStore"

export class IdCollectionStoreImpl implements IdCollectionStore {
  initialize() {}

  // extension main page tab
  setMainPageTabId(tabId: number) {}
  isMainPageTab(tabId: number) {}
  removeMainPageTabId(tabId: number) {}

  // last focus tab
  setLastFocusTabId(windowId: number, lastFocusTabId: number) {}
  getLastFocusTabId(): number {}
  windowHasLastFocusTab(windowId: number): boolean {}
  removeLastFocusTabId(id: number) {}
}
