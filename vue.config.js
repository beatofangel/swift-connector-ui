module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
      enableBridge: false
    }
  },

  publicPath: './',

  configureWebpack: {
    performance: {
      hints: process.env.NODE_ENV === 'production' ? "warning" : false
    },
  }
}
