import {
  tabIdxInfoStore,
  type TabInfoState,
} from "@adapters/tabs/impl/tabInfo.svelte"
// import { tabItemComponents } from "@adapters/tabs/states/tabItemComponents.svelte"
import { ChromeMainFacadeImpl } from "@infra/ChromeMainFacade"

export async function initializeTabInfoStore() {
  // get tabs
  const tabsToInitialize = await ChromeMainFacadeImpl.getTabEntries()
  // reduce to appropriate format
  const tabIdxInfoRecord = tabsToInitialize.reduce(
    (
      acc: Record<number, TabInfoState>,
      { id, title, favIconUrl, url, index, status },
    ) => {
      // key have to be index. index is tab's position on current window tabs array
      acc[index] = {
        id,
        title,
        favIconUrl,
        url,
        status,
        index,
        connected: true,
        hasChanged: false,
      }
      return acc
    },
    {},
  )
  // set state
  tabIdxInfoStore.clearAndSetTabInfos(tabIdxInfoRecord)
}

// export async function initializeLastFocusTabId() {
//   const lastFocusTabId = await ChromeMainFacadeImpl.getLastFocusTabId()
//   tabComponents.setLastFocusTabId(lastFocusTabId)
//   // if (import.meta.env.MODE === "development")
//   //   console.log("[initializeLastFocusTabId] lastFocusTabId", lastFocusTabId)
// }
