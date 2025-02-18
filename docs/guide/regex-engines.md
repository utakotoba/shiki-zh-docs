---
outline: deep
---

# 正则表达式引擎

TextMate 语法基于正则表达式来匹配标记。通常，我们使用 [Oniguruma](https://github.com/kkos/oniguruma)（一个用 C 语言编写的正则表达式引擎）来解析语法。为了使其在 JavaScript 中运行，我们将 Oniguruma 编译为 WebAssembly，以便在浏览器或 Node.js 中运行。

自 v1.15 版本起，我们为用户提供了切换正则表达式引擎并提供自定义实现的功能。在 `createHighlighter` 和 `createHighlighterCore` 中添加 `engine` 选项。例如：

```ts
import { createHighlighter } from 'shiki'

const shiki = await createShiki({
  themes: ['nord'],
  langs: ['javascript'],
  engine: { /* 自定义引擎 */ }
})
```

Shiki 提供了两个内置引擎：

## Oniguruma 引擎

这是默认的引擎，使用编译后的 Oniguruma WebAssembly。

```ts
import { createHighlighter } from 'shiki'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const shiki = await createShiki({
  themes: ['nord'],
  langs: ['javascript'],
  engine: createOnigurumaEngine(import('shiki/wasm'))
})
```

## JavaScript 正则表达式引擎（实验性）

这个实验性引擎使用 JavaScript 的原生 `RegExp`。由于 TextMate 语法的正则表达式是基于 Oniguruma 语法风格，可能包含 JavaScript `RegExp` 不支持的语法，因此我们使用 [`oniguruma-to-js`](https://github.com/antfu/oniguruma-to-js) 来简化语法并尝试使其与 JavaScript 的正则表达式兼容。

```ts {2,4,9}
import { createHighlighter } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const jsEngine = createJavaScriptRegexEngine()

const shiki = await createHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
  engine: jsEngine
})

const html = shiki.codeToHtml('const a = 1', { lang: 'javascript', theme: 'nord' })
```

使用 JavaScript 引擎的优点在于，它不需要加载一个大的 WebAssembly 文件来支持 Oniguruma，并且在某些语法中运行速度更快（因为正则表达式以原生 JavaScript 形式运行）。

尽管 JavaScript 引擎对 Oniguruma 的模拟非常强大，但在某些边缘情况中，无法保证高亮效果完全相同。此外，还有少数语法不受支持。

请查看[兼容性表](/references/engine-js-compat)以了解您使用的语言的支持状态。

JavaScript 引擎默认是严格模式，如果遇到无法转换的模式会抛出错误。如果可以接受匹配不完全，并希望对不支持的语法提供尽力而为的结果，可以启用 `forgiving` 选项以抑制任何转换错误：

```ts
const jsEngine = createJavaScriptRegexEngine({ forgiving: true })
// ...使用该引擎
```

::: info
如果你在 Node.js 上运行 Shiki（或在构建时运行），且对包大小或 WebAssembly 的支持没有顾虑，我们仍然推荐使用 Oniguruma 引擎以获得最佳效果。

JavaScript 引擎更适合在某些情况下在浏览器中运行，特别是在您希望控制包大小时。
:::

### JavaScript 运行时目标

为了获得最佳效果，JavaScript 引擎使用了 [RegExp `v` 标志](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets)，该标志在 Node.js v20+ 和 ES2024 中可用（[浏览器兼容性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets#browser_compatibility)）。对于较旧的环境，它会自动改用 `u` 标志，但这会导致支持的语法减少一些。

默认情况下，运行时目标会被自动检测。你可以通过设置 `target` 选项来覆盖此行为：

```ts
const jsEngine = createJavaScriptRegexEngine({
  target: 'ES2018', // or 'auto' (default), 'ES2024', 'ES2025'
})
```

### 预编译语言

除了即时编译正则表达式之外，我们还为 JavaScript 引擎提供预编译语言，以进一步减少启动时间。

::: info
预编译语言需要支持 RegExp UnicodeSets（`v` 标志），这需要 **ES2024** 或 Node.js 20+，并且可能无法在旧环境中工作。[Can I use](https://caniuse.com/mdn-javascript_builtins_regexp_unicodesets)。
:::

你可以使用 `@shikijs/langs-precompiled` 安装它们，并将你的 `@shikijs/langs` 导入更改为 `@shikijs/langs-precompiled`：

```ts
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRawEngine } from 'shiki/engine/javascript'

const highlighter = await createHighlighterCore({
  langs: [
    import('@shikijs/langs/javascript'), // [!code --]
    import('@shikijs/langs/typescript'), // [!code --]
    import('@shikijs/langs-precompiled/javascript'), // [!code ++]
    import('@shikijs/langs-precompiled/typescript'), // [!code ++]
    // ...
  ],
  themes: [
    import('@shikijs/themes/nord'),
  ],
  engine: createJavaScriptRegexEngine(), // [!code --]
  engine: createJavaScriptRawEngine(), // [!code ++]
})
```

如果你没有使用需要转换的自定义语法，则可以使用 `createJavaScriptRawEngine` 跳过转换步骤，从而进一步减小 bundle 大小。

如果你正在使用 [`shiki-codegen`](/packages/codegen)，则可以使用 `--precompiled` 和 `--engine=javascript-raw` 标志生成预编译语言。
