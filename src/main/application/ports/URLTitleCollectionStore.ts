import type {
  TabTitle,
  URLMatch,
  URLTitleCollection,
} from "@main/domain/entities/URLTitleCollection"

export interface URLTitleCollectionStore {
  initializeCollection(record: Record<URLMatch, TabTitle>): void
  getCollection(): URLTitleCollection
  storeUpdatedCollection(): Promise<void>
}
