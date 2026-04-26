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
  urlTitleCollectionSWStore: URLTitleCollectionSWStore,
  saveOriginalTitleBeforeApplyUseCase: SaveOriginalTitleBeforeApplyUseCase,
) {
  return async function checkAndApplyTitle(tabInfo: TitleApplyingInfo) {
    console.log("[check and apply title] [given input]", tabInfo)
    // check setting
    if (await settingStore.shouldApplyTitles()) {
      console.log("[check and apply title] [setting] [should apply titles]")

      // check persisted title
      const titleCollection = await urlTitleCollectionSWStore.getCollection()
      const persistedTitle = titleCollection.getMatchingTitle(tabInfo.url)

      if (persistedTitle !== null) {
        console.log(
          "[check and apply title] [persisted title exists]",
          persistedTitle,
        )

        // fire and forget
        saveOriginalTitleBeforeApplyUseCase({
          id: tabInfo.id,
          originalTitle: tabInfo.originalTitle,
        })
        console.log("[check and apply title] [saved original title]", {
          id: tabInfo.id,
          originalTitle: tabInfo.originalTitle,
        })

        console.log("[applying title]")
        // apply title
        await extensionFacade.applyPersistedTitle(tabInfo.id, persistedTitle)
      }
    }
  }
}
