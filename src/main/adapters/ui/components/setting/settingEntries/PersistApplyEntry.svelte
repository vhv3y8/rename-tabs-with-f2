<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import SettingModalEntry from "../SettingModalEntry.svelte"
import { getInjections } from "@main/adapters/ui/injections"
import HorizontalLine from "@infra/ui/components/HorizontalLine.svelte"

const { setting } = getInjections()
</script>

<SettingModalEntry
  title={{
    content: chrome.i18n.getMessage("settings_persist_apply"),
    appearance: "block",
  }}
>
  <Key
    props={{
      fontSize: "18px",
      padding: "0.6em",
      onclick: () => {
        setting.persistAndApplyTitles = !setting.persistAndApplyTitles
      },
    }}>{setting.persistAndApplyTitles}</Key
  >

  <HorizontalLine style={"dotted"} />

  <div class="w-full flex gap-[0.3em]">
    <Key props={{}}>{chrome.i18n.getMessage("settings_upload_titles_file")}</Key
    >

    <Key props={{}}>{chrome.i18n.getMessage("settings_save_titles_file")}</Key>
  </div>
</SettingModalEntry>
