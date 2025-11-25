const DURATION = 10000

export const messages = {
  SHORTCUT_UPDATED: (shortcutText) =>
    chrome.i18n.getMessage("tips_shortcut_updated", shortcutText),
}

const timers = new Map()
export let toastList = $state([])
let nextId = 1

export function getId() {
  const id = nextId
  nextId += 1
  return id
}

export function appendToast(text) {
  const id = getId()

  toastList.unshift({
    id,
    text,
    duration: DURATION,
  })
  // add timer
  if (!timers.has(id)) {
    const timer = setTimeout(() => removeToast(id), DURATION)
    timers.set(id, timer)
  }
}

export function removeToast(id) {
  const idx = toastList.findIndex((item) => item.id === id)
  if (-1 < idx) {
    toastList.splice(idx, 1)

    // remove timer if exists
    if (timers.has(id)) {
      const timer = timers.get(id)
      clearTimeout(timer)
      timers.delete(id)
    }
  }
}
