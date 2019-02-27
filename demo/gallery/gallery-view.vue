<template>
  <div
    class="gallery-view"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseout="isPointerDown = false"
    @mouseup="onMouseUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchmove.prevent="onTouchMove"
  >
    <!-- left -->
    <img
      class="left slide"
      :class="{ touching: isPointerDown }"
      :style="leftStyle"
      src="../assets/landscape-2.jpg"
    >
    <!-- middle -->
    <vue-zoomer
      class="middle slide"
      :style="middleStyle"
      :class="{ touching: isPointerDown }"
      :max-scale="10"
      :zoomed.sync="zoomed"
    >
      <img src="../assets/landscape-1.jpg" style="object-fit: contain; width: 100%; height: 100%;">
    </vue-zoomer>
    <!-- right -->
    <img
      class="right slide"
      :class="{ touching: isPointerDown }"
      :style="rightStyle"
      src="../assets/landscape-3.jpg"
    >
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Number, required: true },
  },
  data () {
    return {
      offset: 0,
      isPointerDown: false,
      lastPointerX: 0,
      zoomed: false,
    }
  },
  computed: {
    middleStyle () {
      return {
        left: `${ 0 + this.offset }px`,
      }
    },
    leftStyle () {
      return {
        left: `${ -500 + this.offset }px`,
      }
    },
    rightStyle () {
      return {
        left: `${ 500 + this.offset }px`,
      }
    },
  },
  watch: {
    isPointerDown (val) {
      if (!val) {
        if (this.offset < -250) this.offset = -500
        else if (this.offset < 250) this.offset = 0
        else this.offset = 500
      }
    },
  },
  methods: {
    onPointerMove (deltaX) {
      if (this.isPointerDown && !this.zoomed) {
        this.offset += deltaX
      }
    },
    onMouseDown (ev) {
      this.isPointerDown = true
      this.lastPointerX = ev.clientX
    },
    onMouseUp (ev) {
      this.isPointerDown = false
    },
    onMouseMove (ev) {
      if (this.isPointerDown) {
        this.onPointerMove(ev.clientX - this.lastPointerX)
        this.lastPointerX = ev.clientX
      }
    },
    onTouchStart (ev) {
      if (ev.touches.length === 1) {
        this.isPointerDown = true
        this.lastPointerX = ev.touches[0].clientX
      }
    },
    onTouchEnd (ev) {
      if (ev.touches.length === 0) {
        this.isPointerDown = false
      }
    },
    onTouchMove (ev) {
      if (ev.touches.length === 1) {
        this.onPointerMove(ev.touches[0].clientX - this.lastPointerX)
        this.lastPointerX = ev.touches[0].clientX
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.gallery-view
  position relative
  border solid 1px red
  width 500px
  height 500px
  overflow hidden
  user-select none
  & > *
    display inline-block

.slide
  position absolute
  top 0
  object-fit contain
  width 500px
  height 500px
  // border solid 1px silver
  -webkit-user-drag none
  &:not(.touching)
    transition left 0.5s
</style>
