export class SettingModalState {
  show = $state(false)
  // hot key update
  listen = $state(false)
  constructor() {
    $effect.root(() => {
      $effect(() => {
        // cancel listen mode when setting is closed
        if (!this.show) this.listen = false
        console.log("[setting modal show change]", this.show)
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
}
export const settingModal = new SettingModalState()
