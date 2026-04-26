import type { PlatformMainFacade } from "@application/ports/infra/PlatformMainFacade"
import type { OriginalTitleStore } from "@application/ports/OriginalTitleStore"
import type { TitleApplyingInfosReord } from "@sw/application/ports/infra/PlatformSWFacade"

export class OriginalTitleRecordStore implements OriginalTitleStore {
  tabIdOriginalTitleRecord: Record<number, string>
  private constructor(existingOriginalTitles: TitleApplyingInfosReord) {
    this.tabIdOriginalTitleRecord = Object.fromEntries(
      existingOriginalTitles.map((val) => [val.id, val.originalTitle]),
    )
  }
  static async build(extensionFacade: PlatformMainFacade, tabIds: number[]) {
    const originalTitleRecords =
      await extensionFacade.fetchExistingTitleApplyingInfos(tabIds)
    return new OriginalTitleRecordStore(originalTitleRecords)
  }

  async getOriginalTitlesFromTabIds(tabIds: number[]) {
    return tabIds.map((id) => this.tabIdOriginalTitleRecord[id] || null)
  }
}
