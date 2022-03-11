export { default as VueZoomer } from './vue-zoomer.vue'
export { default as VueZoomerGallery } from './vue-zoomer-gallery.vue'

export default {
  install (Vue) {
    Vue.component('VZoomer', VueZoomer)
    Vue.component('VZoomerGallery', VueZoomerGallery)
  },
}
