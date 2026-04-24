import type {
  UploadURLTitleCollectionLifeCycle,
  UploadURLTitleConflictError,
} from "@application/usecases/file/uploadURLTitleCollection"
import type {
  URLTitleConfliction,
  URLTitleResolvedConfliction,
} from "@domain/entities/URLTitleCollection"
import { ok, type Result } from "@lib/types/Result"

export const uploadURLTitleLifeCycle: UploadURLTitleCollectionLifeCycle = {
  async handleConflicts(
    conflictions: URLTitleConfliction[],
  ): Promise<
    Result<URLTitleResolvedConfliction[], UploadURLTitleConflictError>
  > {
    // set conflict state values
    // open conflict modal
    // wait until its canceled or resolved
    // resolve result with ok or err
    return ok([])
  },
}
