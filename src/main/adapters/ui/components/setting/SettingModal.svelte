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

ul li {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  gap: 2em;
}

ul li span {
  font-size: 0.9em;
}

ul li.col {
  flex-flow: column nowrap;
  align-items: flex-start;
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

:global(button.key:has(#shortcutBtn)) {
  width: 100%;
}
:global(#shortcutBtn) {
  box-sizing: border-box;
  padding: 0.7em 0.5em;
}

.listenShortcutText {
  padding: 0.4em 0.5em 0.6em;
  border: 2px solid var(--primary-9);
  color: var(--primary-9);
  background-color: var(--bg);

  width: 100%;
  box-sizing: border-box;
  text-align: center;

  font-size: 0.9em;
}
.listenShortcutText :global(#listening) {
  margin-bottom: 0.5em;
  font-size: 0.85em;
  font-family: "Ubuntu";
  color: var(--primary-7);
}
.listenShortcutText :global(#shortcutText) {
  font-size: 1.2em;
  font-family: "Ubuntu Mono";
}

.resetToF2Container {
  width: 100%;
  display: flex;
}
:global(button.key:has(#resetToF2)) {
  width: 100%;
  display: flex;
}
:global(#resetToF2) {
  width: 100%;
  box-sizing: border-box;
  /* font-size: 0.85em; */
  font-size: 0.95em;
  padding: 0.4em 0.5em;
}

div.listenCancelOk {
  width: 100%;
  display: flex;
  gap: 0.3em;

  :global(button) {
    width: 50%;
    /* font-size: 0.85em; */
    font-size: 0.95em;
  }
}
:global(#cancelBtn),
:global(#okBtn) {
  font-size: 0.95em;
}
</style>
