<script>
import { fade, fly, scale } from "svelte/transition"
import { removeToast } from "../../lib/ui/states/toasts.svelte"

let { text, id } = $props()
</script>

<!-- HTML -->

<button
  type="button"
  class="toast"
  onclick={(e) => {
    removeToast(id)
  }}
  in:fly={{ y: "5px" }}
  out:fade={{ duration: 300 }}
>
  {#each text.split("\n") as line}
    <p>{line}</p>
  {/each}
</button>

<!-- CSS -->

<style>
button {
  pointer-events: auto;

  display: flex;
  flex-flow: column nowrap;
  gap: 0.4em;

  font-size: 1rem;
  padding: 1em;

  text-align: left;

  border: none;
  outline: none;

  background-color: var(--bg);
  border: 2px solid var(--primary-7);
  color: var(--primary-9);
  box-shadow: 2px 2px var(--primary-7);
}

button:hover {
  cursor: pointer;
}

p {
  margin: 0;
  padding: 0;

  font-family: "Ubuntu";
  font-size: 1rem;
  line-height: 1.4;
}
</style>
