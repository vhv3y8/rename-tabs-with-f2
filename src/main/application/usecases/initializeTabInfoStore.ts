import type { TabInfoStore } from "../ports/TabInfoStore"
import type { PlatformMainFacade } from "../ports/PlatformMainFacade"
import type { TabInfoState } from "@main/adapters/ui/components/tabs/states/tabInfoRecord.svelte"
import type { TabInfo } from "@main/domain/entities/TabInfo"

export type InitializeTabInfoStoreUseCase = ReturnType<
  typeof createInitializeTabInfoStore
>

export function createInitializeTabInfoStore(
  tabInfoStore: TabInfoStore,
  extensionFacade: PlatformMainFacade,
) {
  return async function initializeTabInfoStore() {
    const tabsToInitialize = await extensionFacade.getInitializeTabEntries()
    const tabInfos: TabInfo[] = tabsToInitialize.map(
      ({ id, title, favIconUrl, url, index, status }) => ({
        index,
        id: id!,
        title: title!,
        favIconUrl: favIconUrl!,
        url: url!,
        status: status!,
        connected: false,
      }),
    )
    // set state
    tabInfoStore.clearAndSetTabInfos(tabInfos)
  }
}
