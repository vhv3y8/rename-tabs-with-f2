export interface TitleApplyingStore {
  saveStore(): Promise<void>

  getAllAppliedTitleOriginals(tabIds: number[]): [number | null][]
  setOriginalTitle(tabId: number, originalTitle: string): Promise<void>
}
