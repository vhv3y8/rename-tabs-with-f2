import type { FileStorage } from "@main/application/ports/infra/FileStorage"
import type { Serializer } from "@main/application/ports/infra/Serializer"

export class WebAPITextFileStorage<T> implements FileStorage<T> {
  // single file for now
  blob: Blob | null = null
  public saveMimeType: string = "text/plain"
  public saveFileName: string = "file.txt"
  constructor(public serializer: Serializer<T, string>) {}
  // setSaveConfig("application/json", "RenameTabsWithF2-TitlesData.json")
  setSaveConfig(saveMimeType: string, saveFileName: string) {
    this.saveMimeType = saveMimeType
    this.saveFileName = saveFileName
  }

  async loadFile(): Promise<T> {
    if (this.blob) {
      const blobText = await this.blob.text()
      return Promise.resolve(this.serializer.deserialize(blobText))
    }
    return Promise.reject(new Error("File is not added."))
  }
  async saveFile(data: T) {
    const serialized = this.serializer.serialize(data)
    // create blob
    const blob = new Blob([serialized], { type: this.saveMimeType })
    // create url and <a> tag
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = this.saveFileName
    // click <a> tag and remove url
    a.click()
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
  }

  // use this for input type="file" tag directly
  createFileLoadInputChangeHandler(): (e: Event) => void {
    // have to be arrow function to use `this`
    const changeFileLoadHandler = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files || []
      if (0 < files.length) {
        this.blob = files[0]
      }
    }
    return changeFileLoadHandler
  }
  // use this when creating custom element for input
  createFileLoadCustomUIHandlers(
    options: {
      click: boolean
      dragndrop: boolean
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
      hiddenInput.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement
        const files = target.files
        if (files !== null && 0 < files.length) {
          console.log("[hidden input change handler] [files]", files)
          // single file for now
          this.blob = files[0]
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
        dropFileLoadHandler: (e) => {
          e.preventDefault()
          if (e.dataTransfer) {
            const files = e.dataTransfer.files
            console.log(
              "[drop file load handler]",
              "[dataTransfer files]",
              files,
            )
            if (0 < files.length) {
              // single file for now
              this.blob = files[0]
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
