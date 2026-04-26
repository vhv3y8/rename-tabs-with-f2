export interface OriginalTitleStore {
  getOriginalTitlesFromTabIds(tabIds: number[]): (string | null)[]
}
