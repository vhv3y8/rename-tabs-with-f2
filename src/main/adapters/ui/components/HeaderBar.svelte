<script lang="ts">
import Key from "@infra/ui/components/Key.svelte"
import { cancelAllMoveAroundKeydowns, keydowns } from "./reactivity/keys.svelte"
import { settingModal } from "./setting/states/settingModal.svelte"
import { tabItemComponents } from "./tabs/states/tabItemComponents.svelte"

// move around tab components
function keydownMoveAroundTabItemsHandler(e: KeyboardEvent) {
  if (settingModal.listen) return

  switch (e.key) {
    case "Tab": {
      e.preventDefault()
      if (e.shiftKey) {
        keydowns.shiftTab = true
        tabItemComponents.focusPreviousItem()
      } else {
        keydowns.tab = true
        tabItemComponents.focusNextItem()
      }
      break
    }
    case "Enter": {
      e.preventDefault()
      if (e.shiftKey) {
        keydowns.shiftEnter = true
        tabItemComponents.focusPreviousItem()
      } else {
        keydowns.enter = true
        tabItemComponents.focusNextItem()
      }
      break
    }
    case "Escape": {
      e.preventDefault()
      // if (settingModal.hideIfVisible()) break
      // TODO
      if (settingModal.show) break
      keydowns.esc = true
      tabItemComponents.focusInitialItem()
      break
    }
    default: {
      cancelAllMoveAroundKeydowns()
    }
  }
}
</script>

<!-- HTML -->

<svelte:document onkeydown={keydownMoveAroundTabItemsHandler} />

<header>
  <span
    >{chrome.i18n.getMessage("header_focus_initial")} :
    <Key
      props={{
        pressable: false,
        isKeyDown: keydowns.esc,
        padding: "0.3em 0.5em",
        onclick: () => {
          tabItemComponents.focusInitialItem()
        },
        onmousedown: () => {
          keydowns.esc = true
        },
        onmouseup: () => {
          keydowns.esc = false
        },
      }}>ESC</Key
    >
  </span>
  <span
    >{chrome.i18n.getMessage("header_next")} :
    <Key
      props={{
        pressable: false,
        isKeyDown: keydowns.tab,
        padding: "0.3em 0.5em",
        onclick: () => {
          tabItemComponents.focusNextItem()
        },
        onmousedown: () => {
          keydowns.tab = true
        },
        onmouseup: () => {
          keydowns.tab = false
        },
        repeatClickHandlerWithMouseDown: true,
      }}>Tab</Key
    >
    /
    <Key
      props={{
        pressable: false,
        isKeyDown: keydowns.enter,
        padding: "0.3em 0.5em",
        onclick: () => {
          tabItemComponents.focusNextItem()
        },
        onmousedown: () => {
          keydowns.enter = true
        },
        onmouseup: () => {
          keydowns.enter = false
        },
        repeatClickHandlerWithMouseDown: true,
      }}>Enter</Key
    ></span
  >
  <span>
    <span>{chrome.i18n.getMessage("header_previous")} : </span>
    <Key
      props={{
        pressable: false,
        isKeyDown: keydowns.shiftTab,
        padding: "0.3em 0.5em",
        onclick: () => {
          tabItemComponents.focusPreviousItem()
        },
        onmousedown: () => {
          keydowns.shiftTab = true
        },
        onmouseup: () => {
          keydowns.shiftTab = false
        },
        repeatClickHandlerWithMouseDown: true,
      }}>Shift + Tab</Key
    >
    /
    <Key
      props={{
        pressable: false,
        isKeyDown: keydowns.shiftEnter,
        padding: "0.3em 0.5em",
        onclick: () => {
          tabItemComponents.focusPreviousItem()
        },
        onmousedown: () => {
          keydowns.shiftEnter = true
        },
        onmouseup: () => {
          keydowns.shiftEnter = false
        },
        repeatClickHandlerWithMouseDown: true,
      }}>Shift + Enter</Key
    >
  </span>
</header>

<!-- Style -->

<style>
header {
  flex: 0 0 auto;

  width: 100%;
  box-sizing: border-box;
  /* margin-bottom: 2rem; */
  border-bottom: 2px solid var(--primary-8);
  padding-bottom: 1.25rem;

  font-family: "Open Sans";
  font-size: 20px;

  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  column-gap: 1em;
  row-gap: 0.7em;
}

:global(header button) {
  font-size: 18px;
  padding: 0.3em 0.5em;
}
</style>
