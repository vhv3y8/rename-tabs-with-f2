<script>
import {
  appendToast,
  toastList,
  messages,
} from "../lib/ui/states/toasts.svelte"
import Toast from "./common/Toast.svelte"
</script>

<!-- HTML -->

<ul id="globalToastGrid">
  {#each toastList as toastItem (toastItem.id)}
    <Toast text={toastItem.text} id={toastItem.id} />
  {/each}
</ul>

<!-- <button
  type="button"
  onclick={() => {
    console.log("CLICK!")
    appendToast(messages.SHORTCUT_UPDATED("Ctrl + Shift + F2"))
  }}
>
  Click
</button> -->

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
