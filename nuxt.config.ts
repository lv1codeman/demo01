// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  ssr: true,

  // when enabling ssr option you need to disable inlineStyles and maybe devLogs
  features: {
    inlineStyles: false,
    devLogs: false,
  },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
    server: {
      allowedHosts: ["a77035f43540.ngrok-free.app"],
    },
  },

  css: [],
  modules: ["@nuxt/fonts", "vuetify-nuxt-module"],
  // 運行時配置 (Runtime Config)
  runtimeConfig: {
    // 私有變數，只在伺服器端可用
    // 可以用來放密碼等敏感資訊
    // private: {
    //   apiSecret: '...'
    // },
    // 公開變數，客戶端和伺服器端都可用
    public: {
      apiBaseUrl: "http://localhost:8000",
    },
  },
  vuetify: {
    moduleOptions: {
      // check https://nuxt.vuetifyjs.com/guide/server-side-rendering.html
      ssrClientHints: {
        reloadOnFirstRequest: false,
        viewportSize: true,
        prefersColorScheme: false,

        prefersColorSchemeOptions: {
          useBrowserThemeOnly: false,
        },
      },

      // /* If customizing sass global variables ($utilities, $reset, $color-pack, $body-font-family, etc) */
      // disableVuetifyStyles: true,
      styles: {
        configFile: "assets/settings.scss",
      },
    },
  },
});
