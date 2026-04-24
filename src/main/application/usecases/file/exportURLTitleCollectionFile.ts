import type { FileExporter } from "@application/ports/infra/FileExporter"
import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"
import type { URLTitleCollection } from "@main/domain/entities/URLTitleCollection"

export type ExportURLTitleCollectionFileUseCase = ReturnType<
  typeof createExportURLTitleCollectionFile
>

export function createExportURLTitleCollectionFile(
  urlTitleCollectionStore: URLTitleCollectionStore,
  // urlTitleCollectionFileStorage: FileStorage<URLTitleCollection>,
  urlTitleCollectionFileExporter: FileExporter<URLTitleCollection>,
) {
  return async function exportURLTitleCollectionFile() {
    // get collection
    const collection = urlTitleCollectionStore.getCollection()
    // download file
    await urlTitleCollectionFileExporter.export(collection)
  }
}
