export interface FileStorage {
  // is this right?
  createLoadChangeHandler(): (e: Event) => void
  createLoadDragoverDropHandler(): {
    dragoverHandler: (e: DragEvent) => void
    dropHandler: (e: DragEvent) => void
  }
  // or this?
  loadFile(blob: Blob): Promise<any>

  saveFile(data: any): Promise<boolean>
}
