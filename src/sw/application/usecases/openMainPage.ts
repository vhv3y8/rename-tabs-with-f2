import type { IdCollectionStore } from "../ports/IdCollectionStore"
import type { PlatformSWFacade } from "../ports/infra/PlatformSWFacade"

export type OpenMainPageUseCase = ReturnType<typeof createOpenMainPage>

export function createOpenMainPage(
  idCollectionStore: IdCollectionStore,
  extensionFacade: PlatformSWFacade,
) {
  return async function openMainPage() {
    // get window and tab ids
    const currentWindowId = await extensionFacade.getCurrentWindowId()
    const currentWindowActiveTab =
      await extensionFacade.getCurrentWindowActiveTab()
    const lastFocusTabId = currentWindowActiveTab.id

    console.log("[open main page] [current window and tab id]", [
      currentWindowId,
      lastFocusTabId,
    ])

    // set id to store
    if (currentWindowId !== null && lastFocusTabId !== undefined)
      idCollectionStore.setLastFocusTabId(currentWindowId, lastFocusTabId)

    console.log("[opening main page]")

    // open main page and set id
    const mainPageTab = await extensionFacade.openMainPage()
    if (mainPageTab.id) {
      extensionFacade.focusTab(mainPageTab.id)
      idCollectionStore.setMainPageTabId(mainPageTab.id)
      console.log("[open main page] [saved main page tab id]", mainPageTab.id)
    }
  }
}
