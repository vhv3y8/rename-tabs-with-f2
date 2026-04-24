import { ChromeSWFacade } from "../adapters/ChromeSWFacade"

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

export function createOpenExtensionMainPage() {
  return function openExtensionMainPage() {
    //
    ChromeSWFacade.openMainPage()
  }
}
