<template>
  <div class="app">
    <!-- <div>App</div> -->
    <vue-zoomer class="zoomer">
      <img src="../assets/landscape-1.jpg" class="image">
    </vue-zoomer>
  </div>
</template>

<style lang="stylus">
body
  margin 0
</style>

<style lang="stylus" scoped>
.app
  width 100vw
  height 100vh

.zoomer
  width 100%
  height: 100%

.image
  width 100%
  height 100%
  object-fit contain
</style>
