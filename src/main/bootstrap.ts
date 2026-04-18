// import { createReloadingTabsUpdatedHandler } from "./adapters/ui/tabs/input/chrome"
// import { checkTabConnectionAndUpdateStoreFlags } from "@main/application/usecases/checkAllTabConnection"
// import { ChromeMainFacadeImpl } from "@main/infra/platform/impl/ChromeMainFacade2"
// import { TabIdxInfoRecordStore } from "./adapters/ui/tabs/impl/tabInfoStore.svelte"
// import type { TabInfoStore } from "./application/ports/TabInfoStore"
// import { AppSetting } from "./adapters/ui/setting/states/appSetting.svelte"
// import { initializeTabInfoStore } from "./application/usecases/initializeTabInfoStore"
// import type { SettingStore } from "./application/ports/SettingStore"

import { DOMApplyLifeCycle } from "./adapters/ui/impl/lifecycles/applyLifeCycle"
import { ChromeSvelteReloadLifeCycle } from "./adapters/ui/impl/lifecycles/reloadLifeCycle"
import { TabIdxInfoRecordStore } from "./adapters/ui/impl/tabInfoStore.svelte"
import {
  createClickApplyHandler,
  createKeydownApplyHandler,
} from "./adapters/ui/input/apply"
import {
  createClickReloadUseCaseHandler,
  createKeydownReloadUseCaseHandler,
} from "./adapters/ui/input/reload"
import type { PlatformMainFacade } from "./application/ports/PlatformMainFacade"
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
  createInitializeTabInfoStore,
  type InitializeTabInfoStoreUseCase,
} from "./application/usecases/initializeTabInfoStore"
import {
  createReloadAllConnectableTabs,
  type ReloadAllConnectableTabsUseCase,
  type ReloadLifeCycle,
} from "./application/usecases/reloadAllConnectableTabs"
import { ChromeFacade } from "./infra/platform/impl/ChromeMainFacade"

// await ChromeMainFacadeImpl.focusExtensionPageTabForRefresh()

// // create infra / port implementations
// export const tabIdxInfoStore =
//   new TabIdxInfoRecordStore() satisfies TabInfoStore
// export const notConnected = tabIdxInfoStore.notConnected

// // register adapters
// // chrome.tabs.onUpdated.addListener(createReloadingTabsUpdatedHandler())

// // run initializing use cases (adapter = bootstrap)
// await initializeTabInfoStore()
// await checkTabConnectionAndUpdateStoreFlags()

// if (import.meta.env.MODE === "development") console.log("[onMount]")
// await chromeTabs.focusExtensionPageTabForRefresh()

// // initialize application entities
// await initializeTabIdxToInfo()
// await initializeLastFocusTabId()

// // initialize view from storage
// view.initializeViewFromSettings()

// // update global state
// await checkContentScriptAvailableAndUpdateAllInfo()

// // initialize view
// focusTabItem({ initial: true })

// if (import.meta.env.MODE === "development")
//   console.log("[onMount] [tabIdxToInfo]", Object.values(tabIdxToInfo))

// onDestroy(() => {
//   destroySettingsEffect()
// })

// <svelte:document onkeydown={keydownHandler} onkeyup={keyupHandler} />

export async function runBootstrap() {
  // create infra impl
  const extensionFacade = ChromeFacade satisfies PlatformMainFacade

  // create output adapter impl
  const tabIdxInfoStore = new TabIdxInfoRecordStore() satisfies TabInfoStore
  const notConnected = tabIdxInfoStore.notConnected

  // create use case lifecycle impl
  const applyLifeCycle: ApplyLifeCycle = DOMApplyLifeCycle
  const reloadLifeCycle: ReloadLifeCycle = ChromeSvelteReloadLifeCycle

  // create use cases
  const applyUseCase: ApplyUseCase = createApplyUseCase(
    tabIdxInfoStore,
    extensionFacade,
    applyLifeCycle,
  )
  const checkAllTabConnectionAndUpdateFlagsUseCase: CheckAllTabConnectionUseCase =
    createCheckAllTabConnectionAndUpdateFlags(tabIdxInfoStore, extensionFacade)
  const initializeTabInfoStoreUseCase: InitializeTabInfoStoreUseCase =
    createInitializeTabInfoStore(tabIdxInfoStore, extensionFacade)
  const reloadAllConnectableTabsUseCase: ReloadAllConnectableTabsUseCase =
    createReloadAllConnectableTabs(
      tabIdxInfoStore,
      extensionFacade,
      checkAllTabConnectionAndUpdateFlagsUseCase,
      reloadLifeCycle,
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

  // registering input adapters are delegated to ui components

  // run initializing use cases
  await initializeTabInfoStoreUseCase()
  await checkAllTabConnectionAndUpdateFlagsUseCase()

  // detailed instances to DI into ui components
  return {
    // infra
    // extensionFacade,
    // output adapters
    tabIdxInfoStore,
    notConnected,
    // input adapters
    keydownApplyHandler,
    clickApplyHandler,
    keydownReloadUseCaseHandler,
    clickReloadUseCaseHandler,
  }
}
