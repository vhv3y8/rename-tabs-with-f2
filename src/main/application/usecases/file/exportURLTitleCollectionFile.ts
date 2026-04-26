import type { FileExporter } from "@application/ports/infra/FileExporter"
import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"
import type { URLTitleCollection } from "@main/domain/entities/URLTitleCollection"

export type ExportURLTitleCollectionFileUseCase = ReturnType<
  typeof createExportURLTitleCollectionFile
>

export function createExportURLTitleCollectionFile(
  urlTitleCollectionStore: URLTitleCollectionStore,
  urlTitleCollectionFileExporter: FileExporter<URLTitleCollection>,
) {
  return async function exportURLTitleCollectionFile() {
    // get collection
    const collection = await urlTitleCollectionStore.getCollection()
    // download file
    await urlTitleCollectionFileExporter.export(collection)
  }
}
