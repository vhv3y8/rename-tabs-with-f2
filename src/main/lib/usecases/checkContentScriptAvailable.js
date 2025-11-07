import * as chromeTabs from "../../../lib/chrome/tabs"
import { tabIdxToInfo } from "../domain/tabInfo.svelte"

export async function checkContentScriptAvailableAndUpdateAllInfo() {
  console.log("[checkContentScriptAndUpdateAllInfo]")
  let allTabIds = Object.values(tabIdxToInfo).map(({ id }) => id)

  // check
  let contentScriptAvailableBoolArr = await Promise.allSettled(
    allTabIds.map((id) => chromeTabs.contentScriptIsAvailable({ id })),
  ).then((arr) =>
    arr.map((item) => item.status === "fulfilled" && item.value == true),
  )

  // update info
  contentScriptAvailableBoolArr.forEach((available, idx) => {
    if (!available) {
      tabIdxToInfo[idx]["contentScriptAvailable"] = false
    }
  })
}
