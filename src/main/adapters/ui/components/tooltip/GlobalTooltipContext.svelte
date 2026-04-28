<script lang="ts">
import Tooltip from "./Tooltip.svelte"
import { tooltips } from "./tooltips.svelte"
</script>

<!-- HTML -->

{#each Object.values(tooltips.record) as tooltip (tooltip.id)}
  <Tooltip {tooltip} />
{/each}

<!-- Style -->

<style>
</style>
