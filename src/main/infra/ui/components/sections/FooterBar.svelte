<script lang="ts">
import { keydowns } from "@adapters/keys.svelte"
import SettingsPopover from "@adapters/settings/SettingsPopover.svelte"
import { settingState } from "@adapters/settings/states/settings.svelte"
import { apply } from "@application/usecases/apply"
import Key from "../Key.svelte"
</script>

<!-- HTML -->

<footer>
  <!-- Settings -->
  <div class="settingsContainer">
    <Key
      id={"settingsPopoverBtn"}
      padding={""}
      onclick={() => {
        settingState.toggleShow()
      }}
    >
      {chrome.i18n.getMessage("settings")}
    </Key>

    <!-- Popover -->
    {#if settingState.show}
      <SettingsPopover
        onclose={() => {
          settingState.hide()
        }}
      />
    {/if}
  </div>

  <!-- Save & Close -->
  <span>{chrome.i18n.getMessage("footer_save_and_close")} :</span>
  <Key
    id={"ctrlEnterBtn"}
    keydown={keydowns.ctrlEnter}
    padding={""}
    onclick={apply}>Ctrl + Enter</Key
  >
</footer>

<!-- Style -->

<style>
footer {
  flex: 0 0 auto;

  width: 100%;
  box-sizing: border-box;
  margin-top: 2rem;
  border-top: 2px solid var(--primary-8);
  padding-top: 1rem;
  padding-right: 0.5rem;

  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 1em;

  font-family: "Open Sans";
  font-size: 20px;
}

footer :global(.keyInner) {
  font-size: 18px;
  padding: 0.6em;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  column-gap: 4px;
}

.settingsContainer {
  position: relative;
  margin-right: auto;
}

:global(#settingsPopoverBtn) {
  /* padding: 0.5em 0.4em; */
  z-index: 100;

  &:hover {
    cursor: pointer;
  }
}
</style>
