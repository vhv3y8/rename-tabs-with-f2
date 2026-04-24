<script lang="ts">
import HorizontalLine from "@infra/ui/components/HorizontalLine.svelte"
import Key from "@infra/ui/components/Key.svelte"
import Popover from "@infra/ui/components/Popover.svelte"
import ConflictItem from "./ConflictItem.svelte"
import { conflictModal } from "../states/conflictModal.svelte"
import { getInjections } from "@adapters/ui/injections"

// let { onclose } = $props()
let { setting } = getInjections()
</script>

<!-- HTML -->

<Popover
  onclose={() => {
    // blink cancel button
    conflictModal.cancel()
  }}
  padding={"0.6em"}
  zIndex={101}
>
  <ul id="handleConflictModalContent" class="p-0 list-none">
    <!--  -->
    <Key
      props={{
        fontSize: "18px",
        padding: "0.4em",
        shadow: "small",
        onclick: () => {
          conflictModal.cancel()
        },
      }}
    >
      {chrome.i18n.getMessage("settings_cancel")}
    </Key>

    <!-- <HorizontalLine marginBlock={"0.2em"} /> -->

    <p class="text-lg font-[Ubuntu]">
      {chrome.i18n.getMessage("settings_resolve_conflicts")}
    </p>

    <div class="selectAllExistingOrUploaded w-full flex gap-[0.3em]">
      <Key
        props={{
          fontSize: "15px",
          padding: "0.4em",
          shadow: "small",
          point: setting.pointColor,
          isKeyDown: conflictModal.isSelectingAllExisting,
          onclick: () => {
            for (let i = 0; i < conflictModal.conflictStates.length; i++) {
              if (conflictModal.conflictStates[i].isUploadSelected)
                conflictModal.conflictStates[i].isUploadSelected = false
            }
          },
        }}
      >
        {chrome.i18n.getMessage("settings_resolve_conflicts_all_existing")}
      </Key>

      <Key
        props={{
          fontSize: "15px",
          padding: "0.4em",
          shadow: "small",
          point: setting.pointColor,
          isKeyDown: conflictModal.isSelectingAllUploaded,
          onclick: () => {
            for (let i = 0; i < conflictModal.conflictStates.length; i++) {
              if (!conflictModal.conflictStates[i].isUploadSelected)
                conflictModal.conflictStates[i].isUploadSelected = true
            }
          },
        }}
      >
        {chrome.i18n.getMessage("settings_resolve_conflicts_all_uploaded")}
      </Key>
    </div>

    <HorizontalLine marginBlock={"0.2em"} style={"dotted"} />

    <ul id="conflictItems" class="p-0 list-none">
      {#each conflictModal.conflictStates as conflictState}
        <ConflictItem {conflictState} />
      {/each}
    </ul>

    <HorizontalLine marginBlock={"0.2em"} />

    <Key
      props={{
        fontSize: "18px",
        padding: "0.6em",
        shadow: "small",
        onclick: () => {
          conflictModal.done()
        },
      }}
    >
      {chrome.i18n.getMessage("settings_done")}
    </Key>
  </ul>
</Popover>

<!-- Style -->

<style>
ul#handleConflictModalContent {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.4em;

  min-width: 18em;

  & :global(button:hover) {
    cursor: pointer;
  }
}

ul#conflictItems {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  gap: 0.5em;

  max-width: 27rem;
  max-height: 50vh;
  overflow-y: scroll;
  overflow-x: hidden;

  padding-right: 0.35em;
  &::-webkit-scrollbar {
    width: 0.4rem;
    background-color: var(--shadow-1);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--shadow-9);
    border: 2px solid var(--shadow-9);
  }
}

.selectAllExistingOrUploaded > :global(button) {
  /* width: 50%; */
  flex: 1 0 0;
  min-width: 0;
}
</style>
