export let keydowns = $state({
  tab: false,
  shiftTab: false,
  enter: false,
  shiftEnter: false,
  esc: false,
  ctrlEnter: false,
})

export function cancelAllKeydowns() {
  keydowns.tab = false
  keydowns.shiftTab = false
  keydowns.enter = false
  keydowns.shiftEnter = false
  keydowns.esc = false
  keydowns.ctrlEnter = false
}
