<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import SettingModalEntry from "../SettingModalEntry.svelte"
import { getInjections } from "@main/adapters/ui/injections"
import HorizontalLine from "@infra/ui/components/HorizontalLine.svelte"
import { TOAST_MESSAGES } from "@lib/toast"
import { settingModal } from "../states/settingModal.svelte"

const {
  setting,
  toasts,
  urlTitleFileUploadHandler,
  clickExportUrlTitleFileHandler,
  clearURLTitleFileClickHandler,
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

  {#if settingModal.warnClearTitles}
    <div class="warningContainer">
      <p class="warnClearMsg">
        {chrome.i18n.getMessage("settings_clear_title_datas_warn")}
      </p>
    </div>

    <div class="halves fix">
      <Key
        props={{
          padding: "0.5em",
          fontSize: "16px",
          onclick: () => {
            settingModal.hideClearTitlesWarning()
          },
        }}
      >
        {chrome.i18n.getMessage("settings_cancel")}
      </Key>

      <Key
        props={{
          padding: "0.5em",
          fontSize: "16px",
          onclick: async () => {
            await clearURLTitleFileClickHandler()
            settingModal.hideClearTitlesWarning()
          },
        }}
      >
        {chrome.i18n.getMessage("settings_ok")}
      </Key>
    </div>
  {:else}
    <div class="halves w-full flex gap-[0.3em]">
      <Key
        props={{
          padding: "0.6em",
          fontSize: "17px",
          onclick: () => {
            clickHiddenInputFileTag()
          },
        }}>{chrome.i18n.getMessage("settings_upload_titles_file")}</Key
      >

      <Key
        props={{
          padding: "0.6em",
          fontSize: "17px",
          onclick: () => {
            settingModal.showClearTitlesWarning()
          },
        }}>{chrome.i18n.getMessage("settings_clear_title_datas")}</Key
      >
    </div>

    <Key
      props={{
        id: "saveTitlesBtn",
        padding: "0.6em",
        fontSize: "17px",
        onclick: () => {
          clickExportUrlTitleFileHandler()
        },
      }}>{chrome.i18n.getMessage("settings_save_titles_file")}</Key
    >
  {/if}
</SettingModalEntry>

<!-- Style -->

<style>
:global(li.persistApplyEntry) {
  flex-flow: column nowrap;
  /* align-items: flex-start; */
  align-items: stretch;
  gap: 0.55em;
}

:global(button.key:has(#persistApplyBtn)) {
  width: 100%;
}

:global(div.keyInner) {
  width: max-content;
}
:global(#saveTitlesBtn) {
  width: 100%;
  box-sizing: border-box;
}

div.warningContainer {
  padding: 1.3em 0.7em;
  border: 2px solid var(--primary-9);
  color: var(--primary-9);
  background-color: var(--bg);

  display: flex;
  justify-content: center;
  align-items: center;

  .warnClearMsg {
    font-size: 0.85em;
    font-family: "Ubuntu Mono";
  }
}

.halves {
  width: 100%;
  display: flex;
  gap: 0.3em;

  & > :global(button) {
    flex: 1 0 auto;
    /* min-width: 0; */
  }
  &.fix > :global(button) {
    flex: 1 0 0;
    min-width: 0;
  }
}
</style>
