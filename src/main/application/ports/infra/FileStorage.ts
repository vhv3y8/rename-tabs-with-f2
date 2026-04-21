export interface FileStorage {
  load(options?: any): Promise<any>
  save(data: any): Promise<boolean>
}
