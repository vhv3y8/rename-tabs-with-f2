import type {
  PlatformSWFacade,
  TitleApplyingInfosReord,
} from "@sw/application/ports/infra/PlatformSWFacade"
import type { OriginalTitleStore } from "@sw/application/ports/OriginalTitleStore"

export class OriginalTitleSessionStore implements OriginalTitleStore {
  private constructor(
    public titleApplyingInfos: TitleApplyingMap,
    private extensionFacade: PlatformSWFacade,
  ) {}
  static async build(extensionFacade: PlatformSWFacade) {
    const titleApplyingRecord =
      await extensionFacade.getSessionTitleApplyingInfos()
    return new OriginalTitleSessionStore(
      new TitleApplyingMap(titleApplyingRecord || []),
      extensionFacade,
    )
  }

  // fetch and sync session
  // async fetchTitleApplyingInfos() {
  //   const titleApplyingRecord: TitleApplyingInfosReord =
  //     await this.extensionFacade.getSessionTitleApplyingInfos()
  //   this.titleApplyingInfos = new TitleApplyingMap(titleApplyingRecord)
  // }
  // always sync after value update
  async syncTitleApplyingInfos() {
    const storageFormat: TitleApplyingInfosReord =
      this.titleApplyingInfos.toStorageValue()
    await this.extensionFacade.setSessionTitleApplyingInfos(storageFormat)
  }

  async getAllAppliedTitleOriginals(tabIds: number[]) {
    return this.titleApplyingInfos.getAllAppliedTitleOriginals(tabIds)
  }
  async setOriginalTitle(tabId: number, originalTitle: string) {
    await this.titleApplyingInfos.setOriginalTitle(tabId, originalTitle)
    await this.syncTitleApplyingInfos()
  }
}

export class TitleApplyingMap implements Partial<OriginalTitleStore> {
  tabIdOriginalTitleMap: Map<number, string>
  constructor(storageValue: TitleApplyingInfosReord) {
    this.tabIdOriginalTitleMap = new Map(
      storageValue.map(({ id, originalTitle }) => [id, originalTitle]),
    )
  }

  resetFromStorageValue(storageValue: TitleApplyingInfosReord) {
    this.tabIdOriginalTitleMap = new Map(
      storageValue.map(({ id, originalTitle }) => [id, originalTitle]),
    )
  }
  toStorageValue(): TitleApplyingInfosReord {
    return Array.from(this.tabIdOriginalTitleMap).map(
      ([id, originalTitle]) => ({
        id,
        originalTitle,
      }),
    )
  }

  async getAllAppliedTitleOriginals(tabIds: number[]) {
    if (tabIds.length === 0) {
      // give all if empty array
      return this.toStorageValue()
    } else return this.toStorageValue().filter(({ id }) => tabIds.includes(id))
  }
  async setOriginalTitle(tabId: number, originalTitle: string) {
    this.tabIdOriginalTitleMap.set(tabId, originalTitle)
  }
}
