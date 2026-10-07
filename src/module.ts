import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  addComponent,
  addTemplate,
} from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  [key: string]: any
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'v-gsap-nuxt',
    configKey: 'vgsap',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    _nuxt.options.runtimeConfig.public.vgsap = defu(
      _nuxt.options.runtimeConfig.public.vgsap as any,
      {
        ..._options,
      },
    )

    _nuxt.options.css.push(resolver.resolve('./runtime/styles/vgsap.css'))

    // Default delay / duration of the CSS fallback reveal (see vgsap.css), as variables on :root.
    // Numbers are milliseconds, strings any CSS time.
    const fallbackReveal = (_nuxt.options.runtimeConfig.public.vgsap as any)?.fallbackReveal
    const cssTime = (value: unknown) => (typeof value === 'number' ? `${value}ms` : value)
    const fallbackVariables = [
      fallbackReveal?.delay != null && `--vgsap-fallback-delay: ${cssTime(fallbackReveal.delay)};`,
      fallbackReveal?.duration != null && `--vgsap-fallback-duration: ${cssTime(fallbackReveal.duration)};`,
    ].filter(Boolean)
    if (fallbackVariables.length) {
      const template = addTemplate({
        filename: 'vgsap-fallback.css',
        getContents: () => `:root { ${fallbackVariables.join(' ')} }\n`,
      })
      _nuxt.options.css.push(template.dst)
    }

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/nuxt'))

    if (
      (_nuxt.options.runtimeConfig.public.vgsap as any)?.composable != false
    ) {
      addImports({
        name: 'useGSAP',
        as: 'useGSAP',
        from: resolver.resolve('runtime/plugin'), // load composable from plugin
      })
    }

    addComponent({
      name: 'GSAPTransition',
      filePath: resolver.resolve('./runtime/components/GSAPTransition.vue'),
    })
  },
})
