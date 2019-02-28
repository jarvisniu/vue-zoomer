<template>
  <div style="padding: 10px;">
    <div>
      Gallery
    </div>
    <gallery-view style="width: 600px; height: 600px;" v-model="selIndex"></gallery-view>
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
