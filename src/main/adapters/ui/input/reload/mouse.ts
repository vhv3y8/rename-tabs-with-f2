import { fireReload } from "../states/reload.svelte"

export async function clickReloadUseCaseHandler(e: MouseEvent) {
  await fireReload()
}
