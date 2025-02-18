# @shikijs/cli

<Badges name="@shikijs/cli" />

在命令行中使用 Shiki。

## 使用方法

Shiki CLI 与 `cat` 命令类似，不过它会输出具有语法高亮的内容。

```bash
npx @shikijs/cli README.md
```

## 安装

你可以将它全局安装，命令别名有 `@shikijs/cli`、`shiki` 和 `skat`。

::: code-group

```sh [npm]
npm i -g @shikijs/cli
```

```sh [yarn]
yarn global add @shikijs/cli
```

```sh [pnpm]
pnpm add -g @shikijs/cli
```

```sh [bun]
bun add -g @shikijs/cli
```

:::

```sh
skat src/index.ts
```

## 选项

### `--theme`

指定使用的主题，默认为 `vitesse-dark`。

```bash
npx @shikijs/cli README.md --theme=nord
```

### `--lang`

语言默认从文件拓展名自动推断，你可以使用 `--lang` 选项覆盖。

```bash
npx @shikijs/cli src/index.js --lang=ts
```
