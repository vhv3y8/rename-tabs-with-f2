export interface TitleApplyingStore {
  // fetchTitleApplyingInfos(): Promise<void>

  getAllAppliedTitleOriginals(
    tabIds: number[],
  ): Promise<{ id: number; originalTitle: string | null }[]>
  setOriginalTitle(tabId: number, originalTitle: string): Promise<void>
}
