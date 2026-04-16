import { settingState } from "./settings/states/settings.svelte"

export function initializeViewFromSettings() {
  if (import.meta.env.MODE === "development")
    console.log("[initializeViewFromSettings]")

  applyDarkModeUI({ darkmode: settingState.settings.darkmode })
  applyLargerWidth({ largerWidth: settingState.settings.largerWidth })
}

// darkmode
export function applyDarkModeUI({ darkmode }: { darkmode: boolean }) {
  if (darkmode) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

// larger width
export function applyLargerWidth({ largerWidth }: { largerWidth: boolean }) {
  if (largerWidth) {
    document.querySelector("main")!.classList.add("large")
  } else {
    document.querySelector("main")!.classList.remove("large")
  }
}
