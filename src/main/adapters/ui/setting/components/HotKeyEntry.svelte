<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import { stringifyShortcut } from "@lib/utils/shortcut"
import { ChromeMainFacadeImpl } from "@main/infra/ChromeMainFacade"
import ModalEntry from "../ModalEntry.svelte"
import { settingModal } from "../settingModal.svelte"
import { toastMessages, toasts } from "../../toast/toasts.svelte"
import { app } from "@main/bootstrap.svelte"

let localShortcut = $state(app.setting.hotkey)
let localShortcutText = $derived(stringifyShortcut(localShortcut))

function pushToast() {
  toasts.appendToast(toastMessages.SHORTCUT_UPDATED(localShortcutText))
}
</script>

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
        {localShortcutText}
      </p>
    </div>

    <!-- Reset to F2 -->
    <div class="resetToF2Container">
      <Key
        props={{
          id: "resetToF2",
          padding: "0.4em 0.5em",
          onclick: () => {
            localShortcut = ChromeMainFacadeImpl.defaultShortcutF2
            app.setting.hotkey = localShortcut
            settingModal.endListening()
            pushToast()
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
            localShortcut = app.setting.hotkey
          },
        }}>{chrome.i18n.getMessage("settings_shortcut_cancel")}</Key
      >

      <Key
        props={{
          id: "okBtn",
          padding: "0.4em 0.5em",
          onclick: () => {
            console.log("[localShortcut]", localShortcut)
            app.setting.hotkey = localShortcut
            settingModal.endListening()
            pushToast()
          },
        }}>{chrome.i18n.getMessage("settings_shortcut_ok")}</Key
      >
    </div>
  {/if}
</ModalEntry>
