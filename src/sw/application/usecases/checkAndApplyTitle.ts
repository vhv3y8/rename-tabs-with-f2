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
  title: string
}

export function createCheckAndApplyTitle(
  extensionFacade: PlatformSWFacade,
  settingStore: SettingStore,
  urlTitleCollectionSWStore: URLTitleCollectionSWStore,
  saveOriginalTitleBeforeApplyUseCase: SaveOriginalTitleBeforeApplyUseCase,
) {
  return async function checkAndApplyTitle({
    id,
    url,
    title,
  }: TitleApplyingInfo) {
    console.log("[check and apply title] [given input]", {
      id,
      url,
      title,
    })
    // check setting
    if (await settingStore.shouldApplyTitles()) {
      console.log("[check and apply title] [setting] [should apply titles]")

      // check persisted title
      const titleCollection = await urlTitleCollectionSWStore.getCollection()
      const persistedTitle = titleCollection.getMatchingTitle(url)
      // can be fired by title change event
      if (persistedTitle !== null && title !== persistedTitle) {
        // fire and forget
        saveOriginalTitleBeforeApplyUseCase({ id, originalTitle: title })
        console.log(
          "[check and apply title] [persisted title exists] [saved original title]",
          { id, title },
        )

        console.log("[applying title]", persistedTitle)
        // apply title
        await extensionFacade.applyPersistedTitle(id, persistedTitle)
      }
    }
  }
}
