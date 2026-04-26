import type { URLTitleCollectionSWStore } from "@sw/application/ports/URLTitleCollectionSWStore"

export type UpdateInMemoryUrlTitleCollectionUseCase = ReturnType<
  typeof createUpdateInMemoryUrlTitleCollection
>

export function createUpdateInMemoryUrlTitleCollection(
  urlTitleCollectionSWStore: URLTitleCollectionSWStore,
) {
  return async function updateInMemoryUrlTitleCollection() {
    await urlTitleCollectionSWStore.fetchCollection()
  }
}
