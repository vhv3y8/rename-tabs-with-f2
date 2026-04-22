import type { CheckAllTabConnectionUseCase } from "../checkAllTabConnection"
import type { InitializeTabInfoStoreUseCase } from "./initializeTabInfoStore"
import type { InitializeURLTitleCollectionStoreUseCase } from "./initializeURLTitleCollectionStore"

export interface InitializeAppLifeCycle {
  afterStoresInitialized?(): Promise<void>
}
export type InitializeAppUseCase = ReturnType<typeof createInitializeAppUseCase>

export function createInitializeAppUseCase(
  initializeURLTitleCollectionStoreUseCase: InitializeURLTitleCollectionStoreUseCase,
  initializeTabInfoStoreUseCase: InitializeTabInfoStoreUseCase,
  checkAllTabConnectionAndUpdateFlagsUseCase: CheckAllTabConnectionUseCase,
  lifeCycle: InitializeAppLifeCycle,
) {
  return async function initializeApp() {
    console.log("[initializing app]")
    await initializeURLTitleCollectionStoreUseCase()

    await initializeTabInfoStoreUseCase()
    await checkAllTabConnectionAndUpdateFlagsUseCase()

    lifeCycle.afterStoresInitialized?.()
  }
}
