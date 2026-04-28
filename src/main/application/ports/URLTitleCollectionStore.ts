import type { URLTitleCollection } from "@main/domain/entities/URLTitleCollection"

export interface URLTitleCollectionStore {
  getCollection(): Promise<URLTitleCollection>
  storeUpdatedCollection(): Promise<void>
}
