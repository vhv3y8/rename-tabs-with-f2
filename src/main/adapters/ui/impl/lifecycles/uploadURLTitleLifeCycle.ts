import { conflictModal } from "@adapters/ui/components/setting/states/conflictModal.svelte"
import { waitUntil } from "@adapters/ui/components/util.svelte"
import type {
  UploadURLTitleCollectionLifeCycle,
  UploadURLTitleConflictError,
} from "@application/usecases/file/uploadURLTitleCollection"
import type {
  URLTitleConfliction,
  URLTitleResolvedConfliction,
} from "@domain/entities/URLTitleCollection"
import { err, ok, type Result } from "@lib/types/Result"

export const uploadURLTitleLifeCycle: UploadURLTitleCollectionLifeCycle = {
  async handleConflicts(
    conflictions: URLTitleConfliction[],
  ): Promise<
    Result<URLTitleResolvedConfliction[], UploadURLTitleConflictError>
  > {
    // set conflict state values
    conflictModal.setConflictionStates(conflictions)
    // open conflict modal
    conflictModal.open()
    // wait until its canceled or resolved
    await waitUntil(() => conflictModal.finished, true)
    // resolve result with ok or err
    return conflictModal.finishResult.match({
      ok: (resolvedConflictions) => ok(resolvedConflictions),
      err: (error) => err(error),
    })
  },
}
