import type { UploadURLTitleCollectionFileUseCase } from "@application/usecases/file/uploadURLTitleCollectionFile"

export function createClickUploadFileHandler(
  uploadUrlTitleFileUseCase: UploadURLTitleCollectionFileUseCase,
) {
  return async function clickUploadFileHandler(e: MouseEvent) {
    // load file
    // TODO TODO TODO TODO
    uploadUrlTitleFileUseCase()
  }
}
