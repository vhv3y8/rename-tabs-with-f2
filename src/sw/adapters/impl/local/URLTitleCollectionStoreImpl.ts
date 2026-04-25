import type { PlatformSWFacade } from "../../../application/ports/infra/PlatformSWFacade"
import type { URLTitleCollectionSWStore } from "../../../application/ports/URLTitleCollectionSWStore"
import { URLTitleRecordSW } from "../../../domain/entities/URLTitleCollectionSW"

export class URLTitleRecordStoreImpl implements URLTitleCollectionSWStore {
  private constructor(
    private collection: URLTitleRecordSW,
    private extensionFacade: PlatformSWFacade,
  ) {
    this.collection = new URLTitleRecordSW()
  }

  async getCollection() {
    // read every time
    const titleRecord = await this.extensionFacade.getTitleRecord()
    this.collection.fromRecord(titleRecord)
    return this.collection
  }
}
