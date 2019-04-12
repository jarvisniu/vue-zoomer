<template>
  <div style="padding: 0px;">
    <v-zoomer-gallery
      ref="gallery"
      style="width: 100vw; height: calc(100vh - 32px);"
      :list="urlImageList"
      v-model="selIndex"
    ></v-zoomer-gallery>
    <div style="box-sizing: border-box; height: 32px; padding: 4px;">
      <button @click="$refs.gallery.reset()">reset</button>
      <button
        :disabled="selIndex === 0"
        @click="selIndex -= 1"
      >&lt;-</button>
      <span>{{ selIndex + 1 }} / {{ urlImageList.length }}</span>
      <button
        :disabled="selIndex === urlImageList.length - 1"
        @click="selIndex += 1"
      >-&gt;</button>
    </div>
  </div>
</template>

<script>
import urlImage1 from '../assets/landscape-1.jpg'
import urlImage2 from '../assets/landscape-2.jpg'
import urlImage3 from '../assets/landscape-3.jpg'
import urlImage4 from '../assets/landscape-4.jpg'
import urlImage5 from '../assets/landscape-5.jpg'

export default {
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
