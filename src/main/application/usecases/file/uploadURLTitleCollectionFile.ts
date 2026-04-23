import { TOAST_MESSAGES } from "@adapters/ui/impl/toastPublisher.svelte"
import { type Result } from "@lib/types/Result"
import type { FileStorage } from "@main/application/ports/infra/FileStorage"
import type { ToastPublisher } from "@main/application/ports/infra/ToastPublisher"
import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"
import type {
  URLTitleCollection,
  URLTitleConfliction,
  URLTitleResolvedConfliction,
} from "@main/domain/entities/URLTitleCollection"

export interface UploadURLTitleFileLifeCycle {
  handleConflicts(
    conflictions: URLTitleConfliction[],
  ): Promise<
    Result<URLTitleResolvedConfliction[], UploadURLTitleFileConflictError>
  >
}
export type UploadURLTitleFileConflictError = {
  type: "USER_CANCEL"
}

export type UploadURLTitleCollectionFileUseCase = ReturnType<
  typeof createUploadURLTitleCollectionFile
>

export function createUploadURLTitleCollectionFile(
  urlTitleCollectionStore: URLTitleCollectionStore,
  urlTitleCollectionFileStorage: FileStorage<URLTitleCollection>,
  toastPublisher: ToastPublisher,
  lifeCycle: UploadURLTitleFileLifeCycle,
) {
  return async function uploadURLTitleCollectionFile() {
    let loadedCollection: URLTitleCollection
    let loadedEntries: ReturnType<typeof loadedCollection.entries>
    // get loaded collection
    try {
      loadedCollection = await urlTitleCollectionFileStorage.loadFile()
      loadedEntries = loadedCollection.entries()
    } catch (e) {
      if (e instanceof SyntaxError) {
        // json parse error only, for now
        toastPublisher.publishToast(TOAST_MESSAGES.UPLOAD_INAPPROPRIATE_FORMAT)
      } else if (e instanceof Error) {
        toastPublisher.publishToast(
          `Error while uploading file:\n${e.name}: ${e.message}`,
        )
      } else {
        // this should not happen
        toastPublisher.publishToast(
          `Error while uploading file:\nSomething strange is happening....`,
        )
        toastPublisher.publishToast(`Catched: ${e}`)
      }
      return
    }
    const existingCollection = urlTitleCollectionStore.getCollection()

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
      try {
        const conflictResult = await lifeCycle.handleConflicts(conflictions)

        console.log("[conflictResult]", conflictResult)
        conflictResult.match({
          ok: (resolvedItems) => {
            resolvedConflictions = resolvedItems
          },
          err: (error) => {
            if (error.type === "USER_CANCEL") {
              toastPublisher.publishToast(TOAST_MESSAGES.UPLOAD_FILE_CANCEL)
              return
            }
          },
        })
      } catch (e) {
        // this should not happen
        toastPublisher.publishToast(
          `Error while handling conflictions:\nSomething strange is happening....`,
        )
        toastPublisher.publishToast(`Catched: ${e}`)
        return
      }
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
    toastPublisher.publishToast(TOAST_MESSAGES.UPLOAD_FILE_SUCCESS)
  }
}
