# @shikijs/markdown-it

<Badges name="@shikijs/markdown-it" />

用于 Shiki 的 [markdown-it](https://markdown-it.github.io/) 插件。

## 安装

::: code-group

```sh [npm]
npm i -D @shikijs/markdown-it
```

```sh [yarn]
yarn add -D @shikijs/markdown-it
```

```sh [pnpm]
pnpm add -D @shikijs/markdown-it
```

```sh [bun]
bun add -D @shikijs/markdown-it
```

:::

## 用法

```ts twoslash
import Shiki from '@shikijs/markdown-it'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

md.use(await Shiki({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  }
}))
```

## 细粒度 Bundle

默认情况下，将导入 `shiki` 的完整 bundle。如果你使用的是[细粒度 bundle](/guide/bundles#fine-grained-bundle)，你可以从 `@shikijs/markdown-it/core` 导入并传递你自己的 highlighter：

```ts twoslash
// @noErrors: true
import { fromHighlighter } from '@shikijs/markdown-it/core'
import MarkdownIt from 'markdown-it'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/vitesse-light')
  ],
  langs: [
    import('@shikijs/langs/javascript'),
  ],
  engine: createOnigurumaEngine(() => import('shiki/wasm'))
})

const md = MarkdownIt()

md.use(fromHighlighter(highlighter, { /* options */ }))
```

## 使用 Shorthands

Shiki 的 [shorthands](/guide/shorthands) 提供按需加载主题和语言的功能，但也使高亮过程变为异步。不幸的是，`markdown-it` 本身[不支持异步高亮](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md#i-need-async-rule-how-to-do-it)。

为了解决这个问题，你可以使用 [Anthony Fu](https://github.com/antfu) 的 [`markdown-it-async`](https://github.com/antfu/markdown-it-async)。Shiki 也提供了与它的集成，你可以从 `@shikijs/markdown-it/async` 导入 `fromAsyncCodeToHtml`。

````ts twoslash
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import MarkdownItAsync from 'markdown-it-async'
import { codeToHtml } from 'shiki' // 或你的自定义 shorthand bundle

// 使用 markdown-it-async 初始化 MarkdownIt 实例
const md = MarkdownItAsync()

md.use(
  fromAsyncCodeToHtml(
    // 传递 codeToHtml 函数
    codeToHtml,
    {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      }
    }
  )
)

// 使用 `md.renderAsync` 代替 `md.render`
const html = await md.renderAsync('# Title\n```ts\nconsole.log("Hello, World!")\n```')
````
