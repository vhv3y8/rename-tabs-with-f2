// import { createReloadingTabsUpdatedHandler } from "./adapters/ui/tabs/input/chrome"
// import { checkTabConnectionAndUpdateStoreFlags } from "@main/application/usecases/checkAllTabConnection"
// import { ChromeMainFacadeImpl } from "@main/infra/platform/impl/ChromeMainFacade2"
// import { TabIdxInfoRecordStore } from "./adapters/ui/tabs/impl/tabInfoStore.svelte"
// import type { TabInfoStore } from "./application/ports/TabInfoStore"
// import { AppSetting } from "./adapters/ui/setting/states/appSetting.svelte"
// import { initializeTabInfoStore } from "./application/usecases/initializeTabInfoStore"
// import type { SettingStore } from "./application/ports/SettingStore"

import { TabIdxInfoRecordStore } from "./adapters/ui/impl/tabInfoStore.svelte"
import type { TabInfoStore } from "./application/ports/TabInfoStore"

await ChromeMainFacadeImpl.focusExtensionPageTabForRefresh()

// create infra / port implementations
export const tabIdxInfoStore =
  new TabIdxInfoRecordStore() satisfies TabInfoStore
export const notConnected = tabIdxInfoStore.notConnected

// register adapters
// chrome.tabs.onUpdated.addListener(createReloadingTabsUpdatedHandler())

// run initializing use cases (adapter = bootstrap)
await initializeTabInfoStore()
await checkTabConnectionAndUpdateStoreFlags()

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
