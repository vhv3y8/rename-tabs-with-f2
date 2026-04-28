export interface OriginalTitleStore {
  getOriginalTitlesFromTabIds(
    tabIds: number[],
  ): Promise<Record<number, string | null>>
}
