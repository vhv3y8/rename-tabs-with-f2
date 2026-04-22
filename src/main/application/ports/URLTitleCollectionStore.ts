import type { URLTitleCollection } from "@main/domain/entities/URLTitleCollection"

export interface URLTitleCollectionStore {
  initializeCollection(collection: URLTitleCollection): void
  getCollection(): URLTitleCollection
}
