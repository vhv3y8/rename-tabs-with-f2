// import { tabIdxInfoStore } from "@main/bootstrap"
import type { TabInfoStore } from "../ports/TabInfoStore"
import type { URLTitleCollectionStore } from "../ports/URLTitleCollectionStore"
import type { PlatformMainFacade } from "../ports/infra/PlatformMainFacade"

export interface ApplyLifeCycle {
  beforeStart?(): void
  closePageAfterFinish?(): void
}
export type ApplyUseCase = ReturnType<typeof createApplyUseCase>

export function createApplyUseCase(
  tabInfoStore: TabInfoStore,
  urlTitleCollectionStore: URLTitleCollectionStore,
  extensionFacade: PlatformMainFacade,
  lifeCycle: ApplyLifeCycle,
) {
  return async function apply() {
    lifeCycle.beforeStart?.()

    // remove stuffs to remove from url title and save it?
    // empty input -> remove from db if exists

    const tabInfosToApply = tabInfoStore.getTabInfosToApply()
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

    lifeCycle.closePageAfterFinish?.()
  }
}
