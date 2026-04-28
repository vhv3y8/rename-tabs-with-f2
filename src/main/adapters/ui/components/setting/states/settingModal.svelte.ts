export class SettingModalState {
  show = $state(false)
  // hot key update
  listen = $state(false)
  warnClearTitles = $state(false)
  constructor() {
    $effect.root(() => {
      $effect(() => {
        // cancel listen mode when setting is closed
        if (!this.show) this.listen = false
        if (import.meta.env.MODE === "development")
          console.log("[setting modal show change]", this.show)
      })
      $effect(() => {
        if (!this.show) this.warnClearTitles = false
      })
    })
  }
  // show
  toggleShow() {
    this.show = !this.show
  }
  hide() {
    this.show = false
  }
  hideIfVisible() {
    if (this.show) {
      this.show = false
      return true
    }
    return false
  }
  // listen
  startListening() {
    this.listen = true
  }
  endListening() {
    this.listen = false
  }
  // clear titles
  showClearTitlesWarning() {
    this.warnClearTitles = true
  }
  hideClearTitlesWarning() {
    this.warnClearTitles = false
  }
}
export const settingModal = new SettingModalState()
