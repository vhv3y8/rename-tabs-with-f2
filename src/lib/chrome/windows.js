/**
 * Service Worker & Extension Page
 */

export async function getCurrentWindowId({ fromServiceWorker = true }) {
  let focusedWindowId = null
  if (fromServiceWorker) {
    const allFocusedWindows = await chrome.windows
      .getAll()
      .then((windows) => windows.filter((window) => window.focused))
    if (0 < allFocusedWindows.length) focusedWindowId = allFocusedWindows[0].id

    if (import.meta.env.MODE === "development")
      console.log("[allFocusedWindows]", allFocusedWindows)
  } else {
    focusedWindowId = await chrome.windows
      .getCurrent()
      .then((window) => window.id)
  }
  return focusedWindowId
}
