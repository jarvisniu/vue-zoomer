<template>
  <div
    :style="{
      width: containerWidth + 'px',
      height: containerHeight + 'px',
     }"
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

const SLIDE_WIDTH_THRESH = 0.25

export default {
  props: {
    value: { type: Number, required: true },
  },
  data () {
    return {
      slideOffsetX: 0,
      isPointerDown: false,
      lastPointerX: 0,
      zoomed: false,
      containerWidth: 1,
      containerHeight: 1,
    }
  },
  computed: {
    middleStyle () {
      return {
        left: `${ 0 + this.slideOffsetX }px`,
      }
    },
    leftStyle () {
      return {
        left: `${ -this.containerWidth + this.slideOffsetX }px`,
      }
    },
    rightStyle () {
      return {
        left: `${ this.containerWidth + this.slideOffsetX }px`,
      }
    },
  },
  watch: {
    isPointerDown (val) {
      if (!val) this.onPointerUp()
    },
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    // reactive
    onWindowResize () {
      let styles = window.getComputedStyle(this.$el)
      this.containerWidth = parseFloat(styles.width)
      this.containerHeight = parseFloat(styles.height)
    },
    onPointerMove (deltaX) {
      if (this.isPointerDown && !this.zoomed) {
        this.slideOffsetX += deltaX
      }
    },
    onPointerUp () {
      if (this.slideOffsetX < -this.containerWidth * SLIDE_WIDTH_THRESH) {
        this.slideOffsetX = -this.containerWidth
      } else if (this.slideOffsetX < this.containerWidth * SLIDE_WIDTH_THRESH) {
        this.slideOffsetX = 0
      } else {
        this.slideOffsetX = this.containerWidth
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
  overflow hidden
  user-select none
  & > *
    display inline-block

.slide
  position absolute
  top 0
  object-fit contain
  width 100%
  height 100%
  // border solid 1px silver
  -webkit-user-drag none
  &:not(.touching)
    transition left 0.5s
</style>
