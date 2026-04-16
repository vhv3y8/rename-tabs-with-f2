<script>
import { tabInfoStore } from "./impl/tabInfo.svelte"
import { tabComponents } from "./states/tabComponents.svelte"
</script>

<!-- HTML -->

<ul>
  {#each Object.values(tabInfoStore) as tabInfo, idx}
    <TabItem bind:this={tabComponents.components[idx]} {tabInfo} />
  {/each}
</ul>
