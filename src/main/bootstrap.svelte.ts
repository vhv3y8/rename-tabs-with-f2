if (import.meta.env.MODE === "development") console.log("[onMount]")
await chromeTabs.focusExtensionPageTabForRefresh()

// initialize application entities
await initializeTabIdxToInfo()
await initializeLastFocusTabId()

// initialize view from storage
view.initializeViewFromSettings()

// update global state
await checkContentScriptAvailableAndUpdateAllInfo()

// initialize view
focusTabItem({ initial: true })

if (import.meta.env.MODE === "development")
  console.log("[onMount] [tabIdxToInfo]", Object.values(tabIdxToInfo))

onDestroy(() => {
  destroySettingsEffect()
})

<svelte:document onkeydown={keydownHandler} onkeyup={keyupHandler} />