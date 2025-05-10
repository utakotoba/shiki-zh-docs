# 语言

## 捆绑的语言

以下列出的语言语法来自 [`tm-grammars`](https://github.com/antfu/textmate-grammars-themes/tree/main/packages/tm-grammars) 。

<LanguagesList />

这些语法支持的许可证由其代码库覆盖，它们的许可证是宽松的（Apache-2.0、MIT 等），你可以在 [此通知](https://github.com/antfu/textmate-grammars-themes/blob/main/packages/tm-grammars/NOTICE) 中查看。

如果你要加载自定义语言，请参考 [这个指南](/guide/load-lang)。

## 特殊的语言

### 纯文本

你可以将语言设置为 `text`，以绕过高亮显示。这可以作为处理用户指定了不可用语言时的回滚效果，例如：

```txt
import { codeToHtml } from 'shiki'

const html = codeToHtml('console.log("Hello World")', {
  lang: 'text', // [!code hl]
  theme: 'vitesse-light', 
})
```

`txt` 和 `plain` 可以作为 `text` 的别名使用。

### ANSI

特殊的处理语言 `ansi` 可以用来突出显示终端输出。例如：

```ansi
[0;32mcolored foreground[0m
[0;42mcolored background[0m
[0;1mbold text[0m
[0;2mdimmed text[0m
[0;4munderlined text[0m
[0;7mreversed text[0m
[0;9mstrikethrough text[0m
[0;4;9munderlined + strikethrough text[0m
```

查看 [上述代码片段的原始 Markdown](https://github.com/shikijs/shiki/blob/main/docs/languages.md?plain=1#L35)。
