import {
  notConnectedCard,
  type NotConnectedTabInfoLists,
} from "../components/tabs/states/notConnected.svelte"
import type { ReloadAllConnectableTabsUseCase } from "@main/application/usecases/reloadAllConnectableTabs"

export function createKeydownReloadUseCaseHandler(
  reloadAllConnectableTabs: ReloadAllConnectableTabsUseCase,
  // is this ok?
  notConnected: NotConnectedTabInfoLists,
) {
  return async function keydownReloadUseCaseHandler(e: KeyboardEvent) {
    if (
      e.code === "KeyR" &&
      e.shiftKey &&
      notConnectedCard.show &&
      0 < notConnected.reloadConnectableTabs.length
    ) {
      e.preventDefault()
      console.log("[keydown reload handler]")
      await reloadAllConnectableTabs()
    }
  }
}

export function createClickReloadUseCaseHandler(
  reloadAllConnectableTabs: ReloadAllConnectableTabsUseCase,
) {
  return async function clickReloadUseCaseHandler(e: MouseEvent) {
    console.log("[click reload handler]")
    await reloadAllConnectableTabs()
  }
}
