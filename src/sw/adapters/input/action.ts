import type { OpenMainPageUseCase } from "../../application/usecases/openMainPage"

export function createIconClickHandler(
  bootstrapPromise: Promise<{ openMainPageUseCase: OpenMainPageUseCase }>,
): Parameters<typeof chrome.action.onClicked.addListener>[0] {
  return async function iconClickHandler() {
    const { openMainPageUseCase } = await bootstrapPromise
    openMainPageUseCase()
  }
}
