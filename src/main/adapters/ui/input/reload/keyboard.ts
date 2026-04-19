export async function keydownReloadUseCaseHandler(e: KeyboardEvent) {
  if (
    e.code === "KeyR" &&
    e.shiftKey &&
    notConnectedCard.show &&
    0 < notConnected.reloadConnectableTabs.length
  ) {
    e.preventDefault()
    await fireReload()
  }
}
