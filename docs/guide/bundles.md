---
outline: deep
---

# 捆绑包

主要的 `shiki` 包入点通过动态导入捆绑了所有支持的主题和语言。大多数情况下，效率应该不成问题，因为语法只有在需要时才会被导入或下载。然而，当你将 shiki 捆绑到浏览器运行时或 Web Worker 中时，即使这些文件没有被导入，它们仍然会增加你的分发大小。我们提供了 [细粒度捆绑](#细粒度捆绑) 以帮助你根据需要逐个组合语言和主题。

::: info
如果你正在构建一个 Web 应用程序，或者在对性能敏感的环境中，最好始终使用[细粒度捆绑](#细粒度捆绑)来减小 bundle 大小和内存使用量。了解更多关于[最佳性能实践](/guide/best-performance)的信息。
:::

# 捆绑包预设

方便起见，我们还提供了一些预制的捆绑包供你使用。

## `shiki/bundle/full`

> [捆绑包大小](/guide/#捆绑包大小): 6.4 MB (minified)，1.3 MB (gzip)，包含异步块

与 `shiki` 相同，这个捆绑包捆绑了所有的主题和语言。

## `shiki/bundle/web`

> [捆绑包大小](/guide/#捆绑包大小): 4.2 MB (minified)，748 KB (gzip)，包含异步块

这个捆绑包捆绑了所有的主题和一些常见的 Web 语言（例如 HTML，CSS，JS，TS，JSON 和 Markdown 等）以及一些框架语法（例如 Vue，JSX 和 Svelte 等）的支持。

该捆绑包中可以使用 `shiki` 的所有功能。

```ts twoslash
import {
  BundledLanguage,
  BundledTheme,
  codeToHtml,
  createHighlighter
} from 'shiki/bundle/web' // [!code highlight]

const highlighter = await createHighlighter({
  langs: ['html', 'css', 'js'],
  themes: ['github-dark', 'github-light'],
})
```

### 细粒度捆绑

导入 `shiki` 时，所有的主题和语言都被捆绑为异步块（async chunks）。通常情况下，如果你不使用它们，你就不必在意，因为它们不会被加载。某些情况下，如果你要控制这些捆绑包的内容，你可以使用核心（`shiki/core`）来组合自己的捆绑包。

```ts twoslash theme:material-theme-ocean
// @noErrors
// directly import the theme and language modules, only the ones you imported will be bundled.
import nord from '@shikijs/themes/nord'

// `shiki/core` 不包含任何主题、语言和 WASM 二进制文件
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

// 直接导入需要的主题和语言模块，只有导入的模块会被捆绑
import nord from 'shiki/themes/nord.mjs'

// `shiki/wasm` 包含以 BASE64 字符串内联的 WASM 二进制文件
import getWasm from 'shiki/wasm'

const highlighter = await createHighlighterCore({
  themes: [
    // 传入导入的包，而不是字符串
    nord,
    // 如果你需要进行块分割（chunk splitting），请使用动态导入
    import('@shikijs/themes/material-theme-ocean')
  ],
  langs: [
    import('@shikijs/langs/javascript'),
    // shiki 会尝试使用模块的默认导出
    () => import('@shikijs/langs/css'),
    // 或者一个返回自定义语法的 getter
    async () => JSON.parse(await fs.readFile('my-grammar.json', 'utf-8'))
  ],
  // `shiki/wasm` contains the wasm binary inlined as base64 string.
  engine: createOnigurumaEngine(import('shiki/wasm'))
})

// 可选的，在创建后加载主题和语言
await highlighter.loadTheme(import('@shikijs/themes/vitesse-light'))

const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'material-theme-ocean'
})
```

::: info 注意
[简写](#简写) 只在 `shiki` 捆绑包中可用。对于细粒度捆绑，你可以使用 [`createSingletonShorthands`](https://github.com/shikijs/shiki/blob/main/packages/core/src/bundle-factory.ts) 来创建一个简写函数或者尝试自己实现。
:::
