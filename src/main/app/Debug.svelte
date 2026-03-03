<script>
import {
  getContentScriptUnavailableTabs,
  tabIdxToInfo,
} from "../lib/application/tabInfo.svelte"
import {
  getAllReloadingTabStatus,
  getAllTabStatus,
} from "../lib/ui/states/tabs/reload.svelte"
import { getRefreshAndBrowserUnavailableTabs } from "../lib/ui/states/tabs/unavailableCard.svelte"
</script>

<!-- <pre>
    {JSON.stringify(
      { browserUnavailableTabs, refreshUnavailableTabs },
      null,
      2,
    )}
  </pre>

  <pre>
    {JSON.stringify(allTabStatus, null, 2)}
  </pre>

  <pre>
    {JSON.stringify(everyTabStatusIsComplete, null, 2)}
  </pre> -->
<!-- <pre>{JSON.stringify(
    Object.values(tabIdxToInfo).filter(
      ({ contentScriptAvailable }) => !contentScriptAvailable,
    ),
    null,
    2,
    )}</pre> -->
<pre>allReloadingTabStatus: {JSON.stringify(
    getAllReloadingTabStatus(),
    null,
    2,
  )}</pre>

<!-- <pre>{JSON.stringify(getRefreshAndBrowserUnavailableTabs(), null, 2)}</pre> -->
