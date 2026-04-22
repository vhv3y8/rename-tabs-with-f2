import type {
  ToastItem,
  ToastPublisher,
} from "@main/application/ports/infra/ToastPublisher"

export const TOAST_MESSAGES = {
  SHORTCUT_UPDATED: (shortcutText: string) =>
    chrome.i18n.getMessage("tips_shortcut_updated", shortcutText),
  ERROR: (errorText: string, errorType: string = "") =>
    `${0 < errorType.length ? errorType + " " : ""}Error:\n${errorText}`,
  // load file
  CANCEL_LOAD_FILE: chrome.i18n.getMessage("tips_cancel_load_file"),
}

// type ToastItem = { id: number; text: any; duration: number }
export class Toasts implements ToastPublisher {
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

  publishToast(text: string): number {
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
  getAll() {
    return this.list
  }
}
// export const toasts = new Toasts()
