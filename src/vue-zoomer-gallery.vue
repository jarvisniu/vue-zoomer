<template>
  <!-- touchmove.prevent is used to stop the page scroll elastic effects -->
  <div
    :class="{
      'anim': autoSliding && !isPointerDown,
    }"
    :style="{
      'background-color': backgroundColor,
    }"
    class="vue-zoomer-gallery"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseout="onMouseUp"
    @mouseup="onMouseUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchmove.prevent="onTouchMove"
  >
    <v-zoomer
      v-for="(n, i) in 3"
      ref="zoomers"
      :key="i + selIndex"
      :class="['left', 'middle', 'right'][i]"
      class="slide"
      :style="[leftStyle, middleStyle, rightStyle][i]"
      :max-scale="10"
      :zoomed.sync="currentZoomed"
      :reset-trigger="i"
      :aspect-ratio="imageAspectRatios[selIndex + i - 1] || 1"
      :pivot="pivot"
      :limit-translation="limitTranslation"
      @swipe="onImageSwipe"
    >
      <img
        v-if="selIndex + i - 1 > -1 && selIndex + i - 1 < list.length"
        :src="list[selIndex + i - 1]"
        style="object-fit: contain; width: 100%; height: 100%;"
        @load="onImageLoad(selIndex + i - 1, $event)"
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
    backgroundColor: { type: String, default: '#333' },
    pivot: { type: String, default: 'cursor' },
    limitTranslation: { type: Boolean, default: true },
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
      autoSliding: false,
      imageAspectRatios: [], // aspect ratio (width / height) of images
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
    // api
    reset () {
      this.$refs.zoomers.forEach(zoomer => {
        zoomer.reset()
      })
    },
    // reactive
    onWindowResize () {
      let styles = window.getComputedStyle(this.$el)
      this.containerWidth = parseFloat(styles.width)
      this.containerHeight = parseFloat(styles.height)
    },
    onPointerMove (deltaX) {
      if (this.isPointerDown && !this.currentZoomed) {
        let factor = (
          (this.selIndex === 0 && deltaX > 0 && this.slideOffsetX + deltaX > 0) ||
          (this.selIndex === this.list.length - 1 && deltaX < 0 && this.slideOffsetX + deltaX < 0)
        ) ? 0.3 : 1
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
      this.autoSliding = true
      // update the selIndex before the animation to remove the delay feeling
      this.$emit('input', targetIndex)
      this.animSelIndex = targetIndex
      setTimeout(() => {
        this.selIndex = targetIndex
        this.slideOffsetX = 0
        this.autoSliding = false
      }, 400)
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
    onImageLoad (index, ev) {
      let aspectRatio = ev.target.naturalWidth / ev.target.naturalHeight
      this.$set(this.imageAspectRatios, index, aspectRatio)
    },
    onImageSwipe (direction) {
      this.paginate(direction == 'right' ? -1 : 1)
    },
  },
}
</script>

<style lang="stylus" scoped>
.vue-zoomer-gallery
  position relative
  // border solid 1px red
  overflow hidden
  user-select none
  min-width 100px
  min-height 100px
  & > *
    display inline-block

  // Transition Animations
  &.anim
    .slide
      transition left 0.4s

.slide
  position absolute
  top 0
  object-fit contain
  width 100%
  height 100%
  // border solid 1px silver
  -webkit-user-drag none
</style>
