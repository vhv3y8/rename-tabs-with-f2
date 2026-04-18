import { notConnected } from "@main/bootstrap.svelte"
import { notConnectedCard } from "../components/tabs/states/notConnected.svelte"
import { fireReload } from "../components/tabs/states/reload.svelte"

export async function keydownReloadUseCaseHandler(e: KeyboardEvent) {
  if (
    e.code === "KeyR" &&
    e.shiftKey &&
    notConnectedCard.show &&
    0 < notConnected.reloadConnectableTabs.length
  ) {
    e.preventDefault()
    await fireReload()
  }
}

export async function clickReloadUseCaseHandler(e: MouseEvent) {
  await fireReload()
}
