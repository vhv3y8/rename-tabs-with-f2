import { InMemorySetting } from "./adapters/ui/components/setting/states/inMemorySetting.svelte"
import { DOMApplyLifeCycle } from "./adapters/ui/impl/lifecycles/applyLifeCycle"
import { createInitializeAppLifeCycle } from "./adapters/ui/impl/lifecycles/initializeAppLifeCycle"
import { createChromeSvelteReloadLifeCycle } from "./adapters/ui/impl/lifecycles/reloadLifeCycle"
import { TabIdxInfoRecordStore } from "./adapters/ui/impl/tabInfoStore.svelte"
import {
  createClickApplyHandler,
  createKeydownApplyHandler,
} from "./adapters/ui/input/apply"
import {
  createClickReloadUseCaseHandler,
  createKeydownReloadUseCaseHandler,
} from "./adapters/ui/input/reload"
import type { PlatformMainFacade } from "./application/ports/infra/PlatformMainFacade"
import type { TabInfoStore } from "./application/ports/TabInfoStore"
import {
  createApplyUseCase,
  type ApplyLifeCycle,
  type ApplyUseCase,
} from "./application/usecases/apply"
import {
  createCheckAllTabConnectionAndUpdateFlags,
  type CheckAllTabConnectionUseCase,
} from "./application/usecases/checkAllTabConnection"
import {
  createInitializeAppUseCase,
  type InitializeAppLifeCycle,
  type InitializeAppUseCase,
} from "./application/usecases/initialize/initializeApp"
import {
  createInitializeTabInfoStore,
  type InitializeTabInfoStoreUseCase,
} from "./application/usecases/initialize/initializeTabInfoStore"
import {
  createReloadAllConnectableTabs,
  type ReloadAllConnectableTabsUseCase,
  type ReloadLifeCycle,
} from "./application/usecases/reloadAllConnectableTabs"
import { ChromeFacade } from "./infra/platform/impl/ChromeMainFacade"

export async function runBootstrap() {
  // create infra impl
  const extensionFacade = ChromeFacade satisfies PlatformMainFacade

  // create output adapter impl
  const tabIdxInfoStore = new TabIdxInfoRecordStore() satisfies TabInfoStore
  const notConnected = tabIdxInfoStore.notConnected
  // adapter only impl?
  const inMemorySetting = await InMemorySetting.build(extensionFacade)

  // create lifecycle impl and use cases
  const applyLifeCycle: ApplyLifeCycle = DOMApplyLifeCycle
  const applyUseCase: ApplyUseCase = createApplyUseCase(
    tabIdxInfoStore,
    extensionFacade,
    applyLifeCycle,
  )

  const checkAllTabConnectionAndUpdateFlagsUseCase: CheckAllTabConnectionUseCase =
    createCheckAllTabConnectionAndUpdateFlags(tabIdxInfoStore, extensionFacade)
  const initializeTabInfoStoreUseCase: InitializeTabInfoStoreUseCase =
    createInitializeTabInfoStore(tabIdxInfoStore, extensionFacade)

  const reloadLifeCycle: ReloadLifeCycle = createChromeSvelteReloadLifeCycle(
    tabIdxInfoStore,
    checkAllTabConnectionAndUpdateFlagsUseCase,
  )
  const reloadAllConnectableTabsUseCase: ReloadAllConnectableTabsUseCase =
    createReloadAllConnectableTabs(
      tabIdxInfoStore,
      extensionFacade,
      checkAllTabConnectionAndUpdateFlagsUseCase,
      reloadLifeCycle,
    )

  const initializeAppLifeCycle: InitializeAppLifeCycle =
    createInitializeAppLifeCycle(extensionFacade)
  const initializeAppUseCase: InitializeAppUseCase = createInitializeAppUseCase(
    initializeTabInfoStoreUseCase,
    checkAllTabConnectionAndUpdateFlagsUseCase,
    initializeAppLifeCycle,
  )

  // create input adapters
  // apply
  const keydownApplyHandler = createKeydownApplyHandler(applyUseCase)
  const clickApplyHandler = createClickApplyHandler(applyUseCase)
  // reload
  const keydownReloadUseCaseHandler = createKeydownReloadUseCaseHandler(
    reloadAllConnectableTabsUseCase,
    notConnected,
  )
  const clickReloadUseCaseHandler = createClickReloadUseCaseHandler(
    reloadAllConnectableTabsUseCase,
  )

  // registering input adapters are delegated to svelte components

  // run initializing use cases
  await initializeAppUseCase()

  // detailed instances to DI into ui components
  return {
    // output adapters
    tabIdxInfoStore,
    notConnected,
    setting: inMemorySetting.setting,
    // input adapters
    keydownApplyHandler,
    clickApplyHandler,
    keydownReloadUseCaseHandler,
    clickReloadUseCaseHandler,
  }
}
