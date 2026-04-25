import type { PlatformSWFacade } from "../../ports/infra/PlatformSWFacade"
import type { OpenMainPageUseCase } from "../openMainPage"

export type InitializeStorageUseCase = ReturnType<
  typeof createInitializeStorage
>

export function createInitializeStorage(
  extensionFacade: PlatformSWFacade,
  openMainPageUseCase: OpenMainPageUseCase,
) {
  return async function initializeStorage() {
    await extensionFacade.initializeStorage()
    await openMainPageUseCase()
  }
}
