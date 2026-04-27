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

<Popover {onclose} zIndex={100} opacity={blur ? 0.7 : 1}>
  <ul id="settingsPopoverContent" class:otherModal={blur}>
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

  &.otherModal {
    pointer-events: none;
  }
}
:global(ul#settingsPopoverContent li button.key) {
  font-size: 0.9em;

  &:hover {
    cursor: pointer;
  }
}

ul :global(button.key) {
  display: flex;
  & > :global(div.keyInner) {
    flex: 1 0 0;
  }
}

:global(button.key.small) {
  padding: 0.4em 0.5em;
}
</style>
