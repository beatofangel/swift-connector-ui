import Vue from 'vue'
import LangRouter from 'vue-lang-router'
import translations from '../lang/translations'
// import localizedURLs from '../lang/localized-urls'

Vue.use(LangRouter, {
	defaultLanguage: 'en',
	translations,
	// localizedURLs,
})

const routes = [
  {
    path: '/',
    name: 'Home',
    icon: 'mdi-home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/change-log',
    name: 'ChangeLog',
    icon: 'mdi-playlist-edit',
    component: () => import('../views/ChangeLog.vue')
  },
  {
    path: '/about',
    name: 'About',
    icon: 'mdi-help',
    component: () => import('../views/About.vue')
  }
]

const router = new LangRouter({
  routes
})

export default router
