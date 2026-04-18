import type { PlatformMainFacade } from "@main/application/ports/PlatformMainFacade"
import type { ReloadLifeCycle } from "@main/application/usecases/reloadAllConnectableTabs"

export const ChromeSvelteReloadLifeCycle: ReloadLifeCycle = {
  beforeStart() {},
  waitForReloadingEnd(options: { timeLimit: number; wait: number }) {},
  afterFinish() {},
}

// export function createReloadLifeCycleImpl(
//   extensionFacade: PlatformMainFacade,
// ): ReloadLifeCycle {
//   const ReloadLifeCycleImpl: ReloadLifeCycle = {
//     beforeStart() {},
//     waitForReloadingEnd(options: { timeLimit: number; wait: number }) {},
//     afterFinish() {},
//   }
//   return ReloadLifeCycleImpl
// }
