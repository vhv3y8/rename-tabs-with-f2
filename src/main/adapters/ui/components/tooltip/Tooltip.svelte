<script lang="ts">
import { onMount } from "svelte"
import { cubicIn, cubicOut } from "svelte/easing"
import { fade } from "svelte/transition"

let { content } = $props()

onMount(() => {})
</script>

<!-- HTML -->

<div
  class="tooltip"
  in:fade={{ duration: 0.1, easing: cubicIn }}
  out:fade={{ duration: 0.1, easing: cubicOut }}
>
  {content}
</div>

<!-- Style -->

<style>
div.tooltip {
  position: absolute;
  pointer-events: none;
  opacity: 0.9;

  font-family: "Ubuntu";
  font-size: 15px;
  padding: 0.4em;
  border: 2px solid var(--primary-9);
  background-color: var(--bg);
  box-shadow: 0 0 2px var(--bg);
}
</style>
