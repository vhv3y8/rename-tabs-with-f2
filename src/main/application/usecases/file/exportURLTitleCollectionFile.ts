import type { FileStorage } from "@main/application/ports/infra/FileStorage"
import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"

export type ExportURLTitleCollectionFileUseCase = ReturnType<
  typeof createExportURLTitleCollectionFile
>

export function createExportURLTitleCollectionFile(
  urlTitleCollectionStore: URLTitleCollectionStore,
  fileStorage: FileStorage,
) {
  return function exportURLTitleCollectionFile() {
    // get collection
    // download file
  }
}
