export interface FileStorage<T> {
  loadFile(): Promise<T>
  saveFile(data: T): Promise<void>
}
