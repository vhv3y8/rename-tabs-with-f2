import type { HotKey } from "@chrome/models/Setting"

export function isValidShortcut(hotKey: HotKey) {
  if (
    hotKey.key === "Control" ||
    hotKey.key === "Alt" ||
    hotKey.key === "Meta" ||
    hotKey.key === "Shift"
  )
    return false
  return true
}

export function createShortcut(e: KeyboardEvent) {
  let key = e.key
  // if (key === "Control" || key === "Shift") key = ""
  return {
    key,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey,
  }
}

export function stringifyShortcut(hotKey: HotKey) {
  let stack = []
  if (hotKey.ctrlKey) stack.push("Ctrl")
  if (hotKey.altKey) stack.push("Alt")
  if (hotKey.metaKey) stack.push(metaKeyText)
  if (hotKey.shiftKey) stack.push("Shift")

  let key = hotKey.key
  if (key === " ") key = "Enter"
  else if (isAlphabet(key)) key = key.toUpperCase()
  stack.push(key)

  return stack.join(" + ")
}

const isMac = navigator.platform?.startsWith("Mac") ?? false
const metaKeyText = isMac ? "Cmd" : "Meta"

function isAlphabet(key: string) {
  return /^[a-zA-Z]$/.test(key)
}
