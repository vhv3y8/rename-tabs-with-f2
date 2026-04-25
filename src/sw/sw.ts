import ChromeTabs from "@lib/chrome/tabs"
import ChromeWindows from "@lib/chrome/windows"
import { createOnInstalledStorageHandler } from "./adapters/input/onInstalled"
import { createIconClickHandler } from "./adapters/input/action"
import {
  createOpenMainPage,
  type OpenMainPageUseCase,
} from "./application/usecases/openMainPage"
import { createMessageHandler } from "./adapters/input/message"
import type { PlatformSWFacade } from "./application/ports/infra/PlatformSWFacade"
import { ChromeSWFacade } from "./adapters/infra/ChromeSWFacade"
import type { IdCollectionStore } from "./application/ports/IdCollectionStore"
import { IdCollectionStoreImpl } from "./adapters/IdCollectionStoreImpl"
import {
  createCheckAndFocusLastFocusTab,
  type CheckAndFocusLastFocusTabUseCase,
} from "./application/usecases/focusLastFocusTab"

let winIdLastFocusTabIdMap = new Map()
let extensionTabIdSet = new Set()

async function setIdCollectionsAndOpenPage() {
  const currentWindowId = await ChromeWindows.getCurrentWindowId()
  // get last focus tab
  await ChromeTabs.query.getCurrentWindowActiveTab().then((tabs) => {
    // set window id to last focus tab id map
    const lastFocusTabId = tabs[0].id
    winIdLastFocusTabIdMap.set(currentWindowId, lastFocusTabId)
  })

  // open extension main page
  await ChromeTabs.create.openMainPage().then((tab) => {
    // set extension tab id set
    extensionTabIdSet.add(tab.id)
  })

  if (import.meta.env.MODE === "development") {
    console.log(
      "[extension tab id set]",
      Array.from(extensionTabIdSet.entries()),
    )
    console.log(
      "[window id -> last focus tab id map]",
      Object.fromEntries(winIdLastFocusTabIdMap.entries()),
    )
  }
}

// Icon click open

// Message
chrome.runtime.onMessage.addListener(async (msg, sender, sendRes) => {
  switch (msg.cmd) {
    // shortcut open
    case "OPEN": {
      setIdCollectionsAndOpenPage()
      break
    }
    // for ui initial tab
    case "LAST_FOCUS_TAB_ID": {
      sendRes(winIdLastFocusTabIdMap.get(sender.tab?.windowId))
      break
    }
  }
})

// Handle extension page close
chrome.tabs.onRemoved.addListener(async (tabId, { windowId }) => {
  if (extensionTabIdSet.has(tabId) && winIdLastFocusTabIdMap.has(windowId)) {
    // focus last focus tab of the window
    const lastFocusTabId = winIdLastFocusTabIdMap.get(windowId)
    await ChromeTabs.operate.focusTab(lastFocusTabId)

    // remove tab id and window id from collections
    extensionTabIdSet.delete(tabId)
    winIdLastFocusTabIdMap.delete(windowId)

    if (import.meta.env.MODE === "development") {
      console.log(
        "[extension tab id set]",
        Array.from(extensionTabIdSet.entries()),
      )
      console.log(
        "[window id -> last focus tab id map]",
        Object.fromEntries(winIdLastFocusTabIdMap.entries()),
      )
    }
  }
})

// create adapters

const extensionSWFacade: PlatformSWFacade = ChromeSWFacade
const idCollectionStore: IdCollectionStore = new IdCollectionStoreImpl()

// create use cases

const openMainPageUseCase: OpenMainPageUseCase = createOpenMainPage(
  idCollectionStore,
  extensionSWFacade,
)
const checkAndFocusLastFocusTabUseCase: CheckAndFocusLastFocusTabUseCase =
  createCheckAndFocusLastFocusTab(idCollectionStore, extensionSWFacade)

// create input adapters

const onInstalledStorageHandler = createOnInstalledStorageHandler()
const iconClickHandler = createIconClickHandler(openMainPageUseCase)
const messageHandler = createMessageHandler(openMainPageUseCase)

// register input adapters

chrome.runtime.onInstalled.addListener(onInstalledStorageHandler)
chrome.action.onClicked.addListener(iconClickHandler)
chrome.runtime.onMessage.addListener(messageHandler)
