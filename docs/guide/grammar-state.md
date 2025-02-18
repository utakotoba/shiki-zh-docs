# 语法状态

`GrammarState` 是一个特殊的标记，保存语法上下文，并允许从中间语法状态进行高亮显示，使得高亮代码片段变得更加容易。

例如，如果我们想高亮类型注解 `Pick<MyObject, string>[]`，我们可以通过 `getLastGrammarState` 方法获取语法状态，并将其传递到 `grammarState` 选项中：

```ts
import { createHighlighter } from 'shiki'

const shiki = await createHighlighter({ langs: ['ts'], themes: ['github-dark'] })

const stateTypeAnnotation = shiki.getLastGrammarState('let a:', { lang: 'ts', theme: 'github-dark' })

const highlightedType = shiki.codeToHtml(
  'Pick<MyObject, string>[]',
  {
    lang: 'ts',
    theme: 'github-dark',
    grammarState: stateTypeAnnotation // <--- 这个
  }
)
```

现在，Shiki 会正确地进行高亮显示，因为它知道从类型注解开始。你也可以将这个语法状态对象保留多次使用。

<img width="223" alt="image" src="https://github.com/shikijs/shiki/assets/11247099/c896c2ae-2a88-428b-9d06-2d2552eaae8b">

### 语法上下文代码

对于一次性的语法上下文切换，我们还提供了一个简写方式，通过 `grammarContextCode` 选项：

```ts
const highlightedType = shiki.codeToHtml(
  'Pick<MyObject, string>[]',
  {
    lang: 'ts',
    theme: 'github-dark',
    grammarContextCode: 'let a:' // 与上面相同，内部创建了一个临时的语法状态
  }
)
```

### 从 HAST 获取语法状态

`getLastGrammarState` 方法内部执行高亮过程并返回语法状态。如果你正在做类似可暂停高亮的事情，这可能会导致高亮执行两次。在这种情况下，你可以将高亮后的 `hast` 节点传递给 `getLastGrammarState`，以获取我们在内部 `WeakMap` 中存储的语法状态：

```ts
const shiki = await getHighlighter(/* ... */)

const root = shiki.codeToHast(/* ... */)

const grammarState = shiki.getLastGrammarState(root) // 传递 hast 根节点而不是代码
```
