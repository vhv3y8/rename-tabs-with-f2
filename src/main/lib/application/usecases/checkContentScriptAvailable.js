import * as chromeTabs from "$$lib/chrome/tabs"
import { tabIdxToInfo } from "../tabInfo.svelte"

export async function checkContentScriptAvailableAndUpdateAllInfo() {
  let allTabIds = Object.values(tabIdxToInfo).map(({ id }) => id)

  // check
  let contentScriptAvailableBoolArr = await Promise.allSettled(
    allTabIds.map((id) => chromeTabs.contentScriptIsAvailable({ id })),
  ).then((arr) => {
    if (import.meta.env.MODE === "development") {
      console.log(
        "[checkContentScriptAvailableAndUpdateAllInfo]",
        tabIdxToInfo,
        arr,
      )
    }
    return arr.map((item) => item.status === "fulfilled" && item.value == true)
  })

  // update info
  for (const [idx, available] of contentScriptAvailableBoolArr.entries()) {
    if (!available) {
      tabIdxToInfo[idx]["contentScriptAvailable"] = false
    }
  }

  if (import.meta.env.MODE === "development")
    console.log(
      "[checkContentScriptAndUpdateAllInfo]",
      JSON.stringify(tabIdxToInfo, null, 2),
    )
}
