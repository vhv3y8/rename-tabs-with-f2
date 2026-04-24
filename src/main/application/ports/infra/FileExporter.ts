export interface FileExporter<T> {
  export(data: T): Promise<void>
}
