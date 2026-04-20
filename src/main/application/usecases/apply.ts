// import { tabIdxInfoStore } from "@main/bootstrap"
import type { TabInfoStore } from "../ports/TabInfoStore"
import type { PlatformMainFacade } from "../ports/PlatformMainFacade"

export interface ApplyLifeCycle {
  beforeStart?(): void
  closePageAfterFinish?(): void
}
export type ApplyUseCase = ReturnType<typeof createApplyUseCase>

export function createApplyUseCase(
  tabInfoStore: TabInfoStore,
  extensionFacade: PlatformMainFacade,
  lifeCycle: ApplyLifeCycle,
) {
  return async function apply() {
    lifeCycle.beforeStart?.()

    await Promise.allSettled(
      tabInfoStore
        .getTabInfosToApply()
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
