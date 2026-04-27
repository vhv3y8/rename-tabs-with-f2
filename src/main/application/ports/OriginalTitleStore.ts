export interface OriginalTitleStore {
  // initialize(): Promise<void>
  getOriginalTitlesFromTabIds(
    tabIds: number[],
  ): Promise<Record<number, string | null>>
}
