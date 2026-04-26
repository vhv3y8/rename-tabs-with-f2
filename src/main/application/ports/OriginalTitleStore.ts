export interface OriginalTitleStore {
  // initialize(): Promise<void>
  getOriginalTitlesFromTabIds(tabIds: number[]): Promise<(string | null)[]>
}
