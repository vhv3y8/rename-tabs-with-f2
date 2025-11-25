import * as chromeTabs from "$$lib/chrome/tabs"
import { tabIdxToInfo } from "../tabInfo.svelte"

export async function checkContentScriptAvailableAndUpdateAllInfo() {
  if (import.meta.env.MODE === "development")
    console.log("[checkContentScriptAndUpdateAllInfo]")

  let allTabIds = Object.values(tabIdxToInfo).map(({ id }) => id)

  // check
  let contentScriptAvailableBoolArr = await Promise.allSettled(
    allTabIds.map((id) => chromeTabs.contentScriptIsAvailable({ id })),
  ).then((arr) =>
    arr.map((item) => item.status === "fulfilled" && item.value == true),
  )

  // update info
  for (const [idx, available] of contentScriptAvailableBoolArr.entries()) {
    if (!available) {
      tabIdxToInfo[idx]["contentScriptAvailable"] = false
    }
  }
}
