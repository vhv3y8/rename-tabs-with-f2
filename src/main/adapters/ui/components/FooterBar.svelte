<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import { keydowns } from "./reactivity/keys.svelte"
import SettingModal from "./setting/SettingModal.svelte"
import { settingModal } from "./setting/states/settingModal.svelte"
import { getInjections } from "../injections"
import { conflictModal } from "./setting/states/conflictModal.svelte"
import ConflictModal from "./setting/conflictModal/ConflictModal.svelte"

function keydownCloseSettingHandler(e: KeyboardEvent) {
  switch (e.key) {
    case "Escape": {
      if (settingModal.show && !settingModal.listen) {
        e.preventDefault()
        settingModal.hide()
      }
    }
  }
}

// use case handlers
const { keydownApplyHandler, clickApplyHandler, setting } = getInjections()
</script>

<!-- HTML -->

<svelte:document
  onkeydown={(e: KeyboardEvent) => {
    keydownApplyHandler(e)
    keydownCloseSettingHandler(e)
  }}
/>

<footer>
  <!-- setting -->
  <div class="settingsContainer">
    <Key
      props={{
        id: "settingsPopoverBtn",
        padding: null,
        fontSize: "18px",
        onclick: () => {
          settingModal.toggleShow()
        },
      }}
    >
      {chrome.i18n.getMessage("settings")}
    </Key>
    <!-- setting modal -->
    {#if settingModal.show}
      <SettingModal
        blur={conflictModal.show}
        onclose={() => {
          settingModal.hide()
        }}
      />
    {/if}
    <!-- conflict modal -->
    {#if conflictModal.show}
      <ConflictModal />
    {/if}
  </div>
  <!-- save & close -->
  <span>{chrome.i18n.getMessage("footer_save_and_close")} :</span>
  <Key
    props={{
      id: "ctrlEnterBtn",
      isKeyDown: keydowns.ctrlEnter,
      padding: null,
      fontSize: "18px",
      point: setting.pointColor,
      onclick: clickApplyHandler,
    }}>Ctrl + Enter</Key
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
