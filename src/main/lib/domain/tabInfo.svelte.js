import * as chromeRuntime from "../../../lib/chrome/runtime"
import * as chromeTabs from "../../../lib/chrome/tabs"

export let lastFocusTabId = await chromeRuntime.getLastFocusTabId()

// Tab Info

export let tabIdxToInfo = $state(
  await chromeTabs
    .getAllCurrentWindowTabsWithoutExtensionPage()
    .then(async (tabs) => {
      console.log("query", tabs)
      // key have to be index. index is tabs' position on current window tabs array
      return tabs.reduce((acc, { id, title, favIconUrl, index }) => {
        acc[index] = {
          id,
          title,
          favIconUrl,
          hasChanged: false,
          contentScriptAvailable: true,
        }
        return acc
      }, {})
    }),
)

export function getTabInfoById(tabId) {
  let filtered = Object.values(tabIdxToInfo).filter(
    ({ id }) => id === Number(tabId),
  )
  return filtered.length === 0 ? null : filtered[0]
}
