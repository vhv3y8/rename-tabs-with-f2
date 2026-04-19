import type { PlatformMainFacade } from "@main/application/ports/PlatformMainFacade"
import type { InitializeAppLifeCycle } from "@main/application/usecases/initializeApp"
import { initializeInMemorySetting } from "../../components/setting/states/inMemorySetting.svelte"
import { tabItemComponents } from "../../components/tabs/states/tabItemComponents.svelte"

export function createInitializeAppLifeCycle(
  extensionFacade: PlatformMainFacade,
): InitializeAppLifeCycle {
  return {
    async afterStoreInitialized() {
      // get setting
      await initializeInMemorySetting(extensionFacade)
      // set initial idx
      const lastFocusTabId = await extensionFacade.getLastFocusTabId()
      tabItemComponents.setLastFocusTab(lastFocusTabId)
    },
  }
}
