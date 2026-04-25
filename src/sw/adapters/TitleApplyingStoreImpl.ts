import type { TitleApplyingStore } from "../application/ports/TitleApplyingStore"

export class TitleApplyingStoreImpl implements TitleApplyingStore {
  getAllAppliedTitleOriginals(tabIds: number[]): [number | null][] {
    //
  }
  setOriginalTitleBeforeApply(tabId: number, originalTitle: string): void {
    //
  }
}
