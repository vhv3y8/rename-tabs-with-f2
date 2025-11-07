import * as chromeRuntime from "../../../lib/chrome/runtime"
import * as chromeTabs from "../../../lib/chrome/tabs"
import { tabIdxToInfo } from "../domain/tabInfo.svelte"

export async function apply() {
  console.log("[apply]")
  // trigger change event for focused element to apply input changes
  document.activeElement.dispatchEvent(new Event("change", { bubbles: true }))

  await Promise.allSettled(
    Object.values(tabIdxToInfo)
      .filter((tabInfo) => tabInfo.hasChanged && tabInfo.contentScriptAvailable)
      // send changed title to each content script
      .map(({ id, title }) =>
        chromeTabs.fireChangeTitleToContentScript({ id, title }),
      ),
  ).then(console.log)

  // close window after focusing tab
  await chromeRuntime.fireFocusLastActiveTab()
  window.close()
}
