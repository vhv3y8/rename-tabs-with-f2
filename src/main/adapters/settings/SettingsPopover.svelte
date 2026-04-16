<script lang="ts">
import Key from "../../infra/ui/components/Key.svelte"
import { settingState } from "./states/settings.svelte"
import { stringifyShortcut } from "@adapters/shortcut"
import { toastMessages, toasts } from "@adapters/toast/toasts.svelte"
import Popover from "@infra/ui/components/Popover.svelte"

import * as view from "../view"
import { createListenShortcutKeydownHandler } from "./input/keyboard"
import { ChromeMainFacadeImpl } from "@infra/ChromeMainFacade"

let { onclose } = $props()

let localShortcut = $state(settingState.settings.shortcut)
let localShortcutText = $derived(stringifyShortcut(localShortcut))

function pushToast() {
  toasts.appendToast(toastMessages.SHORTCUT_UPDATED(localShortcutText))
}
</script>

<!-- Event Handlers -->

<svelte:document
  onkeydown={(e) => {
    if (settingState.listen) {
      // to put keydown logic at outer module
      createListenShortcutKeydownHandler({
        updateShortcutState: (shortcutFromEvent) => {
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
      <Key
        onclick={async () => {
          settingState.settings.darkmode = !settingState.settings.darkmode
          view.applyDarkModeUI({ darkmode: settingState.settings.darkmode })
        }}>{settingState.settings.darkmode}</Key
      >
    </li>

    <!-- Larger Width -->
    <li>
      <span>{chrome.i18n.getMessage("settings_larger_width")} :</span>
      <Key
        onclick={async () => {
          settingState.settings.largerWidth = !settingState.settings.largerWidth
          view.applyLargerWidth({
            largerWidth: settingState.settings.largerWidth,
          })
        }}>{settingState.settings.largerWidth}</Key
      >
    </li>

    <!-- Shortcut -->
    <li class="col">
      <p><span>{chrome.i18n.getMessage("settings_shortcut")} :</span></p>

      {#if !settingState.listen}
        <Key
          id={"shortcutBtn"}
          padding={""}
          onclick={() => {
            settingState.startListening()
          }}>{settingState.shortcutText}</Key
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
              localShortcut = ChromeMainFacadeImpl.defaultShortcutF2
              settingState.settings.shortcut = localShortcut
              settingState.endListening()
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
              settingState.endListening()
              localShortcut = settingState.settings.shortcut
            }}>{chrome.i18n.getMessage("settings_shortcut_cancel")}</Key
          >

          <Key
            id={"okBtn"}
            padding={"0.4em 0.5em"}
            onclick={() => {
              console.log("[localShortcut]", localShortcut)
              settingState.settings.shortcut = localShortcut
              settingState.endListening()
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
