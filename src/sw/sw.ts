import { createOnInstalledStorageHandler } from "./adapters/input/onInstalled"
import { createIconClickHandler } from "./adapters/input/action"
import {
  createOpenMainPage,
  type OpenMainPageUseCase,
} from "./application/usecases/openMainPage"
import { createMessageHandler } from "./adapters/input/message"
import type { PlatformSWFacade } from "./application/ports/infra/PlatformSWFacade"
import type { IdCollectionStore } from "./application/ports/IdCollectionStore"
import {
  createFocusLastFocusTab,
  type FocusLastFocusTabUseCase,
} from "./application/usecases/focusLastFocusTab"
import { IdCollectionSessionStore } from "./adapters/impl/session/IdCollectionSessionStore"
import type { SettingStore } from "./application/ports/SettingStore"
import { SettingLocalStore } from "./adapters/impl/local/SettingLocalStore"
import type { URLTitleCollectionSWStore } from "./application/ports/URLTitleCollectionSWStore"
import { URLTitleRecordLocalStore } from "./adapters/impl/local/URLTitleRecordLocalStore"
import type { TitleApplyingStore } from "./application/ports/TitleApplyingStore"
import { TitleApplyingSessionStore } from "./adapters/impl/session/TitleApplyingSessionStore"
import {
  createCheckAndApplyTitle,
  type CheckAndApplyTitleUseCase,
} from "./application/usecases/checkAndApplyTitle"
import {
  createSaveOriginalTitleBeforeApply,
  type SaveOriginalTitleBeforeApplyUseCase,
} from "./application/usecases/saveOriginalTitleBeforeApply"
import {
  createSendLastFocusTabId,
  type SendLastFocusTabIdUseCase,
} from "./application/usecases/send/sendLastFocusTabId"
import {
  createSendOriginalTitles,
  type SendOriginalTitlesUseCase,
} from "./application/usecases/send/sendOriginalTitles"
import {
  createUpdateInMemorySetting,
  type UpdateInMemorySettingUseCase,
} from "./application/usecases/receive/updateInMemorySetting"
import {
  createUpdateInMemoryUrlTitleCollection,
  type UpdateInMemoryUrlTitleCollectionUseCase,
} from "./application/usecases/receive/updateInMemoryURLTitle"
import {
  createInitializeStorage,
  type InitializeStorageUseCase,
} from "./application/usecases/storage/initializeStorage"
import {
  createMigrateStorage,
  type MigrateStorageUseCase,
} from "./application/usecases/storage/migrateStorage"
import {
  createTabsOnRemovedHandler,
  createTabsOnUpdatedHandler,
} from "./adapters/input/tabs"
import { ChromeSWFacade } from "./infra/ChromeSWFacade"

// let winIdLastFocusTabIdMap = new Map()
// let extensionTabIdSet = new Set()

// async function setIdCollectionsAndOpenPage() {
//   const currentWindowId = await ChromeWindows.getCurrentWindowId()
//   // get last focus tab
//   await ChromeTabs.query.getCurrentWindowActiveTab().then((tabs) => {
//     // set window id to last focus tab id map
//     const lastFocusTabId = tabs[0].id
//     winIdLastFocusTabIdMap.set(currentWindowId, lastFocusTabId)
//   })

//   // open extension main page
//   await ChromeTabs.create.openMainPage().then((tab) => {
//     // set extension tab id set
//     extensionTabIdSet.add(tab.id)
//   })

//   if (import.meta.env.MODE === "development") {
//     console.log(
//       "[extension tab id set]",
//       Array.from(extensionTabIdSet.entries()),
//     )
//     console.log(
//       "[window id -> last focus tab id map]",
//       Object.fromEntries(winIdLastFocusTabIdMap.entries()),
//     )
//   }
// }

// // Icon click open

// // Message
// chrome.runtime.onMessage.addListener(async (msg, sender, sendRes) => {
//   switch (msg.cmd) {
//     // shortcut open
//     case "OPEN": {
//       setIdCollectionsAndOpenPage()
//       break
//     }
//     // for ui initial tab
//     case "LAST_FOCUS_TAB_ID": {
//       sendRes(winIdLastFocusTabIdMap.get(sender.tab?.windowId))
//       break
//     }
//   }
// })

// // Handle extension page close
// chrome.tabs.onRemoved.addListener(async (tabId, { windowId }) => {
//   if (extensionTabIdSet.has(tabId) && winIdLastFocusTabIdMap.has(windowId)) {
//     // focus last focus tab of the window
//     const lastFocusTabId = winIdLastFocusTabIdMap.get(windowId)
//     await ChromeTabs.operate.focusTab(lastFocusTabId)

