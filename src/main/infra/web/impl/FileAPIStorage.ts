import type { FileStorage } from "@main/application/ports/infra/FileStorage"
import type {
  Deserializer,
  Serializer,
} from "@main/application/ports/infra/Serializer"

export class FileAPIStorage implements FileStorage {
  constructor(serializer: Serializer, deserializer: Deserializer) {}

  async load() {}
  async saveFile(data: any) {
    return true
  }
}
