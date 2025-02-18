---
outline: deep
---

# @shikijs/twoslash

<Badges name="@shikijs/twoslash" />

适用于 [Twoslash](https://github.com/twoslashes/twoslash) 的 shiki 转换器，用于在代码块内提供行内的类型悬停显示。

[TwoSlash 注释参考](https://twoslash.netlify.app/refs/notations)

## 安装

::: code-group

```sh [npm]
npm install -D @shikijs/twoslash
```

```sh [yarn]
yarn add -D @shikijs/twoslash
```

```sh [pnpm]
pnpm add -D @shikijs/twoslash
```

```sh [bun]
bun add -D @shikijs/twoslash
```

:::

这个包是 shiki 的一个**转换器插件**，这意味着对于每个支持传递 shiki 转换器的集成，你都可以使用此包。

```ts twoslash
import {
  transformerTwoslash,
} from '@shikijs/twoslash'
import {
  codeToHtml,
} from 'shiki'

const html = await codeToHtml(`console.log()`, {
  lang: 'ts',
  theme: 'vitesse-dark',
  transformers: [
    transformerTwoslash(), // <-- 这里
    // ...
  ],
})
```

默认的输出是没有样式的，你需要添加额外的 CSS 来装饰它们。

如果你想在浏览器或者 Workers 上运行 Twoslash，参考 [使用 CDN](#使用-cdn) 部分。

## 渲染器

由于 [`hast`](https://github.com/syntax-tree/hast) 的灵活性，本转换器允许你使用 AST 来自定义每个片段在输出 HTML 中的呈现方式。

我们提供了两个内建的渲染器，你也可以创建你自己的渲染器。

---

### `rendererRich`

[源代码](https://github.com/shikijs/shiki/blob/main/packages/twoslash/src/renderer-rich.ts)

::: tip 提示
自 v1.0 开始，本渲染器是默认渲染器。
:::

此渲染器提供了一个更明确的类名，前缀为 `twoslash-`，以便更好地进行作用域的限定。
此外，它还在悬停信息上进行语法的高亮显示。

```ts twoslash
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'

transformerTwoslash({
  renderer: rendererRich() // <--
})
```

这里有一些使用内置 [`style-rich.css`](https://github.com/shikijs/shiki/blob/main/packages/twoslash/style-rich.css) 的例子：

<!-- eslint-skip -->

```ts twoslash
// @errors: 2540
interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users'.toUpperCase(),
//  ^?
}

todo.title = 'Hello'

Number.parseInt('123', 10)
//      ^|

               //
               //
```

```ts twoslash
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const highlighter = await createHighlighterCore({
  engine: createJavaScriptRegexEngine()
})

// @log: 自定义日志信息
const a = 1
// @error: 自定义错误信息
const b = 1
// @warn: 自定义警告信息
const c = 1
// @annotate: 自定义注释信息
```

---

### `rendererClassic`

[源代码](https://github.com/shikijs/shiki/blob/main/packages/twoslash/src/renderer-classic.ts)

此渲染器与旧版的 [`shiki-twoslash`](https://github.com/shikijs/twoslash) 的输出一致。

```ts twoslash
import { rendererClassic, transformerTwoslash } from '@shikijs/twoslash'

transformerTwoslash({
  renderer: rendererClassic() // <--
})
```

你可能需要引用 `shiki-twoslash` 的 CSS 来装饰它。[在这里](https://github.com/shikijs/shiki/blob/main/packages/twoslash/style-classic.css) 我们也提供了来自 `shiki-twoslash` 的 CSS 拷贝，不过它可能需要进一步的优化。

### `rendererFloatingVue`

[源代码](https://github.com/shikijs/shiki/blob/main/packages/vitepress-twoslash/src/renderer-floating-vue.ts)

这个渲染器使用 [Floating Vue](https://floating-vue.starpad.dev/) 作为浮动组件（在容器外渲染），并生成 Vue 模版语法。这个渲染器不可以直接使用，而是作为 [VitePress 集成](/packages/vitepress#twoslash) 的内部渲染器。在这里列出它，对你可能创建的自己的渲染器提供一些参考。

## 选项

### 显式使用

当与 `markdown-it-shiki` 或 `rehype-shiki` 集成时，我们可能不希望 Twoslash 在每个代码块上运行。在这种情况下，我们可以将 `explicitTrigger` 设置为 `true`，仅在指定呈现 Twoslash 的代码块上显示。

```ts twoslash
import { transformerTwoslash } from '@shikijs/twoslash'

transformerTwoslash({
  explicitTrigger: true // <--
})
```

````md
在 Markdown 中，你可以使用如下的语法来触发 Twoslash

```ts
// 这是一个普通的代码块
```

```ts twoslash
// 这是一个运行 Twoslash 的代码块
```
````

## 集成

你可以根据上面的说明自行将 Twoslash 与 Shiki 集成，也可以在这里找到与框架和工具的高级集成：

- [VitePress](/packages/vitepress#twoslash) - 在 VitePress 中启用 Twoslash 支持。
- [Nuxt](/packages/nuxt#twoslash-integration) - 在 Nuxt Content 中启用 Twoslash 支持。
- [Vocs](https://vocs.dev/docs/guides/twoslash) - 在 Vocs 中启用 Twoslash 支持。
- [Slidev](https://sli.dev/features/twoslash#twoslash-integration) - Slidev 具有内建的 Twoslash 支持。

## 用例指南

### 使用 CDN

默认情况下，[`twoslash`](https://github.com/twoslashes/twoslash/tree/main/packages/twoslash) 在 Node.js 上运行，并依赖于你的本地系统来解析 TypeScript 和导入的类型。在非 Node.js 环境中直接导入它将无法工作。

幸运的是，Twoslash 实现了一个虚拟文件系统，允许你提供自己的文件以供 TypeScript 在内存中解析。然而，在浏览器中加载这些文件仍然是一个挑战。在 [TypeScript 网站](https://github.com/microsoft/TypeScript-Website) 中，TypeScript 团队提供了一些用来从 CDN 上按需获取类型的工具，他们称之为 [自动类型获取（ATA，Automatic Type Acquisition）](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ata)。

我们简易地封装了它们，并在 [`twoslash-cdn`](https://github.com/antfu/twoslash-cdn) 中提供了易于使用的 API。 例如：

```js
// FIXME: 在生产环境中使用显式的版本替换
import { createTransformerFactory, rendererRich } from 'https://esm.sh/@shikijs/twoslash@latest/core'
import { codeToHtml } from 'https://esm.sh/shiki@latest'
import { createTwoslashFromCDN } from 'https://esm.sh/twoslash-cdn@latest'
import { createStorage } from 'https://esm.sh/unstorage@latest'
import indexedDbDriver from 'https://esm.sh/unstorage@latest/drivers/indexedb'

// ============= 初始化 =============

// 使用 IndexedDB 和 unstorage 来缓存虚拟文件系统的示例
const storage = createStorage({
  driver: indexedDbDriver({ base: 'twoslash-cdn' }),
})

const twoslash = createTwoslashFromCDN({
  storage,
  compilerOptions: {
    lib: ['esnext', 'dom'],
  },
})

const transformerTwoslash = createTransformerFactory(twoslash.runSync)({
  renderer: rendererRich(),
})

// ============= 执行 =============

const app = document.getElementById('app')

const source = `
import { ref } from 'vue'

console.log("Hi! Shiki + Twoslash on CDN :)")

const count = ref(0)
//     ^?
`.trim()

// 在渲染之前，我们需要准备好类型，以便能够同步地进行渲染
await twoslash.prepareTypes(source)

// 接着我们可以渲染代码
app.innerHTML = await codeToHtml(source, {
  lang: 'ts',
  theme: 'vitesse-dark',
  transformers: [transformerTwoslash],
})
```
