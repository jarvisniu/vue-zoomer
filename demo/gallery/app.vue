<template>
  <div style="padding: 0px;">
    <v-zoomer-gallery
      style="width: 100vw; height: calc(100vh - 29px);"
      :list="urlImageList"
      v-model="selIndex"
    ></v-zoomer-gallery>
    <div style="padding: 4px;">
      <button
        :disabled="selIndex === 0"
        @click="selIndex -= 1"
      >&lt;-</button>
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
