export const TOAST_MESSAGES = {
  SHORTCUT_UPDATED: (shortcutText: string) =>
    chrome.i18n.getMessage("tips_shortcut_updated", shortcutText),
  ERROR: (errorText: string, errorType: string = "") =>
    `${errorType ? errorType + " " : ""}Error:\n${errorText}`,
}

type ToastItem = { id: number; text: any; duration: number }
export class Toasts {
  list: ToastItem[] = $state([])
  private timers: Map<number, ReturnType<typeof setTimeout>> = new Map()
  private nextId = 1
  constructor(private DURATION = 10000) {
    // $effect.root(() => {
    //   $effect(() => {
    //     // console.log("[Toasts.list update]", this.list)
    //   })
    // })
  }

  appendToast(text: string): number {
    const toastId = this.nextId
    console.log("[appending toast]", {
      id: toastId,
      text,
      duration: this.DURATION,
    })

    this.list.unshift({
      id: toastId,
      text,
      duration: this.DURATION,
    })
    // add timer
    if (!this.timers.has(toastId)) {
      const timer = setTimeout(() => this.removeToast(toastId), this.DURATION)
      this.timers.set(toastId, timer)
    }
    this.nextId += 1
    return toastId
  }
  removeToast(id: number) {
    const idx = this.list.findIndex((item) => item.id === id)
    if (-1 < idx) {
      this.list.splice(idx, 1)
      // remove timer if exists
      if (this.timers.has(id)) {
        const timer = this.timers.get(id)
        clearTimeout(timer)
        this.timers.delete(id)
      }
    }
  }
}
export const toasts = new Toasts()
