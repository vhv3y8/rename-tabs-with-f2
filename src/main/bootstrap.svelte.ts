import { createReloadingTabsUpdatedHandler } from "@adapters/tabs/input/chrome"
import { checkTabConnectionAndUpdateStoreFlags } from "@application/usecases/checkTabConnection"
import { initializeTabInfoStore } from "@application/usecases/initializeTabInfos"
import { ChromeMainFacadeImpl } from "@infra/ChromeMainFacade"

await ChromeMainFacadeImpl.focusExtensionPageTabForRefresh()

// run initializing use cases at bootstrap
await initializeTabInfoStore()
await checkTabConnectionAndUpdateStoreFlags()

// register adapters
chrome.tabs.onUpdated.addListener(createReloadingTabsUpdatedHandler())

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
