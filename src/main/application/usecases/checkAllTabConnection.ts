import type { PlatformMainFacade } from "../ports/PlatformMainFacade"
import type { TabInfoStore } from "../ports/TabInfoStore"

export type CheckAllTabConnectionUseCase = ReturnType<
  typeof createCheckAllTabConnectionAndUpdateFlags
>

export function createCheckAllTabConnectionAndUpdateFlags(
  tabInfoStore: TabInfoStore,
  extensionFacade: PlatformMainFacade,
) {
  return async function checkAllTabConnectionAndUpdateFlags() {
    let allTabIds = tabInfoStore.getAllTabIds()

    // check
    // TODO: fix
    let tabConnectedFlags = await Promise.allSettled(
      allTabIds.map((tabId) => extensionFacade.checkTabConnection({ tabId })),
    ).then((arr) =>
      arr.map((item) => item.status === "fulfilled" && item.value == true),
    )
    // update info
    // TODO: fix
    for (const [idx, isConnected] of tabConnectedFlags.entries()) {
      tabInfoStore.setConnectedFlag(idx, isConnected)
    }

    if (import.meta.env.MODE === "development")
      console.log(
        "[checkContentScriptAvailableAndUpdateAllInfo] tabIdxToInfo",
        JSON.stringify(
          tabInfoStore.getAllTabInfos().map(({ id, title, connected }) => ({
            id,
            title,
            connected,
          })),
          null,
          2,
        ),
      )
  }
}

// export async function checkAllTabConnectionAndUpdateFlags() {
//   let allTabIds = tabIdxInfoStore.getAllTabIds()

//   // check
//   let tabConnectedFlags = await Promise.allSettled(
//     allTabIds.map((tabId) => ChromeMainFacade.checkTabConnection({ tabId })),
//   ).then((arr) =>
//     // TODO: fix
//     arr.map((item) => item.status === "fulfilled" && item.value == true),
//   )

//   // update info
//   for (const [idx, isConnected] of tabConnectedFlags.entries()) {
//     tabIdxInfoStore.setConnectedFlag(idx, isConnected)
//   }

//   if (import.meta.env.MODE === "development")
//     console.log(
//       "[checkContentScriptAvailableAndUpdateAllInfo] tabIdxToInfo",
//       JSON.stringify(
//         tabIdxInfoStore.getAllTabInfos().map(({ id, title, connected }) => ({
//           id,
//           title,
//           connected,
//         })),
//         null,
//         2,
//       ),
//     )
// }
