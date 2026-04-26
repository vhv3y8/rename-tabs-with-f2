export interface TitleApplyingStore {
  fetchTitleApplyingInfos(): Promise<void>

  getAllAppliedTitleOriginals(tabIds: number[]): Promise<(string | null)[]>
  setOriginalTitle(tabId: number, originalTitle: string): Promise<void>
}
