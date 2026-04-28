import type { ToastPublisher } from "@application/ports/infra/ToastPublisher"
import type { URLTitleCollectionStore } from "@application/ports/URLTitleCollectionStore"
import { TOAST_MESSAGES } from "@lib/toast"

export type ClearURLTitleCollectionUseCase = ReturnType<
  typeof createClearURLTitleCollection
>

export function createClearURLTitleCollection(
  urlTitleCollectionStore: URLTitleCollectionStore,
  toastPublisher: ToastPublisher,
) {
  return async function clearURLTitleCollection() {
    const collection = await urlTitleCollectionStore.getCollection()
    const allUrlMatches = collection.entries().map((entry) => entry[0])
    collection.removeEntries(allUrlMatches)
    await urlTitleCollectionStore.storeUpdatedCollection()

    toastPublisher.publishToast(
      TOAST_MESSAGES.CLEARED_TITLES(allUrlMatches.length),
    )
  }
}
