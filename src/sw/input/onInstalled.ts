import { ChromeSWFacade } from "../adapters/ChromeSWFacade"

export function createOnInstalledHandler(): Parameters<
  typeof chrome.runtime.onInstalled.addListener
>[0] {
  return function onInstalledHandler({ reason, previousVersion }) {
    if (reason === "install") {
      console.log("[installed]")
      ChromeSWFacade.initializeStorage().then(() => {
        ChromeSWFacade.openMainPage()
      })
    } else if (reason === "update") {
      console.log(
        "[updated] [previous version]",
        previousVersion,
        typeof previousVersion,
      )
      ChromeSWFacade.migrateStorage(
        // maybe | "1.0.0" ?
        previousVersion!,
      )
    }
  }
}
