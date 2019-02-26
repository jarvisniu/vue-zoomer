<template>
  <div class="vue-zoomer">
    <div class="zoomer" :style="wrapperStyle">
    <!-- <div>Vue Zoomer</div> -->
    <slot/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 容器宽高，用来决定缩放器的宽高。需要响应缩放和旋转。
      containerWidth: 1,
      containerHeight: 1,
      // 中心值：交互最终变更这些值，旋转缩放后该值维持不变；
      translateX: 0,
      translateY: 0,
      scale: 0.5, // 相对容器的
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
</style>
