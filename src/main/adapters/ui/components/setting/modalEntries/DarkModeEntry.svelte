<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import ModalEntry from "../ModalEntry.svelte"
import * as view from "../view"
import { setting } from "../states/inMemorySetting.svelte"
</script>

<ModalEntry
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
</ModalEntry>
