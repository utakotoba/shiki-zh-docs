---
outline: deep
---

# 最佳性能实践

本指南将帮助你提高 Shiki 的性能。

## 缓存 Highlighter 实例

创建 highlighter 实例的开销很大。大多数情况下，你应该创建一次 highlighter 实例，并将其复用于多个高亮操作（单例模式）。

例如：

```ts
import { createHighlighterCore } from 'shiki/core'

const highlighterPromise = createHighlighterCore({ /* ... */ })

export async function highlightCode(code: string, lang: string) {
  const highlighter = await highlighterPromise
  return highlighter.codeToHtml(code, lang)
}
```

当你不再需要 highlighter 实例时，可以调用 `dispose()` 方法来释放资源。（它不会被自动 GC 回收，你需要显式地执行此操作。）

```ts
highlighter.dispose()
```

## 细粒度打包

预构建的 bundle 方便使用，主要用于 Node.js 环境，在这种环境下你不用担心 bundle 大小。如果你正在构建 Web 应用程序或在资源受限的环境中，最好使用细粒度 bundle 来减小 bundle 大小和内存使用量。

**避免直接导入 `shiki`、`shiki/bundle/full`、`shiki/bundle/web`。**

而是导入细粒度模块，例如 `shiki/core`、`shiki/engine/javascript`、`@shikijs/langs/typescript`、`@shikijs/themes/dark-plus` 等。

```ts
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/nord'),
    import('@shikijs/themes/dark-plus'),
    // ...
  ],
  langs: [
    import('@shikijs/langs/typescript'),
    import('@shikijs/langs/javascript'),
    // ...
  ],
  engine: createJavaScriptRegexEngine()
})
```

为了方便地组合细粒度 bundle，我们还提供了 [`shiki-codegen`](/packages/codegen) 工具来为你生成细粒度 bundle。

了解更多关于[细粒度 Bundle](/guide/bundles#fine-grained-bundle)的信息。

## 使用 Shorthands

`createHighlighter` 和 `createHighlighterCore` **预先**加载所有主题和语言，以确保后续的高亮操作是同步的。这会增加启动时间的开销，尤其是在你有大量主题和语言时。Shorthands 抽象了主题和语言的加载过程，并在底层维护一个内部的 highlighter 实例，仅在需要时加载必要的主题和语言。当你的高亮过程可以是异步的时，你可以使用 shorthands 来减少启动时间。

```ts
import { codeToHtml } from 'shiki'

// 调用 `codeToHtml` 时，只会加载 `javascript` 和 `nord`
const html = await codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'nord'
})
```

你也可以使用细粒度 bundle 创建自己的 shorthands。有关更多详细信息，请查看[使用细粒度 Bundle 创建 Shorthands](/guide/shorthands#create-shorthands-with-fine-grained-bundles) 部分。

## JavaScript 引擎和预编译语言

Shiki 提供了[两种引擎](/guide/regex-engines)来执行正则表达式：[`JavaScript`](/guide/regex-engines#javascript-regexp-engine) 和 [`Oniguruma`](/guide/regex-engines#oniguruma-engine)。Oniguruma 引擎基于 WebAssembly，由 C 代码编译而来，`JavaScript` 是一个纯 JavaScript 引擎，它将 Oniguruma 风格的正则表达式转换为 JavaScript 正则表达式。

如果你正在为 Web 打包 Shiki，使用 JavaScript 引擎会减小 bundle 大小并加快启动时间。[预编译语言](/guide/regex-engines#pre-compiled-languages) 可以进一步减少 bundle 大小和启动时间（如果你的目标浏览器支持最新的 RegExp 功能）。

有关更多详细信息，请查看 [RegExp 引擎](/guide/regex-engines) 指南。

## 使用 Workers

Shiki 使用正则表达式高亮代码，这可能是 CPU 密集型的。你可以将高亮工作卸载到 Web Worker/Node Worker，以避免阻塞主线程。

::: info

🚧 我们仍在努力编写一个方便创建 workers 的指南。

:::
