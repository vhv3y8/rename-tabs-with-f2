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
    console.log("[checking all tab connections]")
    const allTabInfos = tabInfoStore.getAllTabInfos()

    // check
    type TabConnectionReturn = {
      // TODO id undefined problem
      index: number
      id: number | undefined
      isConnected: boolean
    }
    // TODO: fix
    const tabConnectionResults = await Promise.allSettled(
      allTabInfos.map(async ({ id, index }) => {
        // defaults to false
        let isConnected: boolean = false
        try {
          const trueReturnIfAlive = await extensionFacade.checkTabConnection({
            tabId: id!,
          })
          isConnected = trueReturnIfAlive === true
        } catch {
          // maybe connection error but do nothing anyway
        }
        return { id, index, isConnected }
      }),
    )
    const fulfilledConnections: TabConnectionReturn[] = tabConnectionResults
      .filter((res) => res.status === "fulfilled")
      .map((res) => res.value)

    for (const { index: tabIndex, isConnected } of fulfilledConnections) {
      tabInfoStore.setConnectedFlag(tabIndex, isConnected)
    }

    // update info
    // TODO: fix
    // for (const [idx, isConnected] of tabConnectedFlags.entries()) {
    //   tabInfoStore.setConnectedFlag(idx, isConnected)
    // }

    // if (import.meta.env.MODE === "development")
    //   console.log(
    //     "[checkContentScriptAvailableAndUpdateAllInfo] tabIdxToInfo",
    //     JSON.stringify(
    //       tabInfoStore.getAllTabInfos().map(({ id, title, connected }) => ({
    //         id,
    //         title,
    //         connected,
    //       })),
    //       null,
    //       2,
    //     ),
    //   )
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
