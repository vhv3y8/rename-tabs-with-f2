<script lang="ts">
import { onMount } from "svelte"
// import { cubicIn, cubicOut } from "svelte/easing"
// import { fade } from "svelte/transition"
import type { TooltipItem } from "./tooltips.svelte"

let { tooltip }: { tooltip: TooltipItem } = $props()

onMount(() => {})
</script>

<!-- HTML -->

<!-- in:fade={{ duration: 1, easing: cubicIn }}
  out:fade={{ duration: 1, easing: cubicOut }} -->

<div
  bind:this={tooltip.tooltipElem}
  class="tooltip"
  style:max-width={`calc(${tooltip.parentClientWidth}px + 0.5em)`}
>
  <p class="m-0 p-0">{tooltip.content}</p>
</div>

<!-- Style -->

<style>
div.tooltip {
  position: absolute;
  pointer-events: none;
  opacity: 0.85;

  font-family: "Ubuntu";
  font-size: 15px;
  padding: 0.4em;
  border: 2px solid var(--primary-9);
  background-color: var(--bg);
  box-shadow: 0 0 2px var(--bg);

  /* max-width: 15em; */
  white-space: normal;
  word-break: break-all;
  overflow-wrap: break-word;

  z-index: 200;
}
</style>
