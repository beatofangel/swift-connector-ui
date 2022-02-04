import Vue from 'vue'
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
  const regex = /\/[a-z]{2}(_[A-Z]{2})?\/connections/
  window.taskPaneMode = !regex.test(to.path)
  next()
})
router.afterEach(localeChanged)

new Vue({
  vuetify,
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
