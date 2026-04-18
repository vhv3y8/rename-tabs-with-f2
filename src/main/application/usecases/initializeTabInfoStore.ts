import type { TabInfoState } from "@main/adapters/ui/tabs/states/tabInfoRecord.svelte"
import type { TabInfoStore } from "../ports/TabInfoStore"
import type { PlatformMainFacade } from "../ports/PlatformMainFacade"

export type InitializeTabInfoStoreUseCase = ReturnType<
  typeof createInitializeTabInfoStore
>

export function createInitializeTabInfoStore(
  tabInfoStore: TabInfoStore,
  extensionFacade: PlatformMainFacade,
) {
  return async function initializeTabInfoStore() {
    const tabsToInitialize = await extensionFacade.getInitializeTabEntries()
    // reduce to appropriate format
    const tabIdxInfoRecord = tabsToInitialize.reduce(
      (
        acc: Record<number, TabInfoState>,
        { id, title, favIconUrl, url, index, status },
      ) => {
        // key have to be index. index is tab's position on current window tabs array
        acc[index] = {
          id,
          title,
          favIconUrl,
          url,
          status,
          index,
          connected: true,
          hasChanged: false,
        }
        return acc
      },
      {},
    )
    // set state
    tabInfoStore.clearAndSetTabInfos(tabIdxInfoRecord)
  }
}
