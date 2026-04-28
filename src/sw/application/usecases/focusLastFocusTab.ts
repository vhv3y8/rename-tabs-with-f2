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
        if (import.meta.env.MODE === "development")
          console.log("[sw] [focus last focus tab] [id exists] [focusing]")

        // tab could have been closed
        if (await extensionFacade.tabExists(lastFocusTabId)) {
          // focus last focus tab
          await extensionFacade.focusTab(lastFocusTabId)
        }

        // remove from collections
        idCollectionStore.removeLastFocusTabId(lastFocusTabId)
        idCollectionStore.removeMainPageTabId(tabId)

        if (import.meta.env.MODE === "development")
          console.log(
            "[sw] [focus last focus tab] [focused last focus tab id]",
            lastFocusTabId,
            "[main page tab id]",
            tabId,
          )
      }
    }
  }
}
