import type { FileExporter } from "@application/ports/infra/FileExporter"
import type { Serializer } from "@application/ports/infra/Serializer"

export class WebTextFileExporter<T> implements FileExporter<T> {
  constructor(
    public serializer: Serializer<T, string>,
    public saveMimeType = "text/plain",
    public saveFileName = "data.txt",
  ) {}

  async export(data: T) {
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
}
