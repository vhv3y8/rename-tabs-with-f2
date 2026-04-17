import { createReloadingTabsUpdatedHandler } from "./adapters/ui/tabs/input/chrome"
import { checkTabConnectionAndUpdateStoreFlags } from "@application/usecases/checkTabConnection"
import { ChromeMainFacadeImpl } from "@infra/ChromeMainFacade"
import { TabIdxInfoRecordStore } from "./adapters/ui/tabs/impl/tabInfoStore.svelte"
import type { TabInfoStore } from "./application/ports/TabInfoStore"
import { AppSetting } from "./adapters/ui/setting/impl/appSetting.svelte"
import { initializeTabInfoStore } from "./application/usecases/initializeTabInfoStore"
import type { SettingStore } from "./application/ports/SettingStore"

await ChromeMainFacadeImpl.focusExtensionPageTabForRefresh()

// create port adapter instances
export const tabIdxInfoStore =
  new TabIdxInfoRecordStore() satisfies TabInfoStore
export const notConnected = tabIdxInfoStore.notConnected
export const app: SettingStore = await AppSetting.build()

// register adapters
chrome.tabs.onUpdated.addListener(createReloadingTabsUpdatedHandler())

// run initializing use cases at bootstrap
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
