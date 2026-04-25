import type { PlatformSWFacade } from "../../../application/ports/infra/PlatformSWFacade"
import type { TitleApplyingStore } from "../../../application/ports/TitleApplyingStore"

// session storage
export class TitleApplyingStoreImpl implements TitleApplyingStore {
  constructor(public extensionFacade: PlatformSWFacade) {}

  getAllAppliedTitleOriginals(tabIds: number[]): [number | null][] {
    //
  }
  setOriginalTitle(tabId: number, originalTitle: string): void {
    //
  }
}
