import Vue from 'vue'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { i18n } from 'vue-lang-router'
import router from './router'
import { mixin } from './utils/mixin'
import { localeChanged, ValidationProvider, ValidationObserver } from "vee-validate";
import './validator'

Vue.config.productionTip = false
Vue.mixin(mixin)
Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)

router.beforeEach((to, from, next) => {
  const regexArr = [
    /\/[a-z]{2}(_[A-Z]{2})?\/connections/,
    /\/[a-z]{2}(_[A-Z]{2})?\/query-editor/
  ]
  if (regexArr.findIndex(r => r.test(to.path)) != -1) {
    store.state.showNavi = false
    store.state.showCtrlBox = true
  }
  next()
})
router.afterEach(localeChanged)

new Vue({
  vuetify,
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
