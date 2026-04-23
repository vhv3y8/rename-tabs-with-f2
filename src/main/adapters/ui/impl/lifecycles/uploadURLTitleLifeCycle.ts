import type {
  UploadURLTitleFileLifeCycle,
  UploadURLTitleFileConflictError,
} from "@application/usecases/file/uploadURLTitleCollectionFile"
import type {
  URLTitleConfliction,
  URLTitleResolvedConfliction,
} from "@domain/entities/URLTitleCollection"
import type { Result } from "@lib/types/Result"

export const uploadURLTitleLifeCycle: UploadURLTitleFileLifeCycle = {
  async handleConflicts(
    conflictions: URLTitleConfliction[],
  ): Promise<
    Result<URLTitleResolvedConfliction[], UploadURLTitleFileConflictError>
  > {
    // set conflict state values
    // open conflict modal
    // wait until its canceled or resolved
    // resolve result with ok or err
  },
}
