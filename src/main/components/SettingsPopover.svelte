<script>
import { onMount } from "svelte"

import Key from "./common/Key.svelte"
import Popover from "./common/Popover.svelte"

import * as chromeStorage from "../../lib/chrome/storage"

import {
  endShortcutListen,
  getGlobalShortcutText,
  setShortcutListeningMode,
  settings,
  settingsState,
  startShortcutListen,
} from "../lib/ui/states/settings.svelte"
// import { modes } from "../lib/ui/states/modes.svelte"
import * as view from "../lib/ui/view"
// import { createListenShortcutKeydownHandler } from "../lib/ui/eventHandlers"
import { appendToast, messages } from "../lib/ui/states/toasts.svelte"
import { createListenShortcutKeydownHandler } from "../lib/ui/keyboard"
import { stringifyShortcut } from "../lib/ui/shortcut"

let { onclose } = $props()

// let globalShortcutText = $derived(stringifyShortcut(settings.shortcut))

let localShortcut = $state(settings.shortcut)
let localShortcutText = $derived(stringifyShortcut(localShortcut))

function pushToast() {
  appendToast(messages.SHORTCUT_UPDATED(localShortcutText))
}

// Utils
// const isMac = navigator.platform?.startsWith("Mac") ?? false
// const metaKeyText = isMac ? "Cmd" : "Meta"
// function isAlphabet(key) {
//   return /^[a-zA-Z]$/.test(key)
// }
// function stringifyShortcut(shortcut) {
//   let stack = []
//   if (shortcut.ctrlKey) stack.push("Ctrl")
//   if (shortcut.altKey) stack.push("Alt")
//   if (shortcut.metaKey) stack.push(metaKeyText)
//   if (shortcut.shiftKey) stack.push("Shift")

//   let key = shortcut.key
//   if (key === " ") key = "Enter"
//   else if (isAlphabet(key)) key = key.toUpperCase()
//   stack.push(key)

//   return stack.join(" + ")
// }
</script>

<!-- Event Handlers -->

<!-- <svelte:document
  onkeydown={(e) => {
    if (modes.listenShortcutUpdate) {
      createListenShortcutKeydownHandler({
        updateShortcutState: (shortcutFromEvent) => {
          if (
            shortcutFromEvent.key === "Control" ||
            shortcutFromEvent.key === "Alt" ||
            shortcutFromEvent.key === "Meta" ||
            shortcutFromEvent.key === "Shift"
          )
            return

          localShortcut = shortcutFromEvent
        },
      })(e)
    }
  }}
/> -->

<svelte:document
  onkeydown={(e) => {
    if (settingsState.listeningShortcut) {
      // to put keydown logic at outer module
      createListenShortcutKeydownHandler({
        updateShortcutState: (shortcutFromEvent) => {
          // listen shortcut only filter?
          // if (
          //   shortcutFromEvent.key === "Control" ||
          //   shortcutFromEvent.key === "Alt" ||
          //   shortcutFromEvent.key === "Meta" ||
          //   shortcutFromEvent.key === "Shift"
          // )
          //   return

          localShortcut = shortcutFromEvent
        },
      })(e)
    }
  }}
/>

<!-- HTML -->

