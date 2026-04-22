import type { PlatformMainFacade } from "@main/application/ports/infra/PlatformMainFacade"
import type { InitializeAppLifeCycle } from "@main/application/usecases/initialize/initializeApp"
import { tabItemComponents } from "../../components/tabs/states/tabItemComponents.svelte"

export function createInitializeAppLifeCycle(
  extensionFacade: PlatformMainFacade,
): InitializeAppLifeCycle {
  return {
    async afterStoresInitialized() {
      // tab info store
      // set initial idx
      const lastFocusTabId = await extensionFacade.getLastFocusTabId()
      console.log("[lastFocusTabId]", lastFocusTabId)
      tabItemComponents.setLastFocusTabIdForInitialFocus(lastFocusTabId)
      tabItemComponents.focusInitialItem()

      // url title collection store
    },
  }
}
