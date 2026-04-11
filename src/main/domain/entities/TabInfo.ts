/// <reference types="chrome" />

export interface TabInfo
  extends Pick<
    chrome.tabs.Tab,
    "id" | "title" | "favIconUrl" | "url" | "status" | "index"
  > {
  hasChanged: boolean
  contentScriptAvailable: boolean
}
