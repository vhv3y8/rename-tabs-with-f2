/// <reference types="chrome" />

// type CompactPick<T, K extends keyof T> = {
//   [P in K]: NonNullable<T[P]>
// }

export interface TabInfo
  extends Pick<
    chrome.tabs.Tab,
    "id" | "title" | "favIconUrl" | "url" | "status" | "index"
  > {
  connected: boolean
}
