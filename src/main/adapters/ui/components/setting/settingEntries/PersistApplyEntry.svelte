<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import SettingModalEntry from "../SettingModalEntry.svelte"
import { getInjections } from "@main/adapters/ui/injections"
import HorizontalLine from "@infra/ui/components/HorizontalLine.svelte"
import { TOAST_MESSAGES } from "@adapters/ui/impl/toastPublisher.svelte"

const {
  setting,
  toasts,
  urlTitleFileUploadHandler,
  clickExportUrlTitleFileHandler,
} = getInjections()

const {
  click: { clickHiddenInputFileTag },
} = urlTitleFileUploadHandler.createFileLoadCustomUIHandlers({ click: true })
</script>

<SettingModalEntry
  title={{
    content: chrome.i18n.getMessage("settings_persist_apply"),
    appearance: "inline",
    marginBottom: "8px",
  }}
  liClassName={"persistApplyEntry"}
>
  <Key
    props={{
      id: "persistApplyBtn",
      fontSize: "18px",
      padding: "0.6em",
      onclick: () => {
        setting.persistAndApplyTitles = !setting.persistAndApplyTitles
        if (setting.persistAndApplyTitles) {
          toasts.publishToast(TOAST_MESSAGES.PERSIST_APPLY_ON, 30000)
        } else {
          toasts.publishToast(TOAST_MESSAGES.PERSIST_APPLY_OFF, 30000)
        }
      },
    }}>{setting.persistAndApplyTitles}</Key
  >

  <HorizontalLine
    style={"dotted"}
    marginBlock={"0"}
    color={"var(--primary-7)"}
  />

  <div class="loadSaveTitles w-full flex gap-[0.3em]">
    <Key
      props={{
        padding: "0.6em",
        onclick: () => {
          clickHiddenInputFileTag()
        },
      }}>{chrome.i18n.getMessage("settings_upload_titles_file")}</Key
    >

    <Key
      props={{
        padding: "0.6em",
        onclick: () => {
          clickExportUrlTitleFileHandler()
        },
      }}>{chrome.i18n.getMessage("settings_save_titles_file")}</Key
    >
  </div>
</SettingModalEntry>

<!-- Style -->

<style>
:global(li.persistApplyEntry) {
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 0.55em;
}

:global(button.key:has(#persistApplyBtn)) {
  width: 100%;
}

.loadSaveTitles > :global(button) {
  width: 50%;
}
</style>
