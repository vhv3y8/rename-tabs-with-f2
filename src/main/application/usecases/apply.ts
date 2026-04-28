import type { TabTitle, URLMatch } from "@domain/entities/URLTitleCollection"
import type { TabInfoStore } from "../ports/TabInfoStore"
import type { URLTitleCollectionStore } from "../ports/URLTitleCollectionStore"
import type { PlatformMainFacade } from "../ports/infra/PlatformMainFacade"
import type { SettingStore } from "@application/ports/SettingStore"

export interface ApplyLifeCycle {
  beforeStart?(): void
  closePageAfterFinish?(): void
}
export type ApplyUseCase = ReturnType<typeof createApplyUseCase>

export function createApplyUseCase(
  tabInfoStore: TabInfoStore,
  urlTitleCollectionStore: URLTitleCollectionStore,
  settingStore: SettingStore,
  extensionFacade: PlatformMainFacade,
  lifeCycle: ApplyLifeCycle,
) {
  return async function apply() {
    lifeCycle.beforeStart?.()
    const tabInfosToApply = tabInfoStore.getTabInfosToApply()
    if (import.meta.env.MODE === "development")
      console.log(
        "[apply] [tab infos to apply]",
        tabInfosToApply.map(
          ({ url, title, originalTitle, userInputTitle }) => ({
            url,
            userInputTitle,
            originalTitle,
            title,
          }),
        ),
      )

    if (await settingStore.shouldPersistTitles()) {
      const urlTitleCollection = await urlTitleCollectionStore.getCollection()

      // remove empty title entries from db
      const tabInfosToRemove = tabInfosToApply.filter(
        ({ userInputTitle }) => userInputTitle === "",
      )
      const urlsToRemove = tabInfosToRemove.map(({ url }) => url)
      urlTitleCollection.removeEntries(urlsToRemove)
      if (import.meta.env.MODE === "development")
        console.log("[apply] [removed empty title entries]", urlsToRemove)

      // add or update title entries
      const entriesToAddOrUpdate = tabInfosToApply
        .filter(({ userInputTitle }) => userInputTitle !== "")
        .map(({ url, userInputTitle }) => [url, userInputTitle]) as [
        URLMatch,
        TabTitle,
      ][]
      urlTitleCollection.appendEntriesWithResolvedConflictions(
        entriesToAddOrUpdate,
        [],
      )
      if (import.meta.env.MODE === "development")
        console.log("[apply] [add or updated entries]", entriesToAddOrUpdate)

      urlTitleCollectionStore.storeUpdatedCollection()
      if (import.meta.env.MODE === "development")
        console.log("[apply] [stored collection]", urlTitleCollection)
    }

    await Promise.allSettled(
      tabInfosToApply
        // send changed title to each content script
        .map(({ id, title, userInputTitle, originalTitle }) => {
          let titleToApply = userInputTitle || originalTitle || title
          if (import.meta.env.MODE === "development")
            console.log("[applying]", {
              userInputTitle,
              originalTitle,
              title,
              titleToApply,
            })
          return extensionFacade.renameTabTitle({
            // why this can be null/undefined??
            tabId: id!,
            title: titleToApply,
          })
        }),
    )

    lifeCycle.closePageAfterFinish?.()
  }
}
