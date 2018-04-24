<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song, index) in songs" :key="index" @click="selectItem(song, index)">
        <div class="rank" v-show="rank">
          <!-- 前三个有奖杯图标样式，后面的都是文案 -->
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    rank: { //对应v-show="rank"
      type: Boolean,
      default: false //默认没有排行样式
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer} · ${song.album}`
    },
    selectItem(item, index) { //因为是基础组件，只是派发事件，不涉及业务逻辑，告诉外部父组件我被点击以及元素是什么索引是什么，去父组件music-list继续
      this.$emit('select', item, index)
    },
    getRankCls(index) {
      if(index <= 2) {
        return `icon icon${index}` //奖杯图标样式
      }else {
        return 'text' //文案样式
      }
    },
    getRankText(index) {
      if(index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/variable"
  @import "../common/stylus/mixin"

  .song-list
    .item
      display flex
      align-items center
      height 64px
      font-size $font-size-medium
      box-sizing border-box
      .rank
        flex 0 0 25px
        width 25px
        margin-right 30px
        text-align center
        .icon
          display inline-block
          width 25px
          height 24px
          background-size 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color $color-theme
          font-size $font-size-large
      .content
        flex 1
        line-height 20px
        overflow hidden
        .name
          no-wrap()
          color $color-text
        .desc
          no-wrap()
          color $color-text-d
          margin-top 4px
</style>
