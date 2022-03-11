import VueZoomer from './vue-zoomer.vue'
import VueZoomerGallery from './vue-zoomer-gallery.vue'

export default {
  install (Vue) {
    Vue.component('VZoomer', VueZoomer)
    Vue.component('VZoomerGallery', VueZoomerGallery)
  },
  // for locally register
  Zoomer: VueZoomer,
  Gallery: VueZoomerGallery,
}
