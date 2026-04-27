<script lang="ts">
import Tooltip from "./Tooltip.svelte"
import { tooltips } from "./tooltips.svelte"
</script>

<!-- HTML -->

{#each tooltips.list as tooltip}
  <Tooltip content={tooltip.content} />
{/each}

<!-- Style -->

<style>
</style>
