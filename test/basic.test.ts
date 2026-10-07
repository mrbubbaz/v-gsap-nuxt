import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('hides elements that start from opacity 0 until GSAP takes over', async () => {
    const html = await $fetch('/')
    const tag = (id: string) => html.match(new RegExp(`<[^>]*id="${id}"[^>]*>`))?.[0] ?? ''
    expect(tag('from-opacity')).toContain('data-vgsap-from-invisible="true"')
    // SplitText fragments only exist on the client: the element itself is hidden, not its children
    expect(tag('split-stagger')).toContain('data-vgsap-from-invisible="true"')
    expect(tag('split-stagger')).not.toContain('data-vgsap-stagger')
  })
})
