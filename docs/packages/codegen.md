# shiki-codegen

<Badges name="shiki-codegen" />

为 Shiki 生成代码，创建专为您的使用而优化的 bundle。

## 用法

### CLI

```bash
npx shiki-codegen \
  --langs typescript,javascript,vue \
  --themes light-plus,dark-plus \
  --engine javascript \
  ./shiki.bundle.ts
```

文件 `shiki.bundle.ts` 将被创建，其中包含您可以在项目中使用 的代码。

然后你可以在你的项目中使用它：

```ts
import { codeToHtml } from './shiki.bundle'

const html = await codeToHtml(code, { lang: 'typescript', theme: 'light-plus' })
```

### 编程方式

你也可以通过编程方式使用 `shiki-codegen`，并将生成的代码写入文件：

```ts
import { codegen } from 'shiki-codegen'

const { code } = await codegen({
  langs: ['typescript', 'javascript', 'vue'],
  themes: ['light-plus', 'dark-plus'],
  engine: 'javascript',
  typescript: true
})

// 将代码写入文件
```
