<script lang="ts">
import Popover from "@infra/ui/components/Popover.svelte"
import DarkModeEntry from "./settingEntries/DarkModeEntry.svelte"
import LargerWidthEntry from "./settingEntries/LargerWidthEntry.svelte"
import HotKeyEntry from "./settingEntries/HotKeyEntry.svelte"
import PointColorEntry from "./settingEntries/PointColorEntry.svelte"
import PersistApplyEntry from "./settingEntries/PersistApplyEntry.svelte"

let { blur, onclose } = $props()
</script>

<!-- HTML -->

<Popover {onclose} zIndex={100} opacity={blur ? 0.5 : 1}>
  <ul id="settingsPopoverContent">
    <PointColorEntry />
    <DarkModeEntry />
    <LargerWidthEntry />
    <PersistApplyEntry />
    <HotKeyEntry />
  </ul>
</Popover>

<!-- Style -->

<style>
ul {
  list-style: none;

  margin: 0;
  padding: 0;
  width: max-content;

  display: flex;
  flex-flow: column nowrap;
  gap: 0.55em;
}
:global(ul#settingsPopoverContent li button.key) {
  font-size: 0.9em;

  &:hover {
    cursor: pointer;
  }
}

:global(button.key.small) {
  padding: 0.4em 0.5em;
}
</style>
