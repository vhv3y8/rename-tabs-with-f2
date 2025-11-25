<script>
import { fade, scale } from "svelte/transition"
import { removeToast } from "../../lib/ui/states/toasts.svelte"

let { text, id } = $props()
</script>

<!-- HTML -->

<button
  type="button"
  onclick={(e) => {
    removeToast(id)
  }}
  in:scale={{ start: 0.9 }}
  out:fade={{ duration: 200 }}
>
  <p>{text}</p>
</button>

<!-- CSS -->

<style>
button {
  pointer-events: auto;

  font-size: 1rem;
  padding: 0.8em;

  text-align: left;

  border: none;
  outline: none;

  background-color: var(--bg);
  border: 2px solid var(--shadow-9);
  color: var(--primary-9);

  &:hover {
    cursor: pointer;
  }
}

p {
  margin: 0;
  padding: 0;

  font-family: "Ubuntu";
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>
