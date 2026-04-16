type ToastItem = { id: number; text: any; duration: number }
export class Toasts {
  constructor(
    public list: ToastItem[] = $state([]),
    private timers: Map<number, ReturnType<typeof setTimeout>> = new Map(),
    private DURATION = 10000,
    private nextId = 1,
  ) {
    $effect.root(() => {
      $effect(() => {
        console.log("[Toasts.list update]", this.list)
      })
    })
  }

  appendToast(text: string) {
    this.list.unshift({
      id: this.nextId,
      text,
      duration: this.DURATION,
    })
    // add timer
    if (!this.timers.has(this.nextId)) {
      const timer = setTimeout(
        () => this.removeToast(this.nextId),
        this.DURATION,
      )
      this.timers.set(this.nextId, timer)
    }
    this.nextId += 1
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

export const toastMessages = {
  SHORTCUT_UPDATED: (shortcutText: string) =>
    chrome.i18n.getMessage("tips_shortcut_updated", shortcutText),
}
export const toasts = new Toasts()
