import { mount } from "svelte"
import App from "./App.svelte"
import "./style/style.css"
import "./style/fonts.css"
import "./style/ds.css"

const app = mount(App, {
  target: document.getElementById("app"),
})

/* Log Credits */

const credits = [
  {
    what: "Default favIcon Globe Svg",
    link: "https://www.svgrepo.com/svg/507722/globe-alt",
    author: "scarlab (https://www.svgrepo.com/author/scarlab/)",
    license: "MIT License",
  },
]

for (const credit of credits) {
  console.log(
    `%c${credit.what} %cis from\n\n${credit.link}\n\nBy ${credit.author}\n\nUnder %c${credit.license}`,
    "font-size: 18px; color: crimson;",
    "font-size: 18px;",
    "font-size: 18px; color: seagreen;",
  )
}

export default app
