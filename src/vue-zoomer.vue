<template>
  <div
    class="vue-zoomer"
    @mousewheel.prevent="onMouseWheel"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
    @touchstart.prevent="onTouchStart"
    @touchend="onTouchEnd"
    @touchmove="onTouchMove"
  >
    <div class="zoomer" :style="wrapperStyle">
    <slot/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // Container sizes, used to determin the initial zoomer size.
      // Need to reactive to window resizing.
      containerWidth: 1,
      containerHeight: 1,
      // Store values: Interactions will at last change these values.
      // After rotation or resize, these values will keep still.
      translateX: 0,
      translateY: 0,
      scale: 0.75, // Relative to the container
      // Mouse states
      isMouseDown: false,
      mousePosX: -1,
      mousePosY: -1,
    }
  },
  mounted () {
    console.log('container Width/Height: ', this.containerWidth, this.containerHeight)
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.onResize)
  },
  computed: {
    wrapperStyle () {
      let W = this.containerWidth
      let H = this.containerHeight
      let width = W * this.scale
      let height = H * this.scale
      let left = W * this.translateX + W * (1 - this.scale) / 2
      let top = H * this.translateY + H * (1 - this.scale) / 2
      return {
        left: `${ left }px`,
        top: `${ top }px`,
        width: `${ width }px`,
        height: `${ height }px`,
      }
    },
  },
  methods: {
    // Mouse wheel scroll: Zoom the image with the point at the mouse pointer pinned.
    // Simplify: This can be regard as vector pointer to old-image-center scaling.
    // FIX TouchPad on Mac is much sensitive
    onMouseWheel (ev) {
      let normMousePosX = this.mousePosX / this.containerWidth
      let normMousePosY = this.mousePosY / this.containerHeight
      // Value basis: One mouse wheel (wheelDelta=+-120) means 1.25/0.8 scale.
      let scaleDelta = Math.pow(1.25, ev.wheelDelta / 120)
      // console.log('onMouseWheel', ev.wheelDelta, scaleDelta)
      this.scale *= scaleDelta
      this.translateX = (0.5 + this.translateX - normMousePosX) * scaleDelta + normMousePosX - 0.5
      this.translateY = (0.5 + this.translateY - normMousePosY) * scaleDelta + normMousePosY - 0.5
    },
    onMouseDown (ev) {
      this.isMouseDown = true
      // Open the context menu then click other place will skip the mousemove events.
      // This will cause the mousePosX/Y NOT sync, then we will need to fix it on mousedown event.
      this.mousePosX = ev.clientX
      this.mousePosY = ev.clientY
      // console.log('onMouseDown', ev.clientX, ev.clientY)
    },
    onMouseUp (ev) {
      this.isMouseDown = false
    },
    onMouseMove (ev) {
      this.onPointerMove(ev.clientX, ev.clientY)
      // console.log('onMouseMove', this.mousePosX, this.mousePosY)
    },
    onPointerMove(newMousePosX, newMousePosY) {
      if (this.isMouseDown) {
        let pixelDeltaX = newMousePosX - this.mousePosX
        let pixelDeltaY = newMousePosY - this.mousePosY
        // console.log('pixelDeltaX, pixelDeltaY', pixelDeltaX, pixelDeltaY)
        this.translateX += pixelDeltaX / this.containerWidth
        this.translateY += pixelDeltaY / this.containerHeight
      }
      this.mousePosX = newMousePosX
      this.mousePosY = newMousePosY
    },
    onTouchStart (ev) {
      if (ev.touches.length === 1) {
        this.isMouseDown = true
        this.mousePosX = ev.touches[0].clientX
        this.mousePosY = ev.touches[0].clientY
      }
      console.log('onTouchStart', ev.touches.length, this.mousePosX, this.mousePosY)
    },
    onTouchEnd (ev) {
      if (ev.touches.length === 0) this.isMouseDown = false
      console.log('onTouchEnd', ev.touches.length)
    },
    onTouchMove (ev) {
      if (ev.touches.length === 1) {
        let touch = ev.touches[0]
        this.onPointerMove(touch.clientX, touch.clientY)
      }
      // console.log('onTouchMove', this.mousePosX, this.mousePosY)
    },
    onResize () {
      let styles = window.getComputedStyle(this.$el)
      this.containerWidth = parseFloat(styles.width)
      this.containerHeight = parseFloat(styles.height)
    },
  },
}
</script>

<style lang="stylus" scoped>
.vue-zoomer
  position relative
  overflow hidden
  background-color hsla(0, 0%, 0%, 0.5)

.zoomer
  position absolute
  & > img
    // remove the 4px gap below the image
    vertical-align top
    -webkit-user-drag none
</style>
