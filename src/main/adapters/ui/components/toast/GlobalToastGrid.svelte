<script lang="ts">
import { getInjections } from "../../injections"
import ToastItem from "./ToastItem.svelte"

const { toasts } = getInjections()
</script>

<!-- HTML -->

<ul id="globalToastGrid">
  {#each toasts.getAll() as toastItem (toastItem.id)}
    <ToastItem content={toastItem.content} id={toastItem.id} />
  {/each}
</ul>

<!-- Style -->

<style>
ul#globalToastGrid {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 100;

  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-flow: column wrap;
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
  grid-auto-flow: column;
  grid-template-rows: repeat(5, max-content);
  direction: rtl;
  gap: 0.5em;

  pointer-events: none;

  & > :global(*) {
    direction: ltr;

    max-width: 30rem;

    margin-top: 1em;
    margin-right: 1em;
  }
}
</style>
