import type { FileStorage } from "@main/application/ports/infra/FileStorage"

export class FileAPIStorage implements FileStorage {
  async load() {}
  async save(data: any) {
    return true
  }
}
