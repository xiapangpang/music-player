<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <!-- songs数据拿到后才渲染出来 -->
        <div class="play" v-show="songs.length > 0" ref="play" @click="random">
          <span class="icon-play"></span>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!-- 为了让scroll正确计算song-list高度，需把songs作为data传入 -->
    <scroll :data="songs" class="list" ref="list" 
    :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll'
import SongList from 'base/song-list'
import Loading from 'base/loading'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
const RESERVED_HEIGHT = 40

export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
      // debugger
    }
  },
  created() {
    this.probeType = 3 //scroll组件里设置的1会截留，但需要实时派发scroll事件
    this.listenScroll = true //监听滚动事件
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight //会多次用到，记录图片高度，以防频繁操作dom
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  data() {
    return {
      scrollY: 0 //需要scrollY来配合scroll函数，默认值0
    }
  },
  methods: {
    scroll(pos) { 
      this.scrollY = pos.y //滚动时实时拿到scrollY的值
    },
    back() {
      this.$router.back()
    },
    //要想点击后播放，根据item设置playlist和sequencelist，根据index设置currentlist，playstate，默认展开播放器fullscreen，要提交很多mutations，去封装action
    selectItem(item, index) { //为啥传入item?song-list组件不知道点击时需要什么值，它尽可能告知所有值（元素，索引），父组件监听到这个事件，在事件回调函数里用不用这个item要根据实际情况看，现在是要播放整个列表，所以把this.songs作为list参数传入，如果需要是播放这首歌，item就有用，所以不要依赖外部怎么使用组件而去定义子组件的行为，子组件的行为应与其自身相关。
      this.selectPlay({
        list: this.songs, //item是整首歌song，list是songs
        index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    random() {
      this.randomPlay({ //配合背景图的随机播放全部文字按钮
        list: this.songs
      }) 
    },

    //组件底部要设置bottom，留空给mini播放器高度
    handlePlaylist(playlist) { //覆盖掉mixin里的handlePlaylist
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  watch: {
    scrollY(newY) { //要设置bg-layer的滚动，需监听scrollY
      // this.$refs.layer.style[transform] = `translate3d(0,${newY}px,0)` //但要控制不能滚过图片顶部
      //设置最大滚动量,-this.imageHeight为最小滚动量即最多滚到图片顶部，bg-player固定在整个屏幕
      // let translateY = Math.max(-this.imageHeight, newY) //但这是滚动到顶部了，可以加上一个固定值，顶部留点空间
      let translateY = Math.max(-this.imageHeight + RESERVED_HEIGHT, newY)
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`

      //但是往上滚动时文字会盖住图片，分情况设置z-index
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
      let zIndex = 0
      if(newY < this.minTranslateY) {
        // debugger
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.play.style.display = 'none' 
      }else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.play.style.display = '' //拉下来按钮展现
      }
      this.$refs.bgImage.style.zIndex = zIndex

      //下拉bg-image放大效果 和 上推高斯模糊效果
      let scale = 1
      let blur = 0
      //图片高度imageHeight乘以scale时图片高度imageHeight增加newY，滚动无缝贴合，即得以下公式
      const percent = Math.abs(newY / this.imageHeight)
      if(newY > 0) { //向下拉
        scale = 1 + percent
        zIndex = 10
      }else {
        blur = Math.min(percent * 20, 20) //percent最大为1，blur最大为20
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      this.$refs.filter.style[backdrop] = `blur(${blur}px)` //backdrop-filter苹果手机专有高斯模糊效果
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  mixins: [playlistMixin]
}
</script>

<style lang="stylus" scoped>
@import '../common/stylus/variable'
@import '../../common/stylus/mixin'

.music-list
  position fixed
  z-index 100
  top 0
  left 0
  bottom 0
  right 0
  background $color-background
  // .bg-image
  //   position relative
  //   width 100%
  //   height 300px
  //   background-size cover
  .bg-image  //图片加载前就已知道固定高度，设定scroll组件的top值
    position relative
    width 100%
    height 0
    padding-top 70% //控制宽高比10：7提前占位
    transform-origin top //配合scale往下拉bg-image时从上往下放大
    background-size cover
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7, 17, 27, 0.4)
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        border 1px solid $color-theme
        color $color-theme
        border-radius 100px
        font-size 0
        .icon-play
          display inline-block
          vertical-align middle
          margin-right 6px
          font-size $font-size-medium-x
        .text
          display inline-block
          vertical-align middle
          font-size $font-size-small
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-large
    color $color-text
  .list
    position absolute
    top 0
    bottom 0
    width 100%
    background $color-background
    .song-list-wrapper
      padding 20px 30px
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
  .bg-layer
    position relative
    height 100%
    background $color-background
</style>