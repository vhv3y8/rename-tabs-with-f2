import type { PlatformSWFacade } from "@sw/application/ports/infra/PlatformSWFacade"
import type { TitleApplyingStore } from "@sw/application/ports/TitleApplyingStore"

// session storage
export class TitleApplyingStoreImpl implements TitleApplyingStore {
  constructor(public extensionFacade: PlatformSWFacade) {}

  async getAllAppliedTitleOriginals(tabIds: number[]) {
    //
  }
  async setOriginalTitle(tabId: number, originalTitle: string) {
    //
  }
}
