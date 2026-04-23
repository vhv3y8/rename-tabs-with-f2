<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import SettingModalEntry from "../SettingModalEntry.svelte"
// import * as view from "../view"
import { getInjections } from "@main/adapters/ui/injections"
import type { Setting } from "@lib/models/Setting"

const { setting } = getInjections()

const pointColorList: Setting["pointColor"][] = [
  "cornflower",
  "coralorange",
  "mutedcoral",
]
const initialIdx = pointColorList.indexOf(setting.pointColor)
let currentIdx = $state(initialIdx)
</script>

<SettingModalEntry
  title={{
    content: chrome.i18n.getMessage("settings_pointcolor"),
    appearance: "inline",
  }}
>
  <Key
    props={{
      fontSize: "18px",
      isKeyDown: true,
      point: pointColorList[currentIdx],
      onclick: () => {
        currentIdx =
          (currentIdx + 1 + pointColorList.length) % pointColorList.length
        setting.pointColor = pointColorList[currentIdx]
      },
    }}>{setting.pointColor}</Key
  >
</SettingModalEntry>
