import type { CheckAllTabConnectionUseCase } from "./checkAllTabConnection"
import type { InitializeTabInfoStoreUseCase } from "./initializeTabInfoStore"

export interface InitializeAppLifeCycle {
  afterStoreInitialized?(): Promise<void>
}
export type InitializeAppUseCase = ReturnType<typeof createInitializeAppUseCase>

export function createInitializeAppUseCase(
  initializeTabInfoStoreUseCase: InitializeTabInfoStoreUseCase,
  checkAllTabConnectionAndUpdateFlagsUseCase: CheckAllTabConnectionUseCase,
  lifeCycle: InitializeAppLifeCycle,
) {
  return async function initializeApp() {
    console.log("[initializing app]")
    await initializeTabInfoStoreUseCase()
    await checkAllTabConnectionAndUpdateFlagsUseCase()

    lifeCycle.afterStoreInitialized?.()
  }
}
