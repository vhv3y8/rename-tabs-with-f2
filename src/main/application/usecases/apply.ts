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
    console.log("[apply] [tab infos to apply]", tabInfosToApply)

    if (await settingStore.shouldPersistTitles()) {
      const urlTitleCollection = await urlTitleCollectionStore.getCollection()

      // remove empty title entries from db
      const tabInfosToRemove = tabInfosToApply.filter(
        ({ title }) => title === "",
      )
      const urlsToRemove = tabInfosToRemove.map(({ url }) => url)
      urlTitleCollection.removeEntries(urlsToRemove)
      console.log("[apply] [removed empty title entries]", urlsToRemove)

      // add or update title entries
      const entriesToAddOrUpdate = tabInfosToApply
        .filter(({ title }) => title !== "")
        .map(({ url, title }) => [url, title]) as [URLMatch, TabTitle][]
      urlTitleCollection.appendEntriesWithResolvedConflictions(
        entriesToAddOrUpdate,
        [],
      )
      console.log("[apply] [add or updated entries]", entriesToAddOrUpdate)

      // update store
      urlTitleCollectionStore.storeUpdatedCollection()
      console.log("[apply] [stored collection]")
    }

    await Promise.allSettled(
      tabInfosToApply
        // send changed title to each content script
        .map(({ id, title }) =>
          extensionFacade.renameTabTitle({
            // why this can be null/undefined??
            tabId: id!,
            title: title!,
          }),
        ),
    )

    // lifeCycle.closePageAfterFinish?.()
  }
}
