import type { FileStorage } from "@main/application/ports/infra/FileStorage"
import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"
import type {
  URLTitleConfliction,
  URLTitleResolvedConfliction,
} from "@main/domain/entities/URLTitleCollection"

export interface UploadURLTitleCollectionFileLifeCycle {
  handleConflicts?(
    conflictions: URLTitleConfliction[],
  ): Promise<URLTitleResolvedConfliction[]>
}
export type UploadURLTitleCollectionFileUseCase = ReturnType<
  typeof createUploadURLTitleCollectionFile
>

export function createUploadURLTitleCollectionFile(
  urlTitleCollectionStore: URLTitleCollectionStore,
  fileStorage: FileStorage,
) {
  return function uploadURLTitleCollectionFile() {
    // get file from input file tag?
    // try appending
    // handle conflicts with life cycle
    // continue with resolved results?
    // important: save titles only after conflicts are resolved or doesn't exists.
  }
}
