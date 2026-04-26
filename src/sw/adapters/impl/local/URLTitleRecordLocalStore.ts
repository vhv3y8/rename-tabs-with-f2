import type { PlatformSWFacade } from "@sw/application/ports/infra/PlatformSWFacade"
import type { URLTitleCollectionSWStore } from "@sw/application/ports/URLTitleCollectionSWStore"
import { URLTitleRecordSW } from "@sw/domain/entities/URLTitleCollectionSW"

export class URLTitleRecordLocalStore implements URLTitleCollectionSWStore {
  private constructor(
    private urlTitleRecord: URLTitleRecordSW,
    private extensionFacade: PlatformSWFacade,
  ) {}
  static async build(extensionFacade: PlatformSWFacade) {
    const titleRecord = await extensionFacade.getTitleRecord()
    return new URLTitleRecordLocalStore(
      new URLTitleRecordSW().fromRecord(titleRecord),
      extensionFacade,
    )
  }

  async fetchCollection() {
    const fetchedRecord = await this.extensionFacade.getTitleRecord()
    this.urlTitleRecord = new URLTitleRecordSW().fromRecord(fetchedRecord)
  }

  async getCollection() {
    return this.urlTitleRecord
  }
}
