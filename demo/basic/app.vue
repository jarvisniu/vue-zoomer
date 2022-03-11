<template>
  <div style="padding: 100px;">
    <div>
      zoomed: {{ zoomed }}
      <button @click="$refs.zoomer.zoomIn()">+</button>
      <button @click="$refs.zoomer.zoomOut()">-</button>
    </div>
    <v-zoomer
      ref="zoomer"
      style="width: 800px; height: 500px; border: solid 1px silver;"
      :aspect-ratio="imageAspectRatio"
      :max-scale="10"
      :zooming-elastic="false"
      :zoomed.sync="zoomed"
    >
      <img src="../assets/landscape-1.jpg" style="object-fit: contain; width: 100%; height: 100%;" @load="onImageLoad">
    </v-zoomer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      zoomed: false,
      imageAspectRatio: 1,
    }
  },
  methods: {
    onImageLoad(e) {
      const img = e.target
      this.imageAspectRatio = img.naturalWidth / img.naturalHeight
    },
  },
}
</script>
