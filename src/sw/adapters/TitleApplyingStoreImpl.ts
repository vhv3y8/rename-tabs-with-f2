import type { TitleApplyingStore } from "../application/ports/TitleApplyingStore"

// session storage
export class TitleApplyingStoreImpl implements TitleApplyingStore {
  getAllAppliedTitleOriginals(tabIds: number[]): [number | null][] {
    //
  }
  setOriginalTitle(tabId: number, originalTitle: string): void {
    //
  }
}
