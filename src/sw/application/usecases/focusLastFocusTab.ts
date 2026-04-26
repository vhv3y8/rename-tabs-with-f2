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
      (await idCollectionStore.isMainPageTab(tabId)) &&
      (await idCollectionStore.windowHasLastFocusTab(windowId))
    ) {
      const lastFocusTabId = await idCollectionStore.getLastFocusTabId(windowId)
      if (lastFocusTabId) {
        console.log("[focus last focus tab] [id exists] [focusing]")

        // focus last focus tab
        await extensionFacade.focusTab(lastFocusTabId)

        // remove from collections
        idCollectionStore.removeLastFocusTabId(lastFocusTabId)
        idCollectionStore.removeMainPageTabId(tabId)

        console.log(
          "[focus last focus tab] [focused last focus tab id]",
          lastFocusTabId,
          "[main page tab id]",
          tabId,
        )
      }
    }
  }
}
