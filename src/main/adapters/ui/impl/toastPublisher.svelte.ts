import type {
  ToastItem,
  ToastPublisher,
} from "@main/application/ports/infra/ToastPublisher"

export const TOAST_MESSAGES = {
  SHORTCUT_UPDATED: (shortcutText: string) =>
    chrome.i18n.getMessage("toast_hotkey_updated", shortcutText),
  ERROR: (errorText: string, errorType: string = "") =>
    `${0 < errorType.length ? errorType + " " : ""}Error:\n${errorText}`,
  // load file
  UPLOAD_FILE_CANCEL: chrome.i18n.getMessage("toast_upload_titles_file_cancel"),
  UPLOAD_FILE_SUCCESS: chrome.i18n.getMessage(
    "toast_upload_titles_file_success",
  ),
  UPLOAD_INAPPROPRIATE_FORMAT: chrome.i18n.getMessage(
    "toast_upload_titles_file_inappropriate_format",
  ),
  PERSIST_APPLY_ON: chrome.i18n.getMessage("toast_persist_apply_on"),
  PERSIST_APPLY_OFF: chrome.i18n.getMessage(
    "toast_persist_apply_off_data_remains",
  ),
}

// interface ToastItemImpl extends ToastItem {
//   duration: number
// }
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

  publishToast(content: string, duration?: number): number {
    const toastId = this.nextId
    console.log("[appending toast]", "[given duration]", duration, {
      id: toastId,
      content,
      duration: duration || this.DURATION,
    })

    this.list.unshift({
      id: toastId,
      content,
      duration: duration || this.DURATION,
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
