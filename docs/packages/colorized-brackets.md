# @shikijs/colorized-brackets

<Badges name="@shikijs/colorized-brackets" />

一个适用于 Shiki 的 VSCode 风格彩色括号转换器。

## 安装

::: code-group

```sh [npm]
npm i -D @shikijs/colorized-brackets
```

```sh [yarn]
yarn add -D @shikijs/colorized-brackets
```

```sh [pnpm]
pnpm add -D @shikijs/colorized-brackets
```

```sh [bun]
bun add -D @shikijs/colorized-brackets
```

:::

## 使用方法

将其添加到你的 Shiki 转换器列表中：

```ts colorize-brackets
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { codeToHtml } from 'shiki'

const html = await codeToHtml('let values: number[] = [];', {
  lang: 'ts',
  theme: 'dark-plus',
  transformers: [transformerColorizedBrackets()],
})
```

### 配色

括号的颜色会根据你的 Shiki 主题（或[双主题](https://shiki.style/guide/dual-themes)）自动匹配，支持所有内置主题。不过，如果你添加了自定义主题，或想覆盖内置主题的配色，也可以进行自定义：

```ts colorize-brackets
const html = await codeToHtml('let values: number[] = [];', {
  lang: 'ts',
  theme: myCustomTheme,
  transformers: [transformerColorizedBrackets({
    themes: {
      'my-custom-theme': ['goldenrod', 'blueviolet', 'dodgerblue', 'crimson'],
    },
  })],
})
```

最后一个颜色用于不匹配的括号，其余颜色用于每一层括号配对。可以使用任何有效的 CSS 颜色。

如果某主题没有定义括号颜色，则会回退到默认的 `dark-plus` 主题。

### 自定义括号

可以自定义括号配对：

```ts colorize-brackets
const transformer = transformerColorizedBrackets({
  bracketPairs: [{ opener: '{', closer: '}' }],
})
```

上面的配置仅为 `{}` 大括号着色。默认配置会为 `[]` 方括号、`{}` 大括号、`()` 小括号以及 TS 类型注解中的 `<>` 尖括号着色。

高级用法中，可以通过 `scopesAllowList` 和 `scopesDenyList` 指定括号配对适用或排除的 TextMate 范围。例如，默认的 `<>` 尖括号配置如下：

```ts colorize-brackets
const bracketPair = {
  opener: '<',
  closer: '>',
  scopesAllowList: [
    'punctuation.definition.typeparameters.begin.ts',
    'punctuation.definition.typeparameters.end.ts',
  ],
}
```

### 语言特定的覆盖

所有设置都可以通过 `langs` 选项为特定语言进行覆盖：

```ts colorize-brackets
const transformer = transformerColorizedBrackets({
  langs: { ts: myCustomTypescriptConfig },
})
```

### 显式触发

如果你不想为所有代码块启用彩色括号，可以启用 `explicitTrigger` 选项：

```ts colorize-brackets
const transformer = transformerColorizedBrackets({
  explicitTrigger: true,
})
```

这样，只有带有 `colorize-brackets` [元字符串](/guide/transformers#meta) 的代码块才会启用括号着色。

````md
```ts
// 不启用括号着色
```

```ts colorize-brackets
// 启用括号着色
```
````
