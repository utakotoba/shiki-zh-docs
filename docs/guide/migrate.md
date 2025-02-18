---
outline: deep
---

# 迁移

我们建议您逐步迁移，并遵循每个版本的迁移指南。

## 从 v2.0 迁移

如果您使用的是 v2.0，并且您的使用中没有警告，那么您应该能够直接升级到 v3.0，请阅读 [Shiki v3.0](/blog/v3) 了解更多详细信息。

## 从 v1.0 迁移

我们建议您先[迁移到 v2.0](/blog/v2)，然后再迁移到 v3.0。

## 从 v0.14 迁移

Shiki 的 v1.0 版本是一次重大的重写，我们借此机会修改了过去的所有设计决定。我们原本有一个独立的软件包名称 [Shikiji](https://github.com/antfu/shikiji)，用来试验新的设计，现在合并回 Shiki，成为 v1.0。

> [!TIP] 了解更多
> 对 v1.0 背后的故事感兴趣吗？查看此 [博客文章](https://nuxt.com/blog/shiki-v1) 进一步了解。

与 [`shiki@0.14.3`](https://github.com/shikijs/shiki/releases/tag/v0.14.3) 相比，破坏性更改的内容如下：

### 硬性破坏性改动

你必须手动迁移的破坏性改动：

- CJS 和 IIFE 构建被移除。查看 [使用 CJS](/guide/install#cjs-usage) 和 [使用 CDN](/guide/install#cdn-usage) 获取更多详细信息。
- `codeToHtml` 在内部使用了 [`hast`](https://github.com/syntax-tree/hast)。 生成的 HTML 会略有不同，但行为一致。
- 不支持 `css-variables` 主题。请使用 [双主题](/guide/dual-themes)，或在 [主题颜色控制](/guide/theme-colors) 查看更多。

### 软性破坏性改动

`shiki` 包中包含的破坏性改动，而 [兼容构建 `@shikijs/compat`](/guide/compat#compatibility-build) 中不具备（屏蔽）:

- 顶级命名导出项 `setCDN`、`loadLanguage`、`loadTheme` 和 `setWasm` 被移除。
- `BUNDLED_LANGUAGES`、`BUNDLED_THEMES` 被移至 `@shikijs/langs` 和 `@shikijs/themes` 中并分别更名为 `bundledLanguages` 和 `bundledThemes`。
- `createHighlighter` 的 `theme` 选项被移除，请改用数组形式的 `themes`。
- 高亮器不再具有内部的默认主题上下文。对于 `codeToHtml` 和 `codeToThemedTokens` 函数，`theme` 选项是必须的。
- `codeToThemedTokens` 更名为 `codeToTokensBase`，并添加了一个更高级的 `codeToTokens`。
- `codeToTokens` 默认情况下将 `includeExplanation` 设置为 `false`。
- `.ansiToHtml` 作为一个特殊的语言 `ansi` 被合并至 `.codeToHtml`。请使用 `.codeToHtml(code, { lang: 'ansi' })`。
- `lineOptions` 被移除，取而代之的是完全可定制的 `transforms` 选项。
- `LanguageRegistration` 的 `grammar` 字段被展开到 `LanguageRegistration`，参考类型定义获取详细信息。

### 生态包

- `shiki-twoslash` 完全重写。它不再是 Shiki 高亮器的包装，而是一个可以插入任何支持转换器的集成 Shiki 转换器，作为 [`@shikijs/twoslash`](/packages/twoslash) 包。
- `shiki-twoslash` 的集成，例如 `gatsby-remark-shiki-twoslash` 等，会逐渐迁移到通用的 Shiki 版本。在此之前，你可以使用 [`@shikijs/rehype`](/packages/rehype) 或 [`@shikijs/markdown-it`](/packages/markdown-it) 来将 Shiki 集成到元框架。
- 引入了新的官方集成，如 [`@shikijs/monaco`](/packages/monaco)、[`@shikijs/cli`](/packages/cli)、[`@shikijs/rehype`](/packages/rehype) 以及 [`@shikijs/markdown-it`](/packages/markdown-it)。
- `shiki-renderer-path` 和 `shiki-renderer-svg` 使用频率较低，现已被废弃。如果你需要它们，请发起一个议题，并带上你的用例，我们会很乐意将它们再加回来。
- 由于已经不再建议使用 [VuePress](https://github.com/vuejs/vuepress#status)，所以 `vuepress-plugin-shiki` 已被废弃。它的继承者 [VitePress](https://vitepress.dev/) 具有内建的 Shiki 集成。

## 从 Shikiji 迁移

如果你在使用 [Shikiji](https://github.com/antfu/shikiji)，请确保你使用的是最新的次版本 v0.10。然后重新命名软件包，这个迁移的过程应该会非常简单：

- `shikiji` -> `shiki`
- `shikiji-core` -> `@shikijs/core`
- `shikiji-twoslash` -> `@shikijs/twoslash`
- `shikiji-transformers` -> `@shikijs/transformers`
- `shikiji-monaco` -> `@shikijs/monaco`
- `shikiji-cli` -> `@shikijs/cli`
- `markdown-it-shikiji` -> `@shikijs/markdown-it`
- `rehype-shikiji` -> `@shikijs/rehype`
