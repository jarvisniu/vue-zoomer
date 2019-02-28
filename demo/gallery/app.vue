<template>
  <div style="padding: 0px;">
    <!-- <div> Gallery </div> -->
    <gallery-view
      style="width: 100vw; height: 100vh;"
      :list="urlImageList"
      v-model="selIndex"
    ></gallery-view>
  </div>
</template>

<script>
import GalleryView from './gallery-view.vue'

import urlImage1 from '../assets/landscape-1.jpg'
import urlImage2 from '../assets/landscape-2.jpg'
import urlImage3 from '../assets/landscape-3.jpg'
import urlImage4 from '../assets/landscape-4.jpg'
import urlImage5 from '../assets/landscape-5.jpg'

export default {
  components: {
    GalleryView,
  },
  data () {
    return {
      selIndex: 0,
      urlImageList: [
        urlImage1,
        urlImage2,
        urlImage3,
        urlImage4,
        urlImage5,
      ],
    }
  },
}
</script>
