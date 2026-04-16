import { execSync } from "node:child_process"

function log(message) {
  console.log(`[global-setup.js] ${message}`)
}

export default () => {
  log("run 'pnpm build', 'DIST2=true pnpm build' before e2e testing...")

  try {
    execSync("pnpm build", { stdio: "ignore" })
    execSync("DIST2=true pnpm build", { stdio: "ignore" })
  } catch (e) {
    console.error(e.toString())
    throw e
  }

  log("build done")
}
