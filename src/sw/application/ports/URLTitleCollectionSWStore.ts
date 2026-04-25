import type { URLTitleCollectionSW } from "../../domain/entities/URLTitleCollectionSW"

export interface URLTitleCollectionSWStore {
  getCollection(): Promise<URLTitleCollectionSW>
}
