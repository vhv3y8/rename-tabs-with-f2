import {
  getContentScriptUnavailableTabs,
  tabIdxToInfo,
} from "../../../application/tabInfo.svelte"

// unavailable card state
let showUnavailableCard = $state(true)

export function getShowUnavailableCard() {
  return showUnavailableCard
}

export function hideUnavailableCardIfItsVisible() {
  if (showUnavailableCard) {
    showUnavailableCard = false
    return true
  }
  return false
}

const browserBlockedRegexes = [
  /chrome:\/\/.*/i,
  /chrome-extension:\/\/.*/i,
  /https:\/\/chrome.google.com\/webstore\/.*/i,
  /https:\/\/chromewebstore.google.com\/.*/i,
]

function filterUrlsBlockedByBrowser(url) {
  return browserBlockedRegexes.some((filter) => filter.test(url))
}

// classified unavailable tabs
let { browserUnavailableTabs, refreshUnavailableTabs } = $derived.by(() => {
  const browserUnavailableTabs = []
  const refreshUnavailableTabs = []

  for (const info of getContentScriptUnavailableTabs()) {
    if (filterUrlsBlockedByBrowser(info.url)) {
      browserUnavailableTabs.push(info)
    } else {
      refreshUnavailableTabs.push(info)
    }
  }

  return {
    browserUnavailableTabs,
    refreshUnavailableTabs,
  }
})

export function getRefreshAndBrowserUnavailableTabs() {
  return { browserUnavailableTabs, refreshUnavailableTabs }
}

if (import.meta.env.MODE === "development") {
  $effect.root(() => {
    $effect(() => {
      console.log("{ browserUnavailableTabs, refreshUnavailableTabs }", {
        browserUnavailableTabs,
        refreshUnavailableTabs,
      })
    })
  })
}
