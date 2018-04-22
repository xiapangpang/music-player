<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <span class="icon-back"></span>
      </div>
      <div class="switches-wrapper">
        <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" @click="random">
        <span class="icon-play"></span>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="list-scroll" v-if="currentIndex===0" :data="favoriteList" ref="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" v-if="currentIndex===1" :data="playHistory" ref="playList">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches'
import {mapGetters, mapActions} from 'vuex'
import Scroll from 'base/scroll'
import SongList from 'base/song-list'
import Song from 'common/js/song'
import {playlistMixin} from 'common/js/mixin'
import NoResult from 'base/no-result'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {name: '我喜欢的'},
        {name: '最近听的'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'favoriteList'
    ]),
    //判断no-result组件在哪个tab下显示，是计算属性！！
    noResult() {
      // if(this.currentIndex === 0 && !this.favoriteList.length) {
      //   return true
      // }
      // if(this.currentIndex === 1 && !this.playHistory.length) {
      //   return true
      // }
      // return false
      if(this.currentIndex === 0) {
        return !this.favoriteList.length
      }else {
        return !this.playHistory.length
      }
    },
    noResultDesc() {
      if(this.currentIndex === 0) {
        return '暂无收藏歌曲'
      }else {
        return '你还没有听过歌曲'
      }
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song) {
      this.insertSong(new Song(song)) //song从历史数据中读取，需要实例化一下
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ]),
    random() { //调用actions里的randomPlay
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if(list.length === 0) { //没有list时点击随机播放按钮控制台也不会有mutation记录
        return
      }
      // list = list.map((song) => { //list不是song的实例，需要new Song包装，因为song的实例会有getLyric方法，只有song的实例才有
      //   return new Song(song)
      // })
      this.randomPlay({list})
    },
    //组件底部要设置bottom，留空给mini播放器高度
    handlePlaylist(playlist) { //覆盖掉mixin里的handlePlaylist
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      //俩scroll都是v-if，可能不存在，先做判断
      this.$refs.favoriteList && this.$refs.favoriteList.refresh() //刷新scroll组件
      this.$refs.playList && this.$refs.playList.refresh()
    }
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"

.user-center
  position fixed
  top 0
  bottom 0
  z-index 100
  width 100%
  background $color-background
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
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
  .switches-wrapper
    margin 10px 0 30px 0
  .play-btn
    box-sizing border-box
    width 135px
    padding 7px 0
    margin 0 auto
    text-align center
    border 1px solid  $color-text-l
    color $color-text-l
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
  .list-wrapper
    position absolute
    top: 110px
    bottom 0
    width 100%
    .list-scroll
      height 100%
      overflow hidden
      .list-inner
        padding 20px 30px
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>