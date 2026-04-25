import type { IdCollectionStore } from "../ports/IdCollectionStore"
import type { PlatformSWFacade } from "../ports/infra/PlatformSWFacade"

export type FocusLastFocusTabUseCase = ReturnType<
  typeof createFocusLastFocusTab
>

export function createFocusLastFocusTab(
  idCollectionStore: IdCollectionStore,
  extensionFacade: PlatformSWFacade,
) {
  return async function focusLastFocusTab(windowId: number, tabId: number) {
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
