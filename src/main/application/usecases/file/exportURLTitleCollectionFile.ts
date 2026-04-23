import type { FileStorage } from "@main/application/ports/infra/FileStorage"
import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"
import type { URLTitleCollection } from "@main/domain/entities/URLTitleCollection"

export type ExportURLTitleCollectionFileUseCase = ReturnType<
  typeof createExportURLTitleCollectionFile
>

export function createExportURLTitleCollectionFile(
  urlTitleCollectionStore: URLTitleCollectionStore,
  urlTitleCollectionFileStorage: FileStorage<URLTitleCollection>,
) {
  return async function exportURLTitleCollectionFile() {
    // get collection
    const collection = urlTitleCollectionStore.getCollection()
    // download file
    await urlTitleCollectionFileStorage.saveFile(collection)
  }
}
