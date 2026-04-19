<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import {
  createShortcut,
  isValidShortcut,
  stringifyShortcut,
} from "@lib/shortcut"
import ModalEntry from "../ModalEntry.svelte"
import { TOAST_MESSAGES, toasts } from "../../toast/toasts.svelte"
import { settingModal } from "../states/settingModal.svelte"
import { F2HotKey } from "@lib/chrome/models/Setting"
import { setting } from "../states/inMemorySetting.svelte"

let localHotKey = $state(setting.hotKey)
let localHotKeyText = $derived(stringifyShortcut(localHotKey))

function handleListenHotKey(e: KeyboardEvent) {
  if (settingModal.listen) {
    e.preventDefault()
    if (!isValidShortcut(e)) return
    localHotKey = createShortcut(e)
  }
}

function publishToast() {
  console.log("[publishing toast]")
  toasts.appendToast(TOAST_MESSAGES.SHORTCUT_UPDATED(localHotKeyText))
}
</script>

<!-- HTML -->

<svelte:document onkeydown={handleListenHotKey} />

<ModalEntry
  title={{
    content: chrome.i18n.getMessage("settings_shortcut"),
    appearance: "block",
  }}
>
  {#if settingModal.listen}
    <!-- Listening / shortcutText -->
    <div class="listenShortcutText w-full box-border text-center">
      <p id="listening">
        {chrome.i18n.getMessage("settings_shortcut_listening")}...
      </p>

      <p id="hotkeyText">
        {localHotKeyText}
      </p>
    </div>

    <!-- Reset to F2 -->
    <div class="resetToF2Container w-full flex">
      <Key
        props={{
          id: "resetToF2",
          padding: "0.4em 0.5em",
          onclick: () => {
            localHotKey = F2HotKey
            settingModal.endListening()
            setting.hotKey = localHotKey
            publishToast()
          },
        }}>{chrome.i18n.getMessage("settings_shortcut_reset_to_f2")}</Key
      >
    </div>

    <!-- Cancel / OK -->
    <div class="listenCancelOk w-full flex gap-[0.3em]">
      <Key
        props={{
          id: "cancelBtn",
          padding: "0.4em 0.5em",
          onclick: () => {
            settingModal.endListening()
            localHotKey = setting.hotKey
          },
        }}>{chrome.i18n.getMessage("settings_shortcut_cancel")}</Key
      >

      <Key
        props={{
          id: "okBtn",
          padding: "0.4em 0.5em",
          onclick: () => {
            console.log("[localHotKey]", localHotKey)
            settingModal.endListening()
            setting.hotKey = localHotKey
            publishToast()
          },
        }}>{chrome.i18n.getMessage("settings_shortcut_ok")}</Key
      >
    </div>
  {:else}
    <Key
      props={{
        id: "hotkeyBtn",
        padding: null,
        onclick: () => {
          settingModal.startListening()
        },
      }}>{settingModal.hotKeyText}</Key
    >
  {/if}
</ModalEntry>

<!-- Style -->

<style>
.listenShortcutText {
  padding: 0.4em 0.5em 0.6em;
  border: 2px solid var(--primary-9);
  color: var(--primary-9);
  background-color: var(--bg);

  /* width: 100%;
  box-sizing: border-box;
  text-align: center; */

  font-size: 0.9em;
}

/* listening */
:global(#listening) {
  margin-bottom: 0.5em;
  font-size: 0.85em;
  font-family: "Ubuntu";
  color: var(--primary-7);
}
:global(#hotkeyText) {
  font-size: 1.2em;
  font-family: "Ubuntu Mono";
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
  /* width: 100%;
  display: flex;
  gap: 0.3em; */

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
/* not listening */
:global(button.key:has(#hotkeyBtn)) {
  width: 100%;
}
:global(#hotkeyBtn) {
  box-sizing: border-box;
  padding: 0.7em 0.5em;
}
</style>
