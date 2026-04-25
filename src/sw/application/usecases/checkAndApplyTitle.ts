import type { PlatformSWFacade } from "../ports/infra/PlatformSWFacade"
import type { SettingStore } from "../ports/SettingStore"
import type { URLTitleCollectionSWStore } from "../ports/URLTitleCollectionSWStore"
import type { SaveOriginalTitleBeforeApplyUseCase } from "./saveOriginalTitleBeforeApply"

export type CheckAndApplyTitleUseCase = ReturnType<
  typeof createCheckAndApplyTitle
>

export type TitleApplyingInfo = {
  id: number
  url: string
  originalTitle: string
}

export function createCheckAndApplyTitle(
  extensionFacade: PlatformSWFacade,
  settingStore: SettingStore,
  urlTitleCollectionStore: URLTitleCollectionSWStore,
  saveOriginalTitleBeforeApplyUseCase: SaveOriginalTitleBeforeApplyUseCase,
) {
  return async function checkAndApplyTitle(tabInfo: TitleApplyingInfo) {
    // check setting
    if (await settingStore.shouldApplyTitles()) {
      // check persisted title
      const titleCollection = await urlTitleCollectionStore.getCollection()
      const persistedTitle = titleCollection.getMatchingTitle(tabInfo.url)

      if (persistedTitle !== null) {
        // save original title
        saveOriginalTitleBeforeApplyUseCase({
          id: tabInfo.id,
          originalTitle: tabInfo.originalTitle,
        })

        // apply title
        await extensionFacade.applyPersistedTitle(tabInfo.id, persistedTitle)
      }
    }
  }
}
