<template>
  <!-- touchmove.prevent is used to stop the page scroll elastic effects -->
  <div
    :style="{
      width: containerWidth + 'px',
      height: containerHeight + 'px',
    }"
    :class="{
      'anim': !disableAnim && !isPointerDown,
    }"
    class="vue-zoomer-gallery"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseout="isPointerDown = false"
    @mouseup="onMouseUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchmove.prevent="onTouchMove"
  >
    <v-zoomer
      v-for="(n, i) in 3"
      :key="i + selIndex"
      :class="['left', 'middle', 'right'][i]"
      class="slide"
      :style="[leftStyle, middleStyle, rightStyle][i]"
      :max-scale="10"
      :zoomed.sync="currentZoomed"
      :reset-trigger="i"
    >
      <img
        v-if="i - 1 + selIndex > -1 && i - 1 + selIndex < list.length"
        :src="list[i - 1 + selIndex]"
        style="object-fit: contain; width: 100%; height: 100%;"
      >
    </v-zoomer>
  </div>
</template>

<script>

const SLIDE_WIDTH_THRESH = 50 // in px

export default {
  props: {
    value: { type: Number, required: true },
    list: { type: Array, required: true },
  },
  data () {
    return {
      // env states
      containerWidth: 1,
      containerHeight: 1,
      // main states
      selIndex: this.value,
      animSelIndex: this.value,
      currentZoomed: false,
      disableAnim: true,
      // interaction states
      isPointerDown: false,
      lastPointerX: 0,
      slideOffsetX: 0,
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
    slideThresh () {
      return Math.max(SLIDE_WIDTH_THRESH, this.containerWidth * 0.1)
    },
  },
  watch: {
    value (val) {
      if (val !== this.animSelIndex) {
        this.selIndex = val
        this.animSelIndex = val
      }
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
      if (this.isPointerDown && !this.currentZoomed) {
        let factor = 1
        if (
          (this.selIndex === 0 && deltaX > 0 && this.slideOffsetX + deltaX > 0) ||
          (this.selIndex === this.list.length - 1 && deltaX < 0 && this.slideOffsetX + deltaX < 0)
        ) factor = 0.3
        this.slideOffsetX += deltaX * factor
      }
    },
    onPointerUp () {
      if (this.slideOffsetX < -this.slideThresh) {
        // next page
        this.paginate(1)
      } else if (this.slideOffsetX > this.slideThresh) {
        // prev page
        this.paginate(-1)
      } else {
        // only apply the animation
        this.paginate(0)
      }
    },
    paginate (deltaIndex) {
      let targetIndex = this.selIndex + deltaIndex
      if (targetIndex < 0 || targetIndex >= this.list.length) {
        this.slideOffsetX = 0
        return
      }

      this.slideOffsetX = this.containerWidth * -deltaIndex
      this.disableAnim = false
      // update the selIndex before the animation to remove the delay feeling
      this.$emit('input', targetIndex)
      this.animSelIndex = targetIndex
      setTimeout(() => {
        this.selIndex = targetIndex
        this.slideOffsetX = 0
        this.disableAnim = true
      }, 500)
    },
    onMouseDown (ev) {
      this.isPointerDown = true
      this.lastPointerX = ev.clientX
    },
    onMouseUp (ev) {
      this.isPointerDown = false
      this.onPointerUp()
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
        this.onPointerUp()
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
.vue-zoomer-gallery
  position relative
  background-color hsl(210, 50%, 85%)
  // border solid 1px red
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

// Transition Animations
.vue-zoomer-gallery.anim
  .slide
    transition left 0.5s
</style>
