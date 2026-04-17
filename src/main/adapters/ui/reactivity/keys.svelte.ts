export let keydowns = $state({
  // move around
  tab: false,
  shiftTab: false,
  enter: false,
  shiftEnter: false,
  esc: false,
  // not connected card
  shiftW: false,
  shiftR: false,
  // apply
  ctrlEnter: false,
})

export function cancelAllKeydowns() {
  keydowns.tab = false
  keydowns.shiftTab = false
  keydowns.enter = false
  keydowns.shiftEnter = false
  keydowns.esc = false
  keydowns.ctrlEnter = false
  keydowns.shiftW = false
  keydowns.shiftR = false
}

export function cancelAllMoveAroundKeydowns() {
  keydowns.tab = false
  keydowns.shiftTab = false
  keydowns.enter = false
  keydowns.shiftEnter = false
  keydowns.esc = false
}
export function cancelAllNotConnectedCardKeydowns() {
  keydowns.shiftW = false
  keydowns.shiftR = false
}
export function cancelApplyKeydown() {
  keydowns.ctrlEnter = false
}
