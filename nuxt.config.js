const colors = require('vuetify/es5/util/colors').default;

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Yest - крутейший способ доставки в мире',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href: "https://use.fontawesome.com/releases/v5.0.13/css/all.css", rel: "stylesheet" },
      { href: "https://fonts.googleapis.com/css?family=Material+Icons", rel: "stylesheet"}
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      src: '~/plugins/vuex-persist',
      ssr: false
    },
    {
      src: '~/plugins/elements.js',
      ssr: false
    }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/router',
    '@nuxtjs/vuetify'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    scss: [
      '~/assets/scss/*.scss',
      '~/assets/scss/**/*.scss',
    ]
  },
  vuetify: {
    theme: {
      dark: false,
      light: true,
      themes: {
        light: {
          primary: '#00a646',
          secondary: colors.black,
          white: colors.white,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          black: '#000',
          gray: colors.gray
        }
      }
    },
    defaultAssets: {
      font: true,
      icons: 'md'
    },
    icons: {
      iconfont: 'md'
    }
  },


  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
