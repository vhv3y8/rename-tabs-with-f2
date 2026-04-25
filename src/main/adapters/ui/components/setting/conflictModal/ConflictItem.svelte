<script lang="ts">
import Key from "@infra/ui/components/Key.svelte"
import type { ConflictState } from "../states/conflictModal.svelte"
import { getInjections } from "@adapters/ui/injections"

let { conflictState }: { conflictState: ConflictState } = $props()
let { setting } = getInjections()
</script>

<!-- HTML -->

<li class="conflictItem">
  <p class="urlMatch">
    <span>{conflictState.urlMatch}</span>
  </p>

  <div class="existingOrUploaded flex gap-[0.4em]">
    <Key
      props={{
        isKeyDown: !conflictState.isUploadSelected,
        point: setting.pointColor,
        padding: "0.4em 0",
        fontSize: "16px",
        shadow: "small",
        onclick: () => {
          conflictState.isUploadSelected = false
        },
      }}
    >
      <span class="title">{conflictState.existing.title}</span>
    </Key>

    <Key
      props={{
        isKeyDown: conflictState.isUploadSelected,
        point: setting.pointColor,
        padding: "0.4em 0",
        fontSize: "16px",
        shadow: "small",
        onclick: () => {
          conflictState.isUploadSelected = true
        },
      }}
    >
      <span class="title">{conflictState.uploaded.title}</span>
    </Key>
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
  /* font-size: 14px;
  padding: 0.4em; */
  font-size: 15px;
  padding: 0.4em;
  font-family: "Ubuntu";

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;

  /* direction: rtl;
  text-align: left; */

  /* border: 2px solid var(--primary-8); */
  border: 2px solid transparent;
  /* background: var(--primary-8);
  color: var(--bg); */
  background: var(--shadow-1);
  color: var(--primary-9);
  /* border-radius: 1px; */
  /* box-shadow: 0 0 2px var(--primary-8); */
}
.existingOrUploaded {
  & :global(button.key:has(.keyInner)) {
    /* width: 50%; */
    flex: 1 0 0;
    min-width: 0;
  }
  & :global(.keyInner) {
    height: stretch;
  }

  & :global(.title) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: calc(100% - 1.5em);
  }
}
</style>
