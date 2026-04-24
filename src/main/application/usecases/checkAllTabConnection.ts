import type { PlatformMainFacade } from "../ports/infra/PlatformMainFacade"
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

    type TabConnectionReturn = {
      index: number
      id: number
      isConnected: boolean
    }
    // check
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
      if (isConnected) {
        tabInfoStore.setConnectedFlag(tabIndex, isConnected)
      }
    }
  }
}
