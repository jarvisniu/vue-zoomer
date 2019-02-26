import Vue from 'vue'

import VueZoomer from '../../src/vue-zoomer.vue'
import App from './app.vue'

Vue.component('VueZoomer', VueZoomer)
Vue.component('App', App)

new Vue({
  el: '#app',
  render: h => h('App'),
})
