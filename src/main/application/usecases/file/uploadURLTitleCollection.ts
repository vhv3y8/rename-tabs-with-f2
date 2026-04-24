import { TOAST_MESSAGES } from "@adapters/ui/impl/toastPublisher.svelte"
import { type Result } from "@lib/types/Result"
import type { ToastPublisher } from "@main/application/ports/infra/ToastPublisher"
import { type URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"
import type {
  URLTitleCollection,
  URLTitleConfliction,
  URLTitleResolvedConfliction,
} from "@main/domain/entities/URLTitleCollection"

export interface UploadURLTitleCollectionLifeCycle {
  handleConflicts(
    conflictions: URLTitleConfliction[],
  ): Promise<Result<URLTitleResolvedConfliction[], UploadURLTitleConflictError>>
}
export type UploadURLTitleConflictError = {
  type: "USER_CANCEL"
}

export type UploadURLTitleCollectionUseCase = ReturnType<
  typeof createUploadURLTitleCollection
>

export function createUploadURLTitleCollection(
  urlTitleCollectionStore: URLTitleCollectionStore,
  toastPublisher: ToastPublisher,
  lifeCycle: UploadURLTitleCollectionLifeCycle,
) {
  return async function uploadURLTitleCollection(
    loadedCollection: URLTitleCollection,
  ) {
    const loadedEntries = loadedCollection.entries()
    // get existing collection
    let existingCollection: URLTitleCollection
    try {
      existingCollection = urlTitleCollectionStore.getCollection()
    } catch (e) {
      // probably store not initialized error but it should also not happen
      if (e instanceof Error) {
        toastPublisher.publishToast(
          `Error while getting titles database:\n${e.name}: ${e.message}`,
        )
      }
      return
    }

    console.log("[upload url title file] [loaded entries]", loadedEntries)
    console.log(
      "[upload url title file] [existing collection]",
      existingCollection,
    )

    // check conflictions
    const conflictions: URLTitleConfliction[] =
      existingCollection.checkEntryConflictions(loadedEntries)

    // wait for user to resolve conflictions
    let resolvedConflictions: URLTitleResolvedConfliction[] = []
    if (0 < conflictions.length) {
      // ui runs here
      const conflictResult = await lifeCycle.handleConflicts(conflictions)
      console.log("[conflictResult]", conflictResult)
      conflictResult.match({
        ok: (resolvedItems) => {
          resolvedConflictions = resolvedItems
        },
        err: (error) => {
          if (error.type === "USER_CANCEL") {
            toastPublisher.publishToast(TOAST_MESSAGES.UPLOAD_FILE_CANCEL)
            // where does this return?
            return
          }
        },
      })
    }

    console.log(
      "[upload url title file] [resolved conflictions]",
      resolvedConflictions,
    )

    // important: save titles only after conflicts are resolved or doesn't exists.
    // append entries
    existingCollection.appendEntriesWithResolvedConflictions(
      loadedEntries,
      resolvedConflictions,
    )
    // update storage
    await urlTitleCollectionStore.storeUpdatedCollection()

    toastPublisher.publishToast(TOAST_MESSAGES.UPLOAD_FILE_SUCCESS)
  }
}
