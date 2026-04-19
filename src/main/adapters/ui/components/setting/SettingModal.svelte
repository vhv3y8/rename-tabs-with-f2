<script lang="ts">
import Popover from "@infra/ui/components/Popover.svelte"
import DarkModeEntry from "./modalEntries/DarkModeEntry.svelte"
import LargerWidthEntry from "./modalEntries/LargerWidthEntry.svelte"
import HotKeyEntry from "./modalEntries/HotKeyEntry.svelte"

let { onclose } = $props()
</script>

<!-- HTML -->

<Popover {onclose} directionDown={false}>
  <ul id="settingsPopoverContent">
    <DarkModeEntry />
    <LargerWidthEntry />
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
