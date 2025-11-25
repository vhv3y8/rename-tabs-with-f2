import postcss from "postcss"
import fs from "node:fs/promises"
import path from "node:path"

export const dsCssPath = path.resolve("src/main/style/ds.css")

export async function postcssParseFile(path) {
  const css = await fs.readFile(path, "utf-8")
  const root = postcss.parse(css)
  return root
}

export function getDSVar({ postRoot, varName, darkmode }) {
  let value = null
  const selector = `:root${darkmode ? ".dark" : ""}`

  postRoot.walkRules((rule) => {
    if (rule.selector === selector) {
      rule.walkDecls((decl) => {
        if (decl.prop === `--${varName}`) {
          value = decl.value
        }
      })
    }
  })

  return value
}
