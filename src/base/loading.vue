<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/variable'

  .loading
    text-align center
    width 100%
    .desc
      line-height 20px
      font-size $font-size-small
      color $color-text-l
</style>
