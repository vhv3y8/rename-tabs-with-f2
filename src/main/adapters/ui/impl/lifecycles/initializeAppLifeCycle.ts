import type { PlatformMainFacade } from "@main/application/ports/PlatformMainFacade"
import type { InitializeAppLifeCycle } from "@main/application/usecases/initializeApp"
import { tabItemComponents } from "../../components/tabs/states/tabItemComponents.svelte"

export function createInitializeAppLifeCycle(
  extensionFacade: PlatformMainFacade,
): InitializeAppLifeCycle {
  return {
    async afterStoreInitialized() {
      // set initial idx
      const lastFocusTabId = await extensionFacade.getLastFocusTabId()
      console.log("[lastFocusTabId]", lastFocusTabId)
      tabItemComponents.setInitialFocusComponent(lastFocusTabId)
      tabItemComponents.focusInitialItem()
    },
  }
}
