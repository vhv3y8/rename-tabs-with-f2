import type { runBootstrap } from "@main/bootstrap"
import { createContext } from "svelte"

// injections are set from App.svelte
export const [getInjections, setInjectionsContext] =
  createContext<Awaited<ReturnType<typeof runBootstrap>>>()
