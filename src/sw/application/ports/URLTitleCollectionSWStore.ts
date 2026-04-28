import type { URLTitleCollectionSW } from "../../domain/entities/URLTitleCollectionSW"

export interface URLTitleCollectionSWStore {
  fetchCollection(): Promise<void>

  getCollection(): Promise<URLTitleCollectionSW>
}
