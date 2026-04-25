export type TitleApplyingInfo = {
  id: number
  originalTitle: string
}

export interface TitleApplyingStore {
  setOriginalTitle(tabId: number, originalTitle: string): void
  getAllAppliedTitleOriginals(tabIds: number[]): [number | null][]
}
