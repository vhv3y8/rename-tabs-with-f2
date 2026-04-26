import type { PlatformMainFacade } from "@main/application/ports/infra/PlatformMainFacade"
import {
  StoreNotInitializedError,
  type URLTitleCollectionStore,
} from "@main/application/ports/URLTitleCollectionStore"
import {
  URLTitleRecord,
  type TabTitle,
  type URLMatch,
  type URLTitleCollection,
} from "@main/domain/entities/URLTitleCollection"

export class URLTitleRecordStore implements URLTitleCollectionStore {
  // public collection: URLTitleCollection | null = null
  private constructor(
    private urlTitleRecord: URLTitleRecord,
    private extensionFacade: PlatformMainFacade,
  ) {}
  static async build(extensionFacade: PlatformMainFacade) {
    const record = await extensionFacade.getTitleRecord()
    return new URLTitleRecordStore(
      new URLTitleRecord().fromRecord(record),
      extensionFacade,
    )
  }

  async getCollection() {
    // if (this.urlTitleRecord === null) {
    //   throw new StoreNotInitializedError(
    //     "Tried to read [URL -> Title] Database before it's initialized.",
    //   )
    // }
    return this.urlTitleRecord
  }
  async storeUpdatedCollection(): Promise<void> {
    if (this.urlTitleRecord === null) {
      // not initialized. do nothing
      console.error(
        "[url title collection store] [tried to store updated url -> title collection] [but it's not initialized]",
      )
      return
    } else {
      return this.extensionFacade.setTitleRecord(this.urlTitleRecord.toRecord())
    }
  }
}
