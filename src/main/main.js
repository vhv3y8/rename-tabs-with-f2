import { mount } from "svelte"
import App from "./App.svelte"

const app = mount(App, {
  target: document.getElementById("app"),
})

/* Log Credits */

const credits = [
  {
    preMessage: "Default favIcon Globe Svg",
    link: "https://www.svgrepo.com/svg/507722/globe-alt",
    author: "https://www.svgrepo.com/author/scarlab/",
    license: "MIT License",
  },
]

for (const credit of credits) {
  console.log(
    `${credit.preMessage} is from\n\n${credit.link}\n\nBy ${credit.author}\n\nUnder ${credit.license}`,
  )
}

export default app
