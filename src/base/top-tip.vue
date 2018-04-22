<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
      //如果多次点击添加歌曲即快速点击多首歌，多次show的时候timer只会执行一次
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide() {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"

.top-tip
  position fixed
  top 0
  width 100%
  z-index 500
  background $color-dialog-background
  &.drop-enter-active, &.drop-leave-active
    transition all .3s
  &.drop-enter, &.drop-leave-top
    transform translate3d(0, -100%, 0)
</style>
