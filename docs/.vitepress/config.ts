import type { DefaultTheme } from 'vitepress'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { transformerMetaWordHighlight, transformerNotationWordHighlight, transformerRemoveNotationEscape } from '@shikijs/transformers'
import { bundledThemes } from 'shiki'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { version } from '../../package.json'
import vite from './vite.config'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: '快速开始', link: '/guide/' },
  { text: '安装', link: '/guide/install' },
  { text: '捆绑包', link: '/guide/bundles' },
  { text: '深浅色模式', link: '/guide/dual-themes' },
  { text: '简写', link: '/guide/shorthands' },
  { text: '最佳性能实践', link: '/guide/best-performance' },
  { text: '代码装饰', link: '/guide/decorations' },
  { text: '转换器', link: '/guide/transformers' },
  { text: '主题颜色控制', link: '/guide/theme-colors' },
  { text: '正则引擎', link: '/guide/regex-engines' },
  { text: '同步使用方法', link: '/guide/sync-usage' },
  { text: '语法状态', link: '/guide/grammar-state' },
  { text: '自定义主题', link: '/guide/load-theme' },
  { text: '自定义语言', link: '/guide/load-lang' },
  { text: '迁移', link: '/guide/migrate' },
  { text: '兼容性构建', link: '/guide/compat' },
]

const REFERENCES: DefaultTheme.NavItemWithLink[] = [
  { text: '主题', link: '/themes' },
  { text: '语言', link: '/languages' },
  { text: 'JavaScript 引擎兼容性', link: '/references/engine-js-compat' },
]

const INTEGRATIONS: DefaultTheme.NavItemWithLink[] = [
  { text: 'TypeScript Twoslash', link: '/packages/twoslash' },
  { text: 'markdown-it', link: '/packages/markdown-it' },
  { text: 'Rehype', link: '/packages/rehype' },
  { text: 'Monaco Editor', link: '/packages/monaco' },
  { text: 'VitePress', link: '/packages/vitepress' },
  { text: 'Nuxt', link: '/packages/nuxt' },
  { text: 'Next', link: '/packages/next' },
  { text: 'Astro', link: '/packages/astro' },
  { text: '常用转换器', link: '/packages/transformers' },
  { text: '括号着色', link: '/packages/colorized-brackets' },
  { text: '代码生成', link: '/packages/codegen' },
  { text: 'CLI', link: '/packages/cli' },
]

const BLOGS: DefaultTheme.NavItemWithLink[] = [
  { text: 'Shiki v3.0', link: '/blog/v3' },
  { text: 'Shiki v2.0', link: '/blog/v2' },
  { text: 'The Evolution of Shiki v1.0', link: 'https://nuxt.com/blog/shiki-v1' },
]

const VERSIONS: (DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `发布日志`, link: 'https://github.com/shikijs/shiki/releases' },
  { text: `贡献`, link: 'https://github.com/shikijs/shiki/blob/main/CONTRIBUTING.md' },
  {
    items: [
      { text: '从 v1.0 迁移', link: '/blog/v2' },
      { text: '从 v0.14 迁移', link: '/guide/migrate#migrate-from-v0-14' },
      { text: '从 Shikiji 迁移', link: '/guide/migrate#migrate-from-shikiji' },
    ],
  },
]

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: 'Shiki',
  lang: 'zh-CN',
  description: '语法高亮器 Shiki 非官方中文文档',
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    async shikiSetup(shiki) {
      await shiki.loadTheme(...Object.keys(bundledThemes) as any)
    },
    codeTransformers: [
      transformerMetaWordHighlight(),
      transformerNotationWordHighlight({
        matchAlgorithm: 'v3',
      }),
      {
        // Render custom themes with codeblocks
        name: 'shiki:inline-theme',
        preprocess(code, options) {
          const reg = /\btheme:([\w,-]+)\b/
          const match = options.meta?.__raw?.match(reg)
          if (!match?.[1])
            return
          const theme = match[1]
          const themes = theme.split(',').map(i => i.trim())
          if (!themes.length)
            return
          if (themes.length === 1) {
            // @ts-expect-error anyway
            delete options.themes
            // @ts-expect-error anyway
            options.theme = themes[0]
          }
          else if (themes.length === 2) {
            // @ts-expect-error anyway
            delete options.theme
            // @ts-expect-error anyway
            options.themes = {
              light: themes[0],
              dark: themes[1],
            }
          }
          else {
            throw new Error(`Only 1 or 2 themes are supported, got ${themes.length}`)
          }
          return code
        },
      },
      {
        name: 'shiki:inline-decorations',
        preprocess(code, options) {
          const reg = /^\/\/ @decorations:(.*)\n/
          code = code.replace(reg, (match, decorations) => {
            options.decorations ||= []
            options.decorations.push(...JSON.parse(decorations))
            return ''
          })
          return code
        },
      },
      // transformerTwoslash({
      //   // errorRendering: 'hover',
      //   processHoverInfo(info) {
      //     return defaultHoverInfoProcessor(info)
      //       // Remove shiki_core namespace
      //       .replace(/_shikijs_core\w*\./g, '')
      //   },
      //   typesCache: createFileSystemTypesCache(),
      // }),
      transformerRemoveNotationEscape(),
      transformerColorizedBrackets({ explicitTrigger: true }),
    ],
    // languages: ['js', 'jsx', 'ts', 'tsx'],
    config: (md) => {
      md.use(groupIconMdPlugin)
    },
  },
  cleanUrls: true,
  vite,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      {
        text: '指南',
        items: [
          {
            items: GUIDES,
          },
        ],
      },
      {
        text: '集成',
        items: INTEGRATIONS,
      },
      {
        text: '参考',
        items: REFERENCES,
      },
      {
        text: '博客',
        items: BLOGS,
      },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],

    sidebar: Object.assign(
      {},
      {
        '/': [
          {
            text: '指南',
            items: GUIDES,
          },
          {
            text: '集成',
            items: INTEGRATIONS,
          },
          {
            text: '参考',
            items: REFERENCES,
          },
        ],
      },
    ),

    editLink: {
      pattern: 'https://github.com/ifshizuku/shiki-zh-docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑本页',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'bluesky', link: 'https://bsky.app/profile/shiki.style' },
      { icon: 'github', link: 'https://github.com/shikijs/shiki' },
    ],

    footer: {
      message: '以 MIT 许可证发布',
      copyright: '版权所有 © 2021 Pine Wu，2023-现在 Anthony Fu',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    outline: {
      label: '目录',
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },

  locales: {
    root: {
      label: '简体中文（社区）',
    },
    en: {
      label: 'English',
      link: 'https://shiki.style',
    },
  },

  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Pine Wu, Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'Shiki' }],
    ['meta', { property: 'og:image', content: 'https://shiki.style/og.png' }],
    ['meta', { property: 'og:description', content: '语法高亮器 Shiki 非官方中文文档' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://shiki.style/og.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
}))
