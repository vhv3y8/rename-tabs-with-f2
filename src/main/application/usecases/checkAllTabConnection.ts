import { tabIdxInfoStore } from "@main/bootstrap.svelte"
import { ChromeMainFacadeImpl } from "../../infra/platform/impl/ChromeMainFacade2"

export async function checkAllTabConnectionAndUpdateFlags() {
  let allTabIds = tabIdxInfoStore.getAllTabIds()

  // check
  let tabConnectedFlags = await Promise.allSettled(
    allTabIds.map((id) =>
      ChromeMainFacadeImpl.checkContentScriptConnection({ id }),
    ),
  ).then((arr) =>
    // TODO: fix
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
