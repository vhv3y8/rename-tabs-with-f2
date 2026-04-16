<script>
import { tabInfoStore } from "./impl/tabInfo.svelte"
</script>

<!-- HTML -->

<ul>
  {#each Object.values(tabInfoStore) as tabInfo, idx}
    <TabItem bind:this={allTabItems[idx]} {tabInfo} />
  {/each}
</ul>
