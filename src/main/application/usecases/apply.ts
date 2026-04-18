import { tabIdxInfoStore } from "@main/bootstrap.svelte"
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

// export async function apply() {
//   if (import.meta.env.MODE === "development") console.log("[apply]")
//   // trigger change event for focused element to apply input changes
//   document.activeElement?.dispatchEvent(new Event("change", { bubbles: true }))

//   await Promise.allSettled(
//     tabIdxInfoStore
//       .getTabInfosToApply()
//       // send changed title to each content script
//       .map(({ id, title }) =>
//         ChromeMainFacadeImpl.renameTabTitle({
//           // why this can be null/undefined??
//           id: id!,
//           title: title!,
//         }),
//       ),
//   )

//   // close window after focusing tab
//   window.close()
// }
