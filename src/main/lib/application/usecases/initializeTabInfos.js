import * as chromeRuntime from "$$lib/chrome/runtime"
import * as chromeTabs from "$$lib/chrome/tabs"
import { resetTabIdxToInfo, setLastFocusTabId } from "../tabInfo.svelte"

export async function initializeTabIdxToInfo() {
  // get tabs
  const tabsWithoutExtension =
    await chromeTabs.getAllCurrentWindowTabsWithoutExtensionPage()

  // reduce to appropriate format
  const reduced = tabsWithoutExtension.reduce(
    (acc, { id, title, favIconUrl, url, index, status }) => {
      // key have to be index. index is tab's position on current window tabs array
      acc[index] = {
        id,
        title,
        favIconUrl,
        url,
        status,
        index,
        hasChanged: false,
        contentScriptAvailable: true,
      }
      return acc
    },
    {},
  )

  // set state
  resetTabIdxToInfo(reduced)
}

export async function initializeLastFocusTabId() {
  // get id and set state
  const lastFocusTabId = await chromeRuntime.getLastFocusTabId()
  setLastFocusTabId(lastFocusTabId)
  if (import.meta.env.MODE === "development")
    console.log("[initializeLastFocusTabId] lastFocusTabId", lastFocusTabId)
}
