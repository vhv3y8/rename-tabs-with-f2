import type { PlatformSWFacade } from "@sw/application/ports/infra/PlatformSWFacade"
import type { URLTitleCollectionSWStore } from "@sw/application/ports/URLTitleCollectionSWStore"
import { URLTitleRecordSW } from "@sw/domain/entities/URLTitleCollectionSW"

export class URLTitleRecordStoreImpl implements URLTitleCollectionSWStore {
  private constructor(
    private collection: URLTitleRecordSW,
    private extensionFacade: PlatformSWFacade,
  ) {
    this.collection = new URLTitleRecordSW()
  }

  async getCollection() {
    // read every time for now
    const titleRecord = await this.extensionFacade.getTitleRecord()
    this.collection.fromRecord(titleRecord)
    return this.collection
  }
}
