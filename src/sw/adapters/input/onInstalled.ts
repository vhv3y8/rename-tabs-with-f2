import { ChromeSWFacade } from "../infra/ChromeSWFacade"

export function createOnInstalledStorageHandler(): Parameters<
  typeof chrome.runtime.onInstalled.addListener
>[0] {
  return function onInstalledStorageHandler({ reason, previousVersion }) {
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
