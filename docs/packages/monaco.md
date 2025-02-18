# @shikijs/monaco

<Badges name="@shikijs/monaco" />

在 [Monaco Editor](https://microsoft.github.io/monaco-editor/) 中使用 Shiki 来高亮。

Monaco 内置的高亮器没有使用完整的 TextMate 语法，所以它可能不够准确。该集成使你可以在 Monaco 中使用 Shiki 的语法高亮引擎进行高亮显示，并共享 Shiki 的语法和主题。

本集成深受 [`monaco-editor-textmate`](https://github.com/zikaari/monaco-editor-textmate) 的启发。

## 安装

::: code-group

```sh [npm]
npm i -D @shikijs/monaco
```

```sh [yarn]
yarn add -D @shikijs/monaco
```

```sh [pnpm]
pnpm add -D @shikijs/monaco
```

```sh [bun]
bun add -D @shikijs/monaco
```

:::

```ts
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor-core'
import { createHighlighter } from 'shiki'

// 创建一个可复用的语法高亮器
const highlighter = await createHighlighter({
  themes: [
    'vitesse-dark',
    'vitesse-light',
  ],
  langs: [
    'javascript',
    'typescript',
    'vue'
  ],
})

// 首先注册你需要的语言的 IDs
monaco.languages.register({ id: 'vue' })
monaco.languages.register({ id: 'typescript' })
monaco.languages.register({ id: 'javascript' })

// 注册 Shiki 主题，并为 Monaco 提供语法高亮 // [!code highlight:2]
shikiToMonaco(highlighter, monaco)

// 创建编辑器
const editor = monaco.editor.create(document.getElementById('container'), {
  value: 'const a = 1',
  language: 'javascript',
  theme: 'vitesse-dark',
})

// 正常使用
```
