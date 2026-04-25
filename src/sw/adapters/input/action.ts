import type { OpenMainPageUseCase } from "../../application/usecases/openMainPage"

export function createIconClickHandler(
  openMainPageUseCase: OpenMainPageUseCase,
): Parameters<typeof chrome.action.onClicked.addListener>[0] {
  return function iconClickHandler() {
    openMainPageUseCase()
  }
}
