import type { ToastPublisher } from "@application/ports/infra/ToastPublisher"
import type { UploadURLTitleCollectionUseCase } from "@application/usecases/file/uploadURLTitleCollection"
import { TOAST_MESSAGES } from "../impl/toastPublisher.svelte"
import type { Serializer } from "@application/ports/infra/Serializer"
import {
  SchemaValidationError,
  type URLTitleCollection,
} from "@domain/entities/URLTitleCollection"
import type { ExportURLTitleCollectionFileUseCase } from "@application/usecases/file/exportURLTitleCollectionFile"

export function createExportURLTitleFileClickHandler(
  exportURLTitleFileUseCase: ExportURLTitleCollectionFileUseCase,
) {
  return function exportURLTitleFileClickHandler() {
    exportURLTitleFileUseCase()
  }
}

export class DOMURLTitleFileUploadHandler {
  // single file for now
  blob: Blob | null = null
  constructor(
    private serializer: Serializer<URLTitleCollection, string>,
    private uploadURLTitleCollectionUseCase: UploadURLTitleCollectionUseCase,
    private toastPublisher: ToastPublisher,
  ) {}

  private async deserializeAndRunUploadUseCase() {
    try {
      if (this.blob) {
        const blobText = await this.blob.text()
        console.log("[blobText]", blobText, typeof blobText)
        // deserialize
        const loadedCollection = this.serializer.deserialize(blobText)
        // schema check
        // same field in file?
        // run use case
        this.uploadURLTitleCollectionUseCase(loadedCollection)
      } else {
        throw new Error("Tried to read uploaded file, but it's not set.")
      }
    } catch (e) {
      if (e instanceof SchemaValidationError) {
        this.toastPublisher.publishToast(TOAST_MESSAGES.UPLOAD_VALIDATION_ERROR)
      } else if (e instanceof SyntaxError) {
        // json parse error probably
        this.toastPublisher.publishToast(
          TOAST_MESSAGES.UPLOAD_INAPPROPRIATE_FORMAT,
        )
        // this.toastPublisher.publishToast(`${e.name}: ${e.message}`)
      } else if (e instanceof Error) {
        this.toastPublisher.publishToast(
          `Error while uploading file:\n${e.name}: ${e.message}`,
        )
      } else {
        // this should not happen
        this.toastPublisher.publishToast(
          `Error while uploading file:\nSomething strange is happening....`,
        )
        this.toastPublisher.publishToast(`Catched: ${e}`)
      }
    }
  }

  // use this for input type="file" tag directly
  createFileLoadInputChangeHandler(): (e: Event) => void {
    // have to be arrow function to use `this`
    const changeFileLoadHandler = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files || []
      if (0 < files.length) {
        this.blob = files[0]
        await this.deserializeAndRunUploadUseCase()
        this.blob = null
        target.value = ""
      }
    }
    return changeFileLoadHandler
  }
  // use this when creating custom element for input
  createFileLoadCustomUIHandlers(
    options: {
      click?: boolean
      dragndrop?: boolean
    } = { click: true, dragndrop: true },
  ): {
    // click method will trigger hidden input type="file" tag click
    click?: {
      hiddenInputElement: HTMLInputElement
      clickHiddenInputFileTag: () => void
    }
    // registering both to custom ui element to drop will work
    dragndrop?: {
      dragoverFileLoadHandler: (e: DragEvent) => void
      dropFileLoadHandler: (e: DragEvent) => void
    }
  } {
    const handlers = {} as ReturnType<
      typeof this.createFileLoadCustomUIHandlers
    >
    // create click handler
    if (options?.click) {
      const hiddenInput = document.createElement("input")
      hiddenInput.type = "file"
      hiddenInput.style.display = "none"
      hiddenInput.addEventListener("change", async (e) => {
        console.log("[hidden input change]")
        const target = e.target as HTMLInputElement
        const files = target.files
        if (files !== null && 0 < files.length) {
          console.log("[hidden input change handler] [files]", files)
          this.blob = files[0]
          await this.deserializeAndRunUploadUseCase()
          this.blob = null
          target.value = ""
          console.log("[set blob to null]")
        } else {
          console.error(
            "[hidden input change handler] [given files are falsy]",
            files,
          )
        }
      })
      handlers.click = {
        hiddenInputElement: hiddenInput,
        clickHiddenInputFileTag: () => hiddenInput.click(),
      }
    }
    // create drag and drop handlers
    if (options?.dragndrop) {
      handlers.dragndrop = {
        dragoverFileLoadHandler(e) {
          e.preventDefault()
        },
        // have to be arrow function to use `this`
        dropFileLoadHandler: async (e) => {
          e.preventDefault()
          if (e.dataTransfer) {
            const files = e.dataTransfer.files
            console.log(
              "[drop file load handler]",
              "[dataTransfer files]",
              files,
            )
            if (0 < files.length) {
              this.blob = files[0]
              await this.deserializeAndRunUploadUseCase()
              this.blob = null
              // target.value = ""
            }
          } else {
            console.error(
              "[drop file load handler]",
              "[DragEvent.dataTransfer is falsy]",
            )
          }
        },
      }
    }
    return handlers
  }
}