//     // remove tab id and window id from collections
//     extensionTabIdSet.delete(tabId)
//     winIdLastFocusTabIdMap.delete(windowId)

//     if (import.meta.env.MODE === "development") {
//       console.log(
//         "[extension tab id set]",
//         Array.from(extensionTabIdSet.entries()),
//       )
//       console.log(
//         "[window id -> last focus tab id map]",
//         Object.fromEntries(winIdLastFocusTabIdMap.entries()),
//       )
//     }
//   }
// })

// use this promise to inject
let bootstrapInstancesPromise: ReturnType<
  typeof bootstrapInstancesAsynchronously
>

// this is needed because service worker cannot have top level await
// and listeners should be registered right away synchronously when this file runs
export async function bootstrapInstancesAsynchronously() {
  // create adapters

  // infra
  const extensionSWFacade: PlatformSWFacade = ChromeSWFacade

  // local storage
  const settingStore: SettingStore =
    await SettingLocalStore.build(extensionSWFacade)
  const urlTitleCollectionSWStore: URLTitleCollectionSWStore =
    await URLTitleRecordLocalStore.build(extensionSWFacade)

  // session storage
  const idCollectionStore: IdCollectionStore =
    await IdCollectionSessionStore.build(extensionSWFacade)
  const titleApplyingStore: TitleApplyingStore =
    await TitleApplyingSessionStore.build(extensionSWFacade)

  // create use cases

  const openMainPageUseCase: OpenMainPageUseCase = createOpenMainPage(
    idCollectionStore,
    extensionSWFacade,
  )
  const focusLastFocusTabUseCase: FocusLastFocusTabUseCase =
    createFocusLastFocusTab(idCollectionStore, extensionSWFacade)

  // storage
  const initializeStorageUseCase: InitializeStorageUseCase =
    createInitializeStorage(extensionSWFacade, openMainPageUseCase)
  const migrateStorageUseCase: MigrateStorageUseCase =
    createMigrateStorage(extensionSWFacade)

  // apply
  const saveOriginalTitleBeforeApplyUseCase: SaveOriginalTitleBeforeApplyUseCase =
    createSaveOriginalTitleBeforeApply(titleApplyingStore)
  const checkAndApplyTitleUseCase: CheckAndApplyTitleUseCase =
    createCheckAndApplyTitle(
      extensionSWFacade,
      settingStore,
      urlTitleCollectionSWStore,
      saveOriginalTitleBeforeApplyUseCase,
    )

  // send
  const sendLastFocusTabIdUseCase: SendLastFocusTabIdUseCase =
    createSendLastFocusTabId(idCollectionStore)
  const sendOriginalTitlesUseCase: SendOriginalTitlesUseCase =
    createSendOriginalTitles(titleApplyingStore)

  // receive
  const updateInMemorySettingUseCase: UpdateInMemorySettingUseCase =
    createUpdateInMemorySetting(settingStore)
  const updateInMemoryUrlTitleCollectionUseCase: UpdateInMemoryUrlTitleCollectionUseCase =
    createUpdateInMemoryUrlTitleCollection(urlTitleCollectionSWStore)

  // return instances needed from input adapters
  return {
    // adapters
    // use cases
    openMainPageUseCase,
    focusLastFocusTabUseCase,
    // storage
    initializeStorageUseCase,
    migrateStorageUseCase,
    // apply
    saveOriginalTitleBeforeApplyUseCase,
    checkAndApplyTitleUseCase,
    // send
    sendLastFocusTabIdUseCase,
    sendOriginalTitlesUseCase,
    // receive
    updateInMemorySettingUseCase,
    updateInMemoryUrlTitleCollectionUseCase,
  }
}

// fire and forget
bootstrapInstancesPromise = bootstrapInstancesAsynchronously()

// create input adapters

// on installed
const onInstalledStorageHandler = createOnInstalledStorageHandler(
  bootstrapInstancesPromise,
)
// message
const messageHandler = createMessageHandler(bootstrapInstancesPromise)
// tabs
const tabRemovedHandler = createTabsOnRemovedHandler(bootstrapInstancesPromise)
const tabUpdatedHandler = createTabsOnUpdatedHandler(bootstrapInstancesPromise)
// action
const iconClickHandler = createIconClickHandler(bootstrapInstancesPromise)

// register input adapters

// on installed
chrome.runtime.onInstalled.addListener(onInstalledStorageHandler)
// message
chrome.runtime.onMessage.addListener(messageHandler)
// tabs
chrome.tabs.onUpdated.addListener(tabUpdatedHandler)
chrome.tabs.onRemoved.addListener(tabRemovedHandler)
// action
chrome.action.onClicked.addListener(iconClickHandler)
