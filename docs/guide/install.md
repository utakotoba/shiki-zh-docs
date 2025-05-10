---
outline: deep
---

# 安装 & 使用

<Badges name="shiki" />

# 安装

你可以使用包管理器或 [使用 CDN](#使用-cdn) 进行安装：
::: code-group

```sh [npm]
npm install -D shiki
```

```sh [yarn]
yarn add -D shiki
```

```sh [pnpm]
pnpm add -D shiki
```

```sh [bun]
bun add -D shiki
```

:::

## 集成

我们也提供了一些集成以便你使用：

- [markdown-it 插件](/packages/markdown-it)
- [Rehype 插件](/packages/rehype)
- [TypeScript Twoslash 插件](/packages/twoslash)
- [Monaco Editor 语法高亮](/packages/monaco)
- [CLI](/packages/cli)
- [常用转换器（Transformers）](/packages/transformers)

## 使用方法

### 简写

使用 `shiki` 的最快方式是调用简写函数。它会根据你的需要加载主题和语言，并将其自动缓存到内存中。

将你的代码片段传给 `codeToHtml` 函数并指定 `lang` 和 `theme` 选项，它将返回一个带有语法高亮的 HTML 字符串，你可以将其嵌入到页面中。生成的 HTML 中，每个标签都有相应的内联样式，因此你不需要额外的 CSS 来进行样式设置。

```ts twoslash
import { codeToHtml } from 'shiki'

const code = 'const a = 1' // 输入代码片段
const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'vitesse-dark'
})

console.log(html) // 带有高亮显示的 HTML 字符串
```

更进一步，你还可以使用 `codeToTokens` 或 `codeToHast` 函数来获取中间数据结构，并自行渲染它们：

```ts twoslash theme:min-dark
import { codeToTokens } from 'shiki'

const { tokens } = await codeToTokens('<div class="foo">bar</div>', {
  lang: 'html',
  theme: 'min-dark'
})
```

```ts twoslash theme:catppuccin-mocha
import { codeToHast } from 'shiki'

const hast = await codeToHast('.text-red { color: red; }', {
  lang: 'css',
  theme: 'catppuccin-mocha'
})
```

### 高亮器用法

因为 Shiki 使用了 WASM，所以提供的 [简写](#简写) 函数是异步执行的，并在其内部按需加载主题和语言。在某些情况下，你可能需要同步地高亮代码，因此我们提供了 `createHighlighter` 函数来创建一个可以在后续同步使用的高亮器实例。

使用方式与 `codeToHtml` 函数几乎相同，其中，每个主题和语言都是动态导入的 ES 模块，最好显式地列出语言和主题以获得最佳性能。

```ts twoslash theme:nord
import { createHighlighter } from 'shiki'

// `createHighlighter` 是异步的，它会初始化高亮器
// 并加载指定的语言和主题。
const highlighter = await createHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
})

// 然后你就可以同步地使用 `highlighter.codeToHtml`
// 并使用你指定的其中一个主题和语言。
const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'nord'
})
```

:::info 重要注意
高亮器实例应该 **持续且唯一存在**。你或许应该在某些地方缓存它，并在整个应用程序范围内复用。避免在热函数或者循环中调用 `createHighlighter`。

如果你在 Node.js 上运行，我们建议使用 [简写](#简写)，它会为你管理高亮器并动态加载语言和主题。
:::

此外，如果你要在创建高亮器后加载主题和语言，可以使用 `loadTheme` 和 `loadLanguage` 方法。

```ts twoslash
import { createHighlighter } from 'shiki'
const highlighter = await createHighlighter({ themes: [], langs: [] })
// ---cut---
// 在创建后加载主题和语言
await highlighter.loadTheme('vitesse-light')
await highlighter.loadLanguage('css')
```

自 v1.0 起，`shiki` 要求所有的主题和语言都被显式地加载。

```ts theme:slack-dark twoslash
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  themes: ['slack-dark'],
  langs: ['css']
})

highlighter.codeToHtml(
  'const a = 1',
  { lang: 'javascript', theme: 'slack-dark' }
)
// @error: Throw error, `javascript` is not loaded

await highlighter.loadLanguage('javascript') // 载入语言

// 正常工作
```

如果你想一次加载所有主题和语言（并不建议），你可以遍历 `bundledLanguages` 和 `bundledThemes` 中的所有键。

```ts twoslash theme:poimandres
import { bundledLanguages, bundledThemes, createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  themes: Object.keys(bundledThemes),
  langs: Object.keys(bundledLanguages),
})

highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'poimandres'
})
```

### 细粒度捆绑

导入 `shiki` 时，所有的主题和语言都被捆绑为异步块（async chunks）。通常情况下，如果你不使用它们，你就不必在意，因为它们不会被加载。某些情况下，如果你要控制这些捆绑包的内容，你可以使用核心（`shiki/core`）来组合自己的捆绑包。

查看 [细粒度捆绑](/guide/bundles#细粒度捆绑) 部分获取更多细节。

### 预设捆绑包

为了方便使用，我们还提供了一些预制的捆绑包，你可以在 [捆绑包](/guide/bundles) 部分了解更多的信息。

### 使用 CJS

为了减小包的大小，`shiki` 以仅 ESM 的形式发布。但由于 Node.js 支持在 CJS 中动态导入 ESM 模块，你仍可以在 CJS 中使用 Shiki。

例如以下 ESM 代码：

```ts twoslash
// ESM
import { createHighlighter } from 'shiki'

async function main() {
  const highlighter = await createHighlighter({
    themes: ['vitesse-dark'],
    langs: ['javascript'],
  })

  const code = highlighter.codeToHtml('const a = 1', {
    theme: 'vitesse-dark',
    lang: 'javascript',
  })
}
```

可以在 CJS 中写成：

```ts twoslash
// CJS
async function main() {
  const { createHighlighter } = await import('shiki')

  const highlighter = await createHighlighter({
    themes: ['vitesse-dark'],
    langs: ['javascript'],
  })

  const code = highlighter.codeToHtml('const a = 1', {
    theme: 'vitesse-dark',
    lang: 'javascript'
  })
}
```

### 使用 CDN

要在浏览器中通过 CDN 来使用 `shiki`，你可以使用 [esm.run](https://esm.run) 或者 [esm.sh](https://esm.sh) 等服务。

```html theme:rose-pine
<body>
  <div id="foo"></div>

  <script type="module">
    // 指定确切的版本号
    import { codeToHtml } from 'https://esm.sh/shiki@3.0.0'
    // 或
    // import { codeToHtml } from 'https://esm.run/shiki@3.0.0'

    const foo = document.getElementById('foo')
    foo.innerHTML = await codeToHtml('console.log("Hi, Shiki on CDN :)")', {
      lang: 'js',
      theme: 'rose-pine'
    })
  </script>
</body>
```

这非常高效，因为它只会按需加载语言和主题。对于上面的代码片段，只会发出四个请求（`shiki`、`@shikijs/themes/vitesse-light`、`@shikijs/langs/javascript` 和 `shiki/wasm.mjs`），共计传输约 200KB 的数据。

[查看示例](https://jsfiddle.net/t7brz23v/)

### Cloudflare Workers

Cloudflare Workers [不支持从二进制数据初始化 WebAssembly](https://community.cloudflare.com/t/fixed-cloudflare-workers-slow-with-moderate-sized-webassembly-bindings/184668/3)，因此默认的 WASM 构建将无法工作。你需要将 WASM 作为资产上传并直接导入。

同时，建议使用 [细粒度捆绑](#细粒度捆绑) 来减小捆绑的体积。

```ts twoslash theme:nord
// @noErrors
import js from '@shikijs/langs/javascript'
import nord from '@shikijs/themes/nord'
import { createHighlighterCore, loadWasm } from 'shiki/core'

// 将 WASM 作为资产导入
await loadWasm(import('shiki/onig.wasm'))

export default {
  async fetch() {
    const highlighter = await createHighlighterCore({
      themes: [nord],
      langs: [js],
    })

    return new Response(highlighter.codeToHtml('console.log(\'shiki\');', {
      theme: 'nord',
      lang: 'js'
    }))
  },
}
```
