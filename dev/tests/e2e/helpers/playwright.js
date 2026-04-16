export async function gotoPages({
  context,
  page,
  urls,
  synchronously = false,
}) {
  if (synchronously) {
    await page.goto(urls[0])
    for (const url of urls.slice(1)) {
      const newPage = await context.newPage()
      await newPage.goto(url)
    }
  } else {
    return Promise.all([
      page.goto(urls[0]),
      ...urls.slice(1).map(async (u) => {
        const newPage = await context.newPage()
        return newPage.goto(u)
      }),
    ])
  }
}

// export async function createContextAndGetSW({
//   createPersistent,
//   extensionFolder,
// }) {
//   const context = await createPersistent(extensionFolder)
//   context.on("serviceworker", (worker) => {
//     worker.on("console", (msg) => {
//       console.log("[EXT SW]", msg.text())
//     })
//   })

//   const extensionSW = await getServiceWorker({ context })

//   return { context, extensionSW }
// }

// export async function getServiceWorker({ context }) {
//   let [serviceWorker] = context.serviceWorkers()
//   if (!serviceWorker)
//     serviceWorker = await context.waitForEvent("serviceworker")

//   return serviceWorker
// }
