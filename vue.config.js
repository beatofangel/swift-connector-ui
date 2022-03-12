module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  devServer: {
    host: 'localhost'
  },

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
