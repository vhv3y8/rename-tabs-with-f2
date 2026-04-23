import type { PlatformMainFacade } from "@main/application/ports/infra/PlatformMainFacade"
import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"
import {
  URLTitleRecord,
  type TabTitle,
  type URLMatch,
  type URLTitleCollection,
} from "@main/domain/entities/URLTitleCollection"

export class URLTitleCollectionStoreImpl implements URLTitleCollectionStore {
  constructor(
    public collection: URLTitleCollection | null = null,
    public extensionFacade: PlatformMainFacade,
  ) {}

  initializeCollection(record: Record<URLMatch, TabTitle>): void {
    this.collection = new URLTitleRecord().fromRecord(record)
  }
  getCollection(): URLTitleCollection {
    // if (this.collection === null) {
    //   this.collection = new URLTitleRecord()
    // }
    return this.collection
  }
  async storeUpdatedCollection(): Promise<void> {
    if (this.collection === null) {
      // not initialized. do nothing
      console.error(
        "[url title collection store] [tried to store updated url -> title collection] [but it's not initialized]",
      )
      return
    } else {
      return this.extensionFacade.setTitleRecord(this.collection.toRecord())
    }
  }
}