<Popover {onclose} directionDown={false}>
  <ul id="settingsPopoverContent">
    <!-- Darkmode -->
    <li>
      <span>{chrome.i18n.getMessage("settings_darkmode")} :</span>
      <!-- class="key pressable" -->
      <Key
        onclick={async () => {
          settings.darkmode = !settings.darkmode
          view.applyDarkModeUI({ darkmode: settings.darkmode })
        }}>{settings.darkmode}</Key
      >
    </li>

    <!-- Larger Width -->
    <li>
      <span>{chrome.i18n.getMessage("settings_larger_width")} :</span>
      <!-- type="button"
        class="key pressable" -->
      <Key
        onclick={async () => {
          settings.largerWidth = !settings.largerWidth
          view.applyLargerWidth({ largerWidth: settings.largerWidth })
        }}>{settings.largerWidth}</Key
      >
    </li>

    <!-- Shortcut -->
    <li class="col">
      <p><span>{chrome.i18n.getMessage("settings_shortcut")} :</span></p>

      {#if !settingsState.listeningShortcut}
        <Key
          id={"shortcutBtn"}
          padding={""}
          onclick={() => {
            startShortcutListen()
          }}>{getGlobalShortcutText()}</Key
        >
      {:else}
        <!-- Listening / shortcutText -->
        <div class="listenShortcutText">
          <p id="listening">
            {chrome.i18n.getMessage("settings_shortcut_listening")}...
          </p>

          <p id="shortcutText">
            {localShortcutText}
          </p>
        </div>

        <!-- Reset to F2 -->
        <div class="resetToF2Container">
          <Key
            id={"resetToF2"}
            padding={"0.4em 0.5em"}
            onclick={() => {
              localShortcut = chromeStorage.defaultShortcutF2
              settings.shortcut = localShortcut
              endShortcutListen()
              pushToast()
            }}>{chrome.i18n.getMessage("settings_shortcut_reset_to_f2")}</Key
          >
        </div>

        <!-- Cancel / OK -->
        <div class="listenCancelOk">
          <Key
            id={"cancelBtn"}
            padding={"0.4em 0.5em"}
            onclick={() => {
              endShortcutListen()
              localShortcut = settings.shortcut
            }}>{chrome.i18n.getMessage("settings_shortcut_cancel")}</Key
          >

          <Key
            id={"okBtn"}
            padding={"0.4em 0.5em"}
            onclick={() => {
              console.log("[localShortcut]", localShortcut)
              settings.shortcut = localShortcut
              endShortcutListen()
              pushToast()
            }}>{chrome.i18n.getMessage("settings_shortcut_ok")}</Key
          >
        </div>
      {/if}
    </li>
  </ul>
</Popover>

<!-- Style -->

<style>
ul {
  list-style: none;

  margin: 0;
  padding: 0;
  width: max-content;

  display: flex;
  flex-flow: column nowrap;
  gap: 0.55em;
}

ul li {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  gap: 2em;
}

ul li span {
  font-size: 0.9em;
}

ul li.col {
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 0.55em;
}

:global(ul#settingsPopoverContent li button.key) {
  font-size: 0.9em;

  &:hover {
    cursor: pointer;
  }
}

:global(button.key.small) {
  padding: 0.4em 0.5em;
}

:global(button.key:has(#shortcutBtn)) {
  width: 100%;
}
:global(#shortcutBtn) {
  box-sizing: border-box;
  padding: 0.7em 0.5em;
}

.listenShortcutText {
  padding: 0.4em 0.5em 0.6em;
  border: 2px solid var(--primary-9);
  color: var(--primary-9);
  background-color: var(--bg);

  width: 100%;
  box-sizing: border-box;
  text-align: center;

  font-size: 0.9em;
}
.listenShortcutText :global(#listening) {
  margin-bottom: 0.5em;
  font-size: 0.85em;
  font-family: "Ubuntu";
  color: var(--primary-7);
}
.listenShortcutText :global(#shortcutText) {
  font-size: 1.2em;
  font-family: "Ubuntu Mono";
}

.resetToF2Container {
  width: 100%;
  display: flex;
}
:global(button.key:has(#resetToF2)) {
  width: 100%;
  display: flex;
}
:global(#resetToF2) {
  width: 100%;
  box-sizing: border-box;
  /* font-size: 0.85em; */
  font-size: 0.95em;
  padding: 0.4em 0.5em;
}

div.listenCancelOk {
  width: 100%;
  display: flex;
  gap: 0.3em;

  :global(button) {
    width: 50%;
    /* font-size: 0.85em; */
    font-size: 0.95em;
  }
}
:global(#cancelBtn),
:global(#okBtn) {
  font-size: 0.95em;
}
</style>
