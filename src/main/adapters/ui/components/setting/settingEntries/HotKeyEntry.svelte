<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import {
  createShortcut,
  isValidShortcut,
  stringifyShortcut,
} from "@lib/shortcut"
import SettingModalEntry from "../SettingModalEntry.svelte"
import { TOAST_MESSAGES } from "../../../impl/toastPublisher.svelte"
import { settingModal } from "../states/settingModal.svelte"
import { F2HotKey } from "@lib/models/Setting"
import { getInjections } from "@main/adapters/ui/injections"

const { setting, toasts } = getInjections()
const settingHotkeyText = $derived.by(() => {
  if (!setting.hotkey) {
    console.error("[Rename Tabs with F2] Storage Error: 'shortcut' not found")
    toasts.publishToast(TOAST_MESSAGES.ERROR("'shortcut' not found", "Storage"))
    return "N/A"
  }
  return stringifyShortcut(setting.hotkey)
})

let localHotKey = $state(setting.hotkey)
let localHotKeyText = $derived(stringifyShortcut(localHotKey))

function handleListenHotKey(e: KeyboardEvent) {
  if (settingModal.listen) {
    e.preventDefault()
    if (!isValidShortcut(e)) return
    localHotKey = createShortcut(e)
  }
}

function publishToast() {
  console.log("[publishing hotkey update toast]", localHotKeyText)
  toasts.publishToast(TOAST_MESSAGES.SHORTCUT_UPDATED(localHotKeyText))
}
</script>

<!-- HTML -->

<svelte:document onkeydown={handleListenHotKey} />

<SettingModalEntry
  title={{
    content: chrome.i18n.getMessage("settings_hotkey"),
    appearance: "block",
  }}
  liClassName={"hotkeyEntry"}
>
  {#if settingModal.listen}
    <!-- Listening / current hotkey input -->
    <div class="listenShortcutText w-full box-border text-center">
      <p id="listening">
        {chrome.i18n.getMessage("settings_hotkey_listening")}...
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
          fontSize: "17px",
          onclick: () => {
            localHotKey = F2HotKey
            settingModal.endListening()
            setting.hotkey = localHotKey
            publishToast()
          },
        }}>{chrome.i18n.getMessage("settings_hotkey_reset_to_f2")}</Key
      >
    </div>

    <!-- Cancel / OK -->
    <div class="listenCancelOk w-full flex gap-[0.3em]">
      <Key
        props={{
          id: "cancelBtn",
          padding: "0.4em 0.5em",
          fontSize: "17px",
          onclick: () => {
            settingModal.endListening()
            localHotKey = setting.hotkey
          },
        }}>{chrome.i18n.getMessage("settings_cancel")}</Key
      >

      <Key
        props={{
          id: "okBtn",
          padding: "0.4em 0.5em",
          fontSize: "17px",
          onclick: () => {
            console.log("[localHotKey]", localHotKey)
            settingModal.endListening()
            setting.hotkey = localHotKey
            publishToast()
          },
        }}>{chrome.i18n.getMessage("settings_ok")}</Key
      >
    </div>
  {:else}
    <Key
      props={{
        id: "hotkeyBtn",
        padding: null,
        fontSize: "18px",
        onclick: () => {
          settingModal.startListening()
        },
      }}>{settingHotkeyText}</Key
    >
  {/if}
</SettingModalEntry>

<!-- Style -->

<style>
:global(li.hotkeyEntry) {
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 0.55em;
}

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
