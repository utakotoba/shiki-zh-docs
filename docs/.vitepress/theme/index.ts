import type { EnhanceAppContext } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import { createPinia } from 'pinia'
// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import { h } from 'vue'

import '@shikijs/twoslash/style-rich.css'
import 'floating-vue/dist/style.css'
import '@shikijs/vitepress-twoslash/style.css'
import 'uno.css'
import './style.css'
import './transformers.css'
import 'virtual:group-icons.css'

// @unocss-include

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(createPinia())
    app.use(TwoslashFloatingVue)
  },
  Layout() {
    return h(Theme.Layout, null, {
      'home-hero-actions-after': () => h('div', { class: 'mt-10 mb--4 vp-doc' }, [
        h('a', { href: 'https://nuxt.com/blog/shiki-v1', target: '_blank', class: 'no-underline! flex-inline gap-1 items-center' }, [
          h('div', { class: 'i-ph-books-duotone text-2xl' }),
          'Shiki 1.0 的诞生',
          h('div', { class: 'i-ph-arrow-up-right mt--3 ml--1' }),
        ]),
      ]),
    })
  },
}
