export function waitUntil(getter: () => any, targetValue: any) {
  return new Promise((resolve) => {
    $effect.root(() => {
      $effect(() => {
        if (getter() === targetValue) {
          resolve(getter())
        }
      })
    })
  })
}
