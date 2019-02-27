<template>
  <div style="padding: 10px;">
    <div>
      Gallery
    </div>
    <gallery-view v-model="selIndex"></gallery-view>
  </div>
</template>

<script>
import GalleryView from './gallery-view.vue'

export default {
  components: {
    GalleryView,
  },
  data () {
    return {
      selIndex: 0,
    }
  },
}
</script>
