<template>
  <div class="progress-circle">
    <!-- 无论外面radius传入多少，只要viewBox大小(直径长度正好包住圆)和circle半径一致就可很好的适应 -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <!-- stroke-dasharray描边和描边距离，控制用来描边的点划线的图案范式 stroke-dashoffset在圆形上的描边偏移，控制用来描边的点划线的图案范式-->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" 
      :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100 //周长
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray //stroke-dashoffset和stroke-dasharray相等为314时全部占满
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"

.progress-circle
  position relative
  circle
    stroke-width 8px
    transform-origin center
    &.progress-background
      transform scale(0.9) //缩小一点更趋近圆
      stroke $color-theme-d
    &.progress-bar
      transform scale(0.9) rotate(-90deg) //-90 倒着转
      stroke $color-theme
</style>
