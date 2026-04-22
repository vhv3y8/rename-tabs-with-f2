import type { PlatformMainFacade } from "@main/application/ports/infra/PlatformMainFacade"
import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"

export type InitializeURLTitleCollectionStoreUseCase = ReturnType<
  typeof createInitializeURLTitleCollectionStore
>

export function createInitializeURLTitleCollectionStore(
  urlTitleCollectionStore: URLTitleCollectionStore,
  extensionFacade: PlatformMainFacade,
) {
  return async function initializeURLTitleCollectionStore() {
    // get from extension storage
    const titles = await extensionFacade.getTitleRecord()
    // set to store
    urlTitleCollectionStore.initializeCollection(titles)
  }
}
