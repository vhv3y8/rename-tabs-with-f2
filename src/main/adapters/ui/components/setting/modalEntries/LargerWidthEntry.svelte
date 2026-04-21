<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import ModalEntry from "../ModalEntry.svelte"
import * as view from "../view"
import { getInjections } from "@main/adapters/ui/injections"

const { setting } = getInjections()
</script>

<ModalEntry
  title={{
    content: chrome.i18n.getMessage("settings_larger_width"),
    appearance: "inline",
  }}
>
  <Key
    props={{
      fontSize: "18px",
      onclick: () => {
        setting.largerWidth = !setting.largerWidth
        view.applyLargerWidth({
          largerWidth: setting.largerWidth,
        })
      },
    }}>{setting.largerWidth}</Key
  >
</ModalEntry>
