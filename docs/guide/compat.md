---
outline: deep
---

# 兼容性构建

::: warning 警告
这是为 v0.x 用户提供的兼容版本。自 v3 版本起，此包已不再维护。请迁移到最新版本。
:::

为了让深度迁移更容易，我们提供了一个兼容版本，对相对于 v0.x 版本中的破坏性更改进行了修整。你可以用它来替代 `shiki` 并逐步迁移。

## 安装

<Badges name="@shikijs/compat" />

在 `package.json` 中为 `shiki` 设置别名：

<!-- eslint-skip -->

```json
{
  "dependencies": {
    "shiki": "0.14.3", // [!code --]
    "shiki": "npm:@shikijs/compat@1.0" // [!code ++]
  }
}
```

查看 [破坏性改动列表](/guide/migrate#migrate-from-v0-14) 有助于你手动迁移这些更改。
