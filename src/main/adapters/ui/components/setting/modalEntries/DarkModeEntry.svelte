<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import ModalEntry from "../ModalEntry.svelte"
import * as view from "../view"
</script>

<ModalEntry
  title={{
    content: chrome.i18n.getMessage("settings_darkmode"),
    appearance: "inline",
  }}
>
  <Key
    props={{
      onclick: () => {
        app.setting.darkmode = !app.setting.darkmode
        view.applyDarkModeUI({ darkmode: app.setting.darkmode })
      },
    }}>{app.setting.darkmode}</Key
  >
</ModalEntry>
