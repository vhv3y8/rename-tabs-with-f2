<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import SettingModalEntry from "../SettingModalEntry.svelte"
import * as view from "../view"
import { getInjections } from "@main/adapters/ui/injections"

const { setting } = getInjections()
</script>

<SettingModalEntry
  title={{
    content: chrome.i18n.getMessage("settings_darkmode"),
    appearance: "inline",
  }}
>
  <Key
    props={{
      fontSize: "18px",
      onclick: () => {
        setting.darkmode = !setting.darkmode
        view.applyDarkModeUI({ darkmode: setting.darkmode })
      },
    }}>{setting.darkmode}</Key
  >
</SettingModalEntry>
