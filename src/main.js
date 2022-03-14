import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import VueRouter from 'vue-router'
import Routes from './routes'

Vue.use(VueRouter)
Vue.config.productionTip = false
const router = new VueRouter({
  routes: Routes,
  mode: 'history'
})

new Vue({
  i18n,
  render: h => h(App),
  router: router
}).$mount('#app')
