<!-- Darkmode -->
<!-- <li>
      <span>{chrome.i18n.getMessage("settings_darkmode")} :</span>
      <Key
        props={{
          onclick: () => {
            settingModal.settings.darkmode = !settingModal.settings.darkmode
            view.applyDarkModeUI({ darkmode: settingModal.settings.darkmode })
          },
        }}>{settingModal.settings.darkmode}</Key
      >
    </li> -->

<!-- Larger Width -->
<!-- <li>
      <span>{chrome.i18n.getMessage("settings_larger_width")} :</span>
      <Key
        onclick={async () => {
          settingModal.settings.largerWidth = !settingModal.settings.largerWidth
          view.applyLargerWidth({
            largerWidth: settingModal.settings.largerWidth,
          })
        }}>{settingModal.settings.largerWidth}</Key
      >
    </li> -->

<!-- Shortcut -->
<li class="col">
  <p><span>{chrome.i18n.getMessage("settings_shortcut")} :</span></p>

  {#if !settingModal.listen}
    <Key
      id={"shortcutBtn"}
      padding={""}
      onclick={() => {
        settingModal.startListening()
      }}>{settingModal.shortcutText}</Key
    >
  {:else}
    <!-- Listening / shortcutText -->
    <div class="listenShortcutText">
      <p id="listening">
        {chrome.i18n.getMessage("settings_shortcut_listening")}...
      </p>

      <p id="shortcutText">
        {localShortcutText}
      </p>
    </div>

    <!-- Reset to F2 -->
    <div class="resetToF2Container">
      <Key
        id={"resetToF2"}
        padding={"0.4em 0.5em"}
        onclick={() => {
          localShortcut = ChromeMainFacadeImpl.defaultShortcutF2
          settingModal.settings.shortcut = localShortcut
          settingModal.endListening()
          pushToast()
        }}>{chrome.i18n.getMessage("settings_shortcut_reset_to_f2")}</Key
      >
    </div>

    <!-- Cancel / OK -->
    <div class="listenCancelOk">
      <Key
        id={"cancelBtn"}
        padding={"0.4em 0.5em"}
        onclick={() => {
          settingModal.endListening()
          localShortcut = settingModal.settings.shortcut
        }}>{chrome.i18n.getMessage("settings_shortcut_cancel")}</Key
      >

      <Key
        id={"okBtn"}
        padding={"0.4em 0.5em"}
        onclick={() => {
          console.log("[localShortcut]", localShortcut)
          settingModal.settings.shortcut = localShortcut
          settingModal.endListening()
          pushToast()
        }}>{chrome.i18n.getMessage("settings_shortcut_ok")}</Key
      >
    </div>
  {/if}
</li>
