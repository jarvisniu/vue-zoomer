import Vue from 'vue'
import VueZoomer from '../../src/index'
import App from './app.vue'

Vue.use(VueZoomer)
Vue.component('App', App)

new Vue({
  el: '#app',
  render: h => h('App'),
})
