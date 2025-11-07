<script>
import { onMount } from "svelte"
import Popover from "./common/Popover.svelte"
import * as chromeStorage from "../../lib/chrome/storage"
import { settings } from "../lib/states/settings.svelte"
import { modes } from "../lib/states/modes.svelte"
import * as view from "../lib/ui/view"
import { createListenShortcutKeydownHandler } from "../lib/ui/eventHandlers"

let { onclose } = $props()

let globalShortcutText = $derived.by(() => stringifyShortcut(settings.shortcut))

let localShortcut = $state(settings.shortcut)
let localShortcutText = $derived.by(() => stringifyShortcut(localShortcut))

// Utils
const isMac = navigator.platform?.startsWith("Mac") ?? false
const metaKeyText = isMac ? "Cmd" : "Meta"
function isAlphabet(key) {
  return /^[a-zA-Z]$/.test(key)
}
function stringifyShortcut(shortcut) {
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
</script>

<!-- Event Handlers -->

<svelte:document
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
/>

<!-- HTML -->

<Popover {onclose} directionDown={false}>
  <ul>
    <!-- Darkmode -->
    <li>
      <span>{chrome.i18n.getMessage("settings_darkmode")} :</span>
      <button
        type="button"
        class="key pressable"
        onclick={async () => {
          settings.darkmode = !settings.darkmode
          view.applyDarkModeUI({ darkmode: settings.darkmode })
        }}>{settings.darkmode}</button
      >
    </li>

    <!-- Larger Width -->
    <li>
      <span>{chrome.i18n.getMessage("settings_larger_width")} :</span>
      <button
        type="button"
        class="key pressable"
        onclick={async () => {
          settings.largerWidth = !settings.largerWidth
          view.applyLargerWidth({ largerWidth: settings.largerWidth })
        }}>{settings.largerWidth}</button
      >
    </li>

    <!-- Shortcut -->
    <li class="col">
      <p><span>{chrome.i18n.getMessage("settings_shortcut")} :</span></p>

      {#if !modes.listenShortcutUpdate}
        <button
          type="button"
          id="shortcutBtn"
          class="key pressable"
          onclick={() => {
            modes.listenShortcutUpdate = true
          }}>{globalShortcutText}</button
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
          <button
            type="button"
            id="resetToF2"
            class="key pressable"
            onclick={() => {
              localShortcut = chromeStorage.defaultShortcutF2
              settings.shortcut = localShortcut
              modes.listenShortcutUpdate = false
            }}>{chrome.i18n.getMessage("settings_shortcut_reset_to_f2")}</button
          >
        </div>

        <!-- Cancel / OK -->
        <div class="listenCancelOk">
          <button
            type="button"
            class="key pressable"
            onclick={() => {
              modes.listenShortcutUpdate = false
              localShortcut = settings.shortcut
            }}>{chrome.i18n.getMessage("settings_shortcut_cancel")}</button
          >

          <button
            type="button"
            class="key pressable"
            onclick={() => {
              console.log("[localShortcut]", localShortcut)
              settings.shortcut = localShortcut
              modes.listenShortcutUpdate = false
            }}>{chrome.i18n.getMessage("settings_shortcut_ok")}</button
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
  gap: 0.8em;
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
  gap: 0.6em;
}

ul li button {
  font-size: 0.9em;
  padding: 0.4em 0.5em;

  &:hover {
    cursor: pointer;
  }
}

#shortcutBtn {
  width: 100%;
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
.listenShortcutText #listening {
  margin-bottom: 0.5em;
  font-size: 0.85em;
  font-family: "Ubuntu";
  color: var(--primary-7);
}
.listenShortcutText #shortcutText {
  font-size: 1.2em;
  font-family: "Ubuntu Mono";
}

.resetToF2Container {
  width: 100%;
  display: flex;
}
button#resetToF2 {
  width: 100%;
  font-size: 0.85em;
  padding: 0.4em 0.5em;
}

div.listenCancelOk {
  width: 100%;
  display: flex;
  gap: 0.3em;

  button {
    width: 50%;
    font-size: 0.85em;
  }
}
</style>
