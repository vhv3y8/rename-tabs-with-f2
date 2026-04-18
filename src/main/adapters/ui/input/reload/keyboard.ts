import { notConnected } from "@main/bootstrap"
import { notConnectedCard } from "../states/notConnected.svelte"
import { fireReload } from "../states/reload.svelte"

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
