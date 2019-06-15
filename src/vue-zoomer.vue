<!-- vue-zoomer: https://github.com/jarvisniu/vue-zoomer -->
<template>
  <!-- mousewheel.prevent is used to stop the page scroll elastic effects -->
  <div
    class="vue-zoomer"
    :style="{backgroundColor: backgroundColor}"
    @mousewheel.prevent="onMouseWheel"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchmove="onTouchMove"
  >
    <div class="zoomer" :style="wrapperStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import _debounce from 'lodash.debounce'

import TapDetector from './TapDetector'

export default {
  props: {
    minScale: { type: Number, default: 1 },
    maxScale: { type: Number, default: 5 },
    zoomed: { type: Boolean, default: false },
    resetTrigger: { type: Number, default: 1e5 },
    aspectRatio: { type: Number, default: 1 },
    backgroundColor: { type: String, default: 'transparent' },
    pivot: { type: String, default: 'cursor' }, // other options: image-center
    limitTranslation: { type: Boolean, default: true },
  },
  data () {
    return {
      // Container sizes, used to determin the initial zoomer size.
      // Need to reactive to window resizing.
      containerWidth: 1,
      containerHeight: 1,
      containerLeft: 0,
      containerTop: 0,
      // Store values: Interactions will at last change these values.
      // After rotation or resize, these values will keep still.
      // These three values are all relative to the container size.
      translateX: 0,
      animTranslateX: 0,
      translateY: 0,
      animTranslateY: 0,
      scale: 1,
      animScale: 1,
      // Mouse states
      lastFullWheelTime: 0,
      lastWheelTime: 0,
      lastWheelDirection: 'x',
      isPointerDown: false,
      pointerPosX: -1,
      pointerPosY: -1,
      twoFingerInitDist: 0,
      panLocked: true,
      // Others
      raf: null,
      tapDetector: null,
    }
  },
  computed: {
    wrapperStyle () {
      let translateX = this.containerWidth * this.animTranslateX
      let translateY = this.containerHeight * this.animTranslateY
      return {
        transform: [
          `translate(${ translateX }px, ${ translateY }px)`,
          `scale(${ this.animScale })`,
        ].join(' ')
      }
    },
  },
  watch: {
    scale (val) {
      if (val !== 1) {
        this.$emit('update:zoomed', true)
        this.panLocked = false
      }
    },
    resetTrigger: 'reset',
  },
  mounted () {
    this.tapDetector = new TapDetector()
    this.tapDetector.attach(this.$el)
    this.tapDetector.onDoubleTap(this.onDoubleTap)
    // console.log('container size: ', this.containerWidth, this.containerHeight)
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
    this.loop()
  },
  destroyed () {
    this.tapDetector.detach(this.$el)
    window.removeEventListener('resize', this.onWindowResize)
    window.cancelAnimationFrame(this.raf)
    // console.log('destroy')
  },
  methods: {
    // Main Logic --------------------------------------------------------------
    // scale
    // Zoom the image with the point at the pointer(mouse or pintch center) pinned.
    // Simplify: This can be regard as vector pointer to old-image-center scaling.
    tryToScale (scaleDelta) {
      let newScale = this.scale * scaleDelta
       // damping
      if (newScale < this.minScale || newScale > this.maxScale) {
        let log = Math.log2(scaleDelta)
        log *= 0.2
        scaleDelta = Math.pow(2, log)
        newScale = this.scale * scaleDelta
      }
      scaleDelta = newScale / this.scale
      this.scale = newScale
      if (this.pivot !== 'image-center') {
        let normMousePosX = (this.pointerPosX - this.containerLeft) / this.containerWidth
        let normMousePosY = (this.pointerPosY - this.containerTop) / this.containerHeight
        this.translateX = (0.5 + this.translateX - normMousePosX) * scaleDelta + normMousePosX - 0.5
        this.translateY = (0.5 + this.translateY - normMousePosY) * scaleDelta + normMousePosY - 0.5
      }
    },
    // pan
    onPointerMove (newMousePosX, newMousePosY) {
      if (this.isPointerDown) {
        let pixelDeltaX = newMousePosX - this.pointerPosX
        let pixelDeltaY = newMousePosY - this.pointerPosY
        // console.log('pixelDeltaX, pixelDeltaY', pixelDeltaX, pixelDeltaY)
        if (!this.panLocked) {
          this.translateX += pixelDeltaX / this.containerWidth
          this.translateY += pixelDeltaY / this.containerHeight
        }
      }
      this.pointerPosX = newMousePosX
      this.pointerPosY = newMousePosY
    },
    onInteractionEnd: _debounce(function ()  {
      this.limit()
      this.panLocked = this.scale === 1
      this.$emit('update:zoomed', !this.panLocked)
    }, 100),
    // limit the scale between max and min and the translate within the viewport
    limit () {
      // scale
      if (this.scale < this.minScale) {
        this.scale = this.minScale
        // FIXME this sometimes will not reset when pinching in
        // this.tryToScale(this.minScale / this.scale)
      } else if (this.scale > this.maxScale) {
        this.tryToScale(this.maxScale / this.scale)
      }
      // translate
      if (this.limitTranslation) {
        let translateLimit = this.calcTranslateLimit()
        if (Math.abs(this.translateX) > translateLimit.x) {
          this.translateX *= translateLimit.x / Math.abs(this.translateX)
        }
        if (Math.abs(this.translateY) > translateLimit.y) {
          this.translateY *= translateLimit.y / Math.abs(this.translateY)
        }
      }
    },
    calcTranslateLimit () {
      if (this.getMarginDirection() === 'y') {
        let imageToContainerRatio = this.containerWidth / this.aspectRatio / this.containerHeight
        let translateLimitY = (this.scale * imageToContainerRatio - 1) / 2
        if (translateLimitY < 0) translateLimitY = 0
        return {
          x: (this.scale - 1) / 2,
          y: translateLimitY,
        }
      } else {
        let imageToContainerRatio = this.containerHeight * this.aspectRatio / this.containerWidth
        let translateLimitX = (this.scale * imageToContainerRatio - 1) / 2
        if (translateLimitX < 0) translateLimitX = 0
        return {
          x: translateLimitX,
          y: (this.scale - 1) / 2,
        }
      }
    },
    getMarginDirection () {
      let containerRatio = this.containerWidth / this.containerHeight
      return containerRatio > this.aspectRatio ? 'x' : 'y'
    },
    onDoubleTap (ev) {
      if (this.scale === 1) {
        if (ev.clientX > 0) {
          this.pointerPosX = ev.clientX
          this.pointerPosY = ev.clientY
        }
        this.tryToScale(Math.min(3, this.maxScale))
      } else {
        this.reset()
      }
      this.onInteractionEnd()
    },
    // reset
    reset () {
      this.scale = 1
      this.panLocked = true
      this.translateX = 0
      this.translateY = 0
    },
    // reactive
    onWindowResize () {
      let styles = window.getComputedStyle(this.$el)
      this.containerWidth = parseFloat(styles.width)
      this.containerHeight = parseFloat(styles.height)
      this.limit()
    },
    refreshContainerPos () {
      this.containerLeft = +this.$el.offsetLeft || 0
      this.containerTop = +this.$el.offsetTop || 0
    },
    loop () {
      this.animScale = this.gainOn(this.animScale, this.scale)
      this.animTranslateX = this.gainOn(this.animTranslateX, this.translateX)
      this.animTranslateY = this.gainOn(this.animTranslateY, this.translateY)
      this.raf = window.requestAnimationFrame(this.loop)
      // console.log('loop', this.raf)
    },
    gainOn (from, to) {
      let delta = (to - from) * 0.3
      // console.log('gainOn', from, to, from + delta)
      if (Math.abs(delta) > 1e-5) {
        return from + delta
      } else {
        return to
      }
    },
    // Mouse Events ------------------------------------------------------------
    // Mouse wheel scroll,  TrackPad pinch or TrackPad scroll
    onMouseWheel (ev) {
      let currTime = Date.now()
      if (Math.abs(ev.wheelDelta) === 120) {
        // Throttle the TouchPad pinch on Mac, or it will be too sensitive
        if (currTime - this.lastFullWheelTime > 50) {
          this.onMouseWheelDo(ev)
          this.lastFullWheelTime = currTime
        }
      } else {
        if (currTime - this.lastWheelTime > 50 && typeof ev.deltaX === 'number') {
          this.lastWheelDirection = Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? 'x' : 'y'
          if (this.lastWheelDirection === 'x') {
            this.$emit('swipe', ev.deltaX > 0 ? 'left' : 'right')
          }
        }
        if (this.lastWheelDirection === 'y') {
          this.onMouseWheelDo(ev)
        }
      }
      this.lastWheelTime = currTime
    },
    onMouseWheelDo (ev) {
      // Value basis: One mouse wheel (wheelDelta=+-120) means 1.25/0.8 scale.
      let scaleDelta = Math.pow(1.25, ev.wheelDelta / 120)
      // console.log('onMouseWheel', ev.wheelDelta, scaleDelta)
      this.tryToScale(scaleDelta)
      this.onInteractionEnd()
    },
    onScroll (ev) {
      console.log(2)
    },
    onMouseDown (ev) {
      this.refreshContainerPos()
      this.isPointerDown = true
      // Open the context menu then click other place will skip the mousemove events.
      // This will cause the pointerPosX/Y NOT sync, then we will need to fix it on mousedown event.
      this.pointerPosX = ev.clientX
      this.pointerPosY = ev.clientY
      // console.log('onMouseDown', ev)
    },
    onMouseUp (ev) {
      this.isPointerDown = false
      this.onInteractionEnd()
    },
    onMouseMove (ev) {
      this.onPointerMove(ev.clientX, ev.clientY)
      // console.log('onMouseMove client, offset', ev.clientX, ev.clientY)
    },
    // Touch Events ------------------------------------------------------------
    onTouchStart (ev) {
      if (ev.touches.length === 1) {
        this.refreshContainerPos()
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
        // Near 1 to set 1
        if (Math.abs(this.scale - 1) < 0.1) this.scale = 1
        this.onInteractionEnd()
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
  // position relative
  overflow hidden
  transition background-color 0.5s

.zoomer
  // position absolute
  transform-origin 50% 50%
  width 100%
  height 100%
  & > img
    // remove the 4px gap below the image
    vertical-align top
    -webkit-user-drag none
</style>
