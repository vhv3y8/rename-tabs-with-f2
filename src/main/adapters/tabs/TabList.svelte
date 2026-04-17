<script lang="ts">
import { tabIdxInfoStore } from "./impl/tabInfo.svelte"
import { tabItemComponents } from "./states/tabItemComponents.svelte"
import TabItem from "./TabItem.svelte"
</script>

<!-- HTML -->

<ul>
  {#each Object.values(tabIdxInfoStore) as tabInfo, idx}
    <TabItem bind:this={tabItemComponents.components[idx]} {tabInfo} />
  {/each}
</ul>
