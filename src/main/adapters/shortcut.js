export function isValidShortcut(shortcut) {
  if (
    shortcut.key === "Control" ||
    shortcut.key === "Alt" ||
    shortcut.key === "Meta" ||
    shortcut.key === "Shift"
  )
    return false
  return true
}

export function createShortcut(e) {
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

export function stringifyShortcut(shortcut) {
  let stack = []
  if (shortcut.ctrlKey) stack.push("Ctrl")
  if (shortcut.altKey) stack.push("Alt")
  if (shortcut.metaKey) stack.push(metaKeyText)
  if (shortcut.shiftKey) stack.push("Shift")

  let key = shortcut.key
  if (key === " ") key = "Enter"
  else if (isAlphabet(key)) key = key.toUpperCase()
  stack.push(key)

  return stack.join(" + ")
}

const isMac = navigator.platform?.startsWith("Mac") ?? false
const metaKeyText = isMac ? "Cmd" : "Meta"

function isAlphabet(key) {
  return /^[a-zA-Z]$/.test(key)
}
