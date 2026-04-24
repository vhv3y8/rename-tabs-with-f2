import type { PlatformMainFacade } from "@main/application/ports/infra/PlatformMainFacade"
import type { TabInfoStore } from "@main/application/ports/TabInfoStore"
import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"
import type { TabInfo } from "@main/domain/entities/TabInfo"

export type InitializeTabInfoStoreUseCase = ReturnType<
  typeof createInitializeTabInfoStore
>

export function createInitializeTabInfoStore(
  extensionFacade: PlatformMainFacade,
  urlTitleCollectionStore: URLTitleCollectionStore,
  tabInfoStore: TabInfoStore,
) {
  return async function initializeTabInfoStore() {
    const tabsToInitialize = await extensionFacade.getInitializeTabEntries()
    const urlTitleCollection = urlTitleCollectionStore.getCollection()

    const tabInfos: TabInfo[] = tabsToInitialize.map(
      ({ id, title, favIconUrl, url, index, status }) => ({
        index,
        id: id!,
        title: title!,
        favIconUrl: favIconUrl!,
        url: url!,
        status: status!,
        persistedTitle: url ? urlTitleCollection.getTitle(url) : null,
        connected: false,
      }),
    )
    // set state
    tabInfoStore.clearAndSetTabInfos(tabInfos)
  }
}
