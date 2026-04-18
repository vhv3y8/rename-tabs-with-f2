<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import {
  createShortcut,
  isValidShortcut,
  stringifyShortcut,
} from "@lib/shortcut"
import ModalEntry from "../ModalEntry.svelte"
import { TOAST_MESSAGES, toasts } from "../../toast/toasts.svelte"
import { app } from "../states/appSetting.svelte"
import { settingModal } from "../states/settingModal.svelte"
import { F2HotKey } from "@lib/chrome/models/Setting"

let localHotKey = $state(app.setting.hotKey)
let localHotKeyText = $derived(stringifyShortcut(localHotKey))

function handleListenHotKey(e: KeyboardEvent) {
  if (settingModal.listen) {
    e.preventDefault()
    if (!isValidShortcut(e)) return
    localHotKey = createShortcut(e)
  }
}

function publishToast() {
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
  {#if !settingModal.listen}
    <Key
      props={{
        id: "shortcutBtn",
        padding: null,
        onclick: () => {
          settingModal.startListening()
        },
      }}>{settingModal.hotKeyText}</Key
    >
  {:else}
    <!-- Listening / shortcutText -->
    <div class="listenShortcutText">
      <p id="listening">
        {chrome.i18n.getMessage("settings_shortcut_listening")}...
      </p>

      <p id="shortcutText">
        {localHotKeyText}
      </p>
    </div>

    <!-- Reset to F2 -->
    <div class="resetToF2Container">
      <Key
        props={{
          id: "resetToF2",
          padding: "0.4em 0.5em",
          onclick: () => {
            localHotKey = F2HotKey
            settingModal.endListening()
            app.setting.hotKey = localHotKey
            publishToast()
          },
        }}>{chrome.i18n.getMessage("settings_shortcut_reset_to_f2")}</Key
      >
    </div>

    <!-- Cancel / OK -->
    <div class="listenCancelOk">
      <Key
        props={{
          id: "cancelBtn",
          padding: "0.4em 0.5em",
          onclick: () => {
            settingModal.endListening()
            localHotKey = app.setting.hotKey
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
            app.setting.hotKey = localHotKey
            publishToast()
          },
        }}>{chrome.i18n.getMessage("settings_shortcut_ok")}</Key
      >
    </div>
  {/if}
</ModalEntry>
