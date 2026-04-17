<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import ModalEntry from "../ModalEntry.svelte"
import * as view from "../../view"
import { app } from "@main/bootstrap.svelte"
</script>

<ModalEntry
  title={{
    content: chrome.i18n.getMessage("settings_larger_width"),
    appearance: "inline",
  }}
>
  <Key
    props={{
      onclick: () => {
        app.setting.largerWidth = !app.setting.largerWidth
        view.applyLargerWidth({
          largerWidth: app.setting.largerWidth,
        })
      },
    }}>{app.setting.largerWidth}</Key
  >
</ModalEntry>
