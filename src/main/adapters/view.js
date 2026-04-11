import { settings } from "./states/settings.svelte"

export function initializeViewFromSettings() {
  if (import.meta.env.MODE === "development")
    console.log("[initializeViewFromSettings]")

  applyDarkModeUI({ darkmode: settings.darkmode })
  applyLargerWidth({ largerWidth: settings.largerWidth })
}

// darkmode
export function applyDarkModeUI({ darkmode }) {
  if (darkmode) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

// larger width
export function applyLargerWidth({ largerWidth }) {
  if (largerWidth) {
    document.querySelector("main").classList.add("large")
  } else {
    document.querySelector("main").classList.remove("large")
  }
}
