import type { URLTitleCollectionStore } from "@main/application/ports/URLTitleCollectionStore"
import {
  URLTitleRecord,
  type TabTitle,
  type URLMatch,
  type URLTitleCollection,
} from "@main/domain/entities/URLTitleCollection"

export class URLTitleCollectionStoreImpl implements URLTitleCollectionStore {
  constructor(public collection: URLTitleCollection | null = null) {}

  initializeCollection(record: Record<URLMatch, TabTitle>): void {
    this.collection = new URLTitleRecord(record)
  }
  getCollection(): URLTitleCollection {
    if (this.collection === null) {
      this.collection = new URLTitleRecord({})
    }
    return this.collection
  }
}
