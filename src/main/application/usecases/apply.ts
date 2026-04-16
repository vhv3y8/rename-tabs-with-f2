import { tabIdxInfoStore } from "@adapters/tabs/impl/tabInfo.svelte"
import { ChromeMainFacadeImpl } from "../../infra/chrome/ChromeMainFacade"

export async function apply() {
  if (import.meta.env.MODE === "development") console.log("[apply]")
  // trigger change event for focused element to apply input changes
  document.activeElement!.dispatchEvent(new Event("change", { bubbles: true }))

  await Promise.allSettled(
    tabIdxInfoStore
      .getTabInfosToApply()
      // send changed title to each content script
      .map(({ id, title }) =>
        ChromeMainFacadeImpl.fireChangeTitleToContentScript({
          // why this can be null/undefined??
          id: id!,
          title: title!,
        }),
      ),
  )

  // close window after focusing tab
  window.close()
}
