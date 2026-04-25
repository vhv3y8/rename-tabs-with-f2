import type { IdCollectionStore } from "../ports/IdCollectionStore"
import type { PlatformSWFacade } from "../ports/PlatformSWFacade"

export type CheckAndFocusLastFocusTabUseCase = ReturnType<
  typeof createCheckAndFocusLastFocusTab
>

export function createCheckAndFocusLastFocusTab(
  idCollectionStore: IdCollectionStore,
  extensionFacade: PlatformSWFacade,
) {
  return async function checkAndFocusLastFocusTab(
    windowId: number,
    tabId: number,
  ) {
    if (
      idCollectionStore.isMainPageTab(tabId) &&
      idCollectionStore.windowHasLastFocusTab(windowId)
    ) {
      const lastFocusTabId = idCollectionStore.getLastFocusTabId()

      // focus last focus tab
      await extensionFacade.focusTab(lastFocusTabId)

      // remove from collections
      idCollectionStore.removeLastFocusTabId(lastFocusTabId)
      idCollectionStore.removeMainPageTabId(tabId)
    }
  }
}
