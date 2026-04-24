<script lang="ts">
import Key from "@infra/ui/components/Key.svelte"
import type { ConflictState } from "../states/conflictModal.svelte"
import { getInjections } from "@adapters/ui/injections"

let { conflictState }: { conflictState: ConflictState } = $props()
let { setting } = getInjections()
</script>

<!-- HTML -->

<li class="conflictItem">
  <div class="urlMatch">{conflictState.urlMatch}</div>

  <div class="existingOrUploaded flex gap-[0.4em]">
    <Key
      props={{
        isKeyDown: !conflictState.isUploadSelected,
        point: setting.pointColor,
        padding: "0.25em 0",
        fontSize: "15px",
        shadow: "small",
        onclick: () => {
          conflictState.isUploadSelected = false
        },
      }}>{conflictState.existing.title}</Key
    >

    <Key
      props={{
        isKeyDown: conflictState.isUploadSelected,
        point: setting.pointColor,
        padding: "0.25em 0",
        fontSize: "15px",
        shadow: "small",
        onclick: () => {
          conflictState.isUploadSelected = true
        },
      }}>{conflictState.uploaded.title}</Key
    >
  </div>
</li>

<!-- Style -->

<style>
li.conflictItem {
  width: 100%;
  /* border-top: 2px dotted var(--primary-7); */
  /* padding-block: 0.5em; */
  /* padding-top: 0.8em; */
  /* padding-top: 0.4em; */
  font-size: 16px;

  display: flex;
  flex-flow: column nowrap;
  gap: 0.4em;
}

.urlMatch {
  font-size: 14px;
  padding: 0.4em;
  font-family: "Ubuntu";
  text-overflow: ellipsis;

  border: 2px solid var(--primary-7);
}
.existingOrUploaded {
  & :global(button.key:has(.keyInner)) {
    width: 50%;
  }
  & :global(.keyInner) {
    height: stretch;
  }
}
</style>
