---
outline: deep
---

# @shikijs/rehype

<Badges name="@shikijs/rehype" />

适用于 [rehype](https://github.com/rehypejs/rehype) 的 Shiki 插件。

## 安装

::: code-group

```sh [npm]
npm i -D @shikijs/rehype
```

```sh [yarn]
yarn add -D @shikijs/rehype
```

```sh [pnpm]
pnpm add -D @shikijs/rehype
```

```sh [bun]
bun add -D @shikijs/rehype
```

:::

## 使用方法

```ts twoslash
// @noErrors: true
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShiki, {
    // 也可以是只有单个主题的 `theme` 字段
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    }
  })
  .use(rehypeStringify)
  .process(await fs.readFile('./input.md'))
```

`@shikijs/rehype` 的默认导出使用了 来自 `getSingletonHighlighter` 的共享的 `shiki` 实例，在整个进程中存在。如果你想要完全控制高亮器的生命周期，使用 [细粒度捆绑 `@shikijs/rehype/core`](#细粒度捆绑)。

## 细粒度捆绑

默认情况下会导入完整的 `shiki` 捆绑包。如果你使用了 [细粒度捆绑](/guide/bundles#细粒度捆绑)，你可以从 `@shikijs/rehype/core` 中导入 `rehypeShikiFromHighlighter` 并传入你自己的高亮器：

```ts twoslash
// @noErrors: true
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { createHighlighterCore } from 'shiki/core'

import { unified } from 'unified'

const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/vitesse-light.mjs')
  ],
  langs: [
    import('@shikijs/langs/javascript.mjs'),
  ],
  loadWasm: import('shiki/wasm')
})

const raw = await fs.readFile('./input.md')
const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShikiFromHighlighter, highlighter, {
    // 也可以是只有单个主题的 `theme` 字段
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    }
  })
  .use(rehypeStringify)
  .processSync(raw) // 也可以同步处理
```

## 功能

### 行高亮

::: warning 警告
已废弃，在 `v0.10.0` 版本中已被默认禁用，并会在下一个次版本（minor）中移除。应该考虑使用 [`transformerNotationHighlight`](/packages/transformers#transformernotationhighlight)。
:::

除了支持 `shiki` 的功能以外，此插件还支持行的高亮。你可以以 `{<line-numbers>}` 的格式在代码块语言标注后指定你要高亮的行；以逗号分隔行号（`<line-number>`），并用大括号包裹。每一个行号可以是一个单独的数（如 `{2}` 会高亮第 2 行， `{1,4}` 会高亮第 1 行和第 4 行），或者指定一个范围（如 `{5-7}` 会高亮第 5 到第 7 行，`{1-3,5-6}` 会高亮第 1 行到第 3 行，及第 5 行到第 6 行）。 例如：

````md
```js {1,3-4}
console.log('1') // 高亮
console.log('2')
console.log('3') // 高亮
console.log('4') // 高亮
```
````

### 行内代码

您也可以使用 `inline` 选项对行内代码进行高亮。

| 选项                    | 示例             | 描述                                      |
| ----------------------- | ---------------- | ----------------------------------------- |
| `false`                 | -                | 禁用行内代码高亮（默认）                  |
| `'tailing-curly-colon'` | `let a = 1{:js}` | 使用 `{:language}` 标记在代码块中进行高亮 |

在 Rehype 插件中启用 `inline`：

```ts twoslash
// @noErrors: true
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShiki, {
    inline: 'tailing-curly-colon', // 或其他选项
    // ...
  })
  .use(rehypeStringify)
  .process(await fs.readFile('./input.md'))
```

然后，您可以在 Markdown 中使用行内代码：

```md
此代码 `console.log("Hello World"){:js}` 将被高亮显示。
```
