import { tabIdxInfoStore } from "@adapters/tabs/impl/tabInfo.svelte"
import { ChromeMainFacadeImpl } from "../../infra/chrome/ChromeMainFacade"

export async function checkContentScriptAvailableAndUpdateAllInfo() {
  let allTabIds = tabIdxInfoStore.getAllTabIds()

  // check
  let tabConnectedFlags = await Promise.allSettled(
    allTabIds.map((id) =>
      ChromeMainFacadeImpl.isContentScriptConnected({ id }),
    ),
  ).then((arr) =>
    arr.map((item) => item.status === "fulfilled" && item.value == true),
  )

  // update info
  for (const [idx, isConnected] of tabConnectedFlags.entries()) {
    tabIdxInfoStore.setConnectedFlag(idx, isConnected)
  }

  if (import.meta.env.MODE === "development")
    console.log(
      "[checkContentScriptAvailableAndUpdateAllInfo] tabIdxToInfo",
      JSON.stringify(
        tabIdxInfoStore.getAllTabInfos().map(({ id, title, connected }) => ({
          id,
          title,
          connected,
        })),
        null,
        2,
      ),
    )
}
