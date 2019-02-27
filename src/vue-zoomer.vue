<!-- vue-zoomer: https://github.com/jarvisniu/vue-zoomer -->
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
      <slot></slot>
    </div>
  </div>
</template>

<script>
import TapDetector from './TapDetector'

export default {
  props: {
    minScale: { type: Number, default: 1 },
    maxScale: { type: Number, default: 5 },
    zoomed: { type: Boolean, default: false },
  },
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
      scale: 1, // Relative to the container
      // Mouse states
      lastFullWheelTime: 0,
      isPointerDown: false,
      pointerPosX: -1,
      pointerPosY: -1,
      twoFingerInitDist: 0,
      // Others
      tapDetector: null,
    }
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
  watch: {
    scale (val) {
      this.$emit('update:zoomed', val !== 1)
    },
  },
  mounted () {
    this.tapDetector = new TapDetector()
    this.tapDetector.attach(this.$el)
    this.tapDetector.onDoubleTap(this.onDoubleTap)
    // console.log('container size: ', this.containerWidth, this.containerHeight)
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  },
  destroyed () {
    this.tapDetector.detach(this.$el)
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    // Main Logic --------------------------------------------------------------
    // scale
    // Zoom the image with the point at the pointer(mouse or pintch center) pinned.
    // Simplify: This can be regard as vector pointer to old-image-center scaling.
    tryToScale (scaleDelta) {
      let normMousePosX = this.pointerPosX / this.containerWidth
      let normMousePosY = this.pointerPosY / this.containerHeight
      let newScale = this.scale * scaleDelta
      if (newScale < this.minScale) newScale = this.minScale
      else if (newScale > this.maxScale) newScale = this.maxScale
      scaleDelta = newScale / this.scale
      this.scale = newScale
      this.translateX = (0.5 + this.translateX - normMousePosX) * scaleDelta + normMousePosX - 0.5
      this.translateY = (0.5 + this.translateY - normMousePosY) * scaleDelta + normMousePosY - 0.5
    },
    // pan
    onPointerMove (newMousePosX, newMousePosY) {
      if (this.isPointerDown) {
        let pixelDeltaX = newMousePosX - this.pointerPosX
        let pixelDeltaY = newMousePosY - this.pointerPosY
        // console.log('pixelDeltaX, pixelDeltaY', pixelDeltaX, pixelDeltaY)
        this.translateX += pixelDeltaX / this.containerWidth
        this.translateY += pixelDeltaY / this.containerHeight
      }
      this.pointerPosX = newMousePosX
      this.pointerPosY = newMousePosY
    },
    // reset
    onDoubleTap () {
      this.scale = 1
      this.translateX = 0
      this.translateY = 0
    },
    // reactive
    onWindowResize () {
      let styles = window.getComputedStyle(this.$el)
      this.containerWidth = parseFloat(styles.width)
      this.containerHeight = parseFloat(styles.height)
    },
    // Mouse Events ------------------------------------------------------------
    // Mouse wheel scroll,  TrackPad pinch or TrackPad scroll
    onMouseWheel (ev) {
      if (Math.abs(ev.wheelDelta) === 120) {
        // Throttle the TouchPad pinch on Mac, or it will be too sensitive
        let currTime = Date.now()
        if (currTime - this.lastFullWheelTime > 100) {
          this.onMouseWheelDo(ev)
          this.lastFullWheelTime = currTime
        }
      } else {
        this.onMouseWheelDo(ev)
      }
    },
    onMouseWheelDo (ev) {
      // Value basis: One mouse wheel (wheelDelta=+-120) means 1.25/0.8 scale.
      let scaleDelta = Math.pow(1.25, ev.wheelDelta / 120)
      // console.log('onMouseWheel', ev.wheelDelta, scaleDelta)
      this.tryToScale(scaleDelta)
    },
    onMouseDown (ev) {
      this.isPointerDown = true
      // Open the context menu then click other place will skip the mousemove events.
      // This will cause the pointerPosX/Y NOT sync, then we will need to fix it on mousedown event.
      this.pointerPosX = ev.clientX
      this.pointerPosY = ev.clientY
      // console.log('onMouseDown', ev)
    },
    onMouseUp (ev) {
      this.isPointerDown = false
    },
    onMouseMove (ev) {
      this.onPointerMove(ev.clientX, ev.clientY)
      // console.log('onMouseMove client, offset', ev.clientX, ev.clientY)
    },
    // Touch Events ------------------------------------------------------------
    onTouchStart (ev) {
      if (ev.touches.length === 1) {
        this.pointerPosX = ev.touches[0].clientX
        this.pointerPosY = ev.touches[0].clientY
        this.isPointerDown = true
      } else if (ev.touches.length === 2) {
        this.isPointerDown = true
        // pos
        this.pointerPosX = (ev.touches[0].clientX + ev.touches[1].clientX) / 2
        this.pointerPosY = (ev.touches[0].clientY + ev.touches[1].clientY) / 2
        // dist
        let distX = ev.touches[0].clientX - ev.touches[1].clientX
        let distY = ev.touches[0].clientY - ev.touches[1].clientY
        this.twoFingerInitDist = Math.sqrt(distX * distX + distY * distY)
      }
      // console.log('onTouchStart', ev.touches)
    },
    onTouchEnd (ev) {
      if (ev.touches.length === 0) {
        this.isPointerDown = false
      } else if (ev.touches.length === 1) {
        this.pointerPosX = ev.touches[0].clientX
        this.pointerPosY = ev.touches[0].clientY
      }
      // console.log('onTouchEnd', ev.touches.length)
    },
    onTouchMove (ev) {
      if (ev.touches.length === 1) {
        this.onPointerMove(ev.touches[0].clientX, ev.touches[0].clientY)
      } else if (ev.touches.length === 2) {
        // pos
        let newMousePosX = (ev.touches[0].clientX + ev.touches[1].clientX) / 2
        let newMousePosY = (ev.touches[0].clientY + ev.touches[1].clientY) / 2
        this.onPointerMove(newMousePosX, newMousePosY)
        this.pointerPosX = newMousePosX
        this.pointerPosY = newMousePosY
        // dist
        let distX = ev.touches[0].clientX - ev.touches[1].clientX
        let distY = ev.touches[0].clientY - ev.touches[1].clientY
        let newTwoFingerDist = Math.sqrt(distX * distX + distY * distY)
        this.tryToScale(newTwoFingerDist / this.twoFingerInitDist)
        this.twoFingerInitDist = newTwoFingerDist
      }
      // console.log('onTouchMove', this.pointerPosX, this.pointerPosY)
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
