# Shorthands（简写）

使用提供的速记函数是开始使用 `shiki` 的更简单方法。这些函数将按需加载必要的主题和语言，并自动将其缓存在内存中。与 `createHighlighter` 和 `createHighlighterCore` 不同，这些操作是异步的。

```ts twoslash
import { codeToHtml } from 'shiki'

const code = 'const a = 1' // 输入代码
const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'vitesse-dark'
})

console.log(html) // 高亮后的 html 字符串
```

## 使用细粒度 Bundle 创建 Shorthands

你可以使用细粒度 bundle 创建你自己的 shorthands。以下是使用细粒度 bundle 创建 shorthands 的示例：

```ts
import { createdBundledHighlighter, createSingletonShorthands } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const BundledLanguage = {
  typescript: () => import('@shikijs/langs/typescript'),
  javascript: () => import('@shikijs/langs/javascript'),
  vue: () => import('@shikijs/langs/vue'),
}

const BundledTheme = {
  'light-plus': () => import('@shikijs/themes/light-plus'),
  'dark-plus': () => import('@shikijs/themes/dark-plus'),
}

// 这将使用细粒度 bundle 创建你的自定义 'createHighlighter' 函数
export const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine(),
})

// 这将为你创建 shorthands
export const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands(
  createHighlighter,
)
```

你还可以使用 [`shiki-codegen`](/packages/codegen) 为你生成细粒度 bundle。
