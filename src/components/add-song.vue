<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <span class="icon-close"></span>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" @query="onQueryChange" ref="searchBox"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll class="list-scroll" v-if="currentIndex===0" :data="playHistory" ref="songList">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" v-if="currentIndex===1" :data="searchHistory" ref="searchList" :refreshDelay="refreshDelay">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @listScroll="blurInput" @select="saveSearch"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <span class="icon-ok"></span>
          <span class="text">一首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box'
import Suggest from 'components/suggest'
import {mapActions, mapGetters} from 'vuex'
import Switches from 'base/switches'
import Scroll from 'base/scroll'
import SongList from 'base/song-list'
import Song from 'common/js/song'
import SearchList from 'base/search-list'
import TopTip from 'base/top-tip'

export default {
  data() {
    return {
      refreshDelay: 120, //增删歌曲动画时间100ms
      showFlag: false,
      query: '',
      showSinger: false,
      currentIndex: 0,
      switches: [
        {name: '最近播放'},
        {name: '搜索历史'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'searchHistory'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        if(this.currentIndex === 0) {
          this.$refs.songList.refresh()
        }else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    
    //和search组件里一样，是search-box、suggest和search-list上共有方法
    onQueryChange(query) {
      this.query = query //从搜索框里拿到query的变化值，然后把query通过props传递给suggest组件，会触发query的watch
    },
    //保存搜索结果
    saveSearch() {
      this.saveSearchHistory(this.query)
      this.$refs.topTip.show() //搜索结果列表项被点击时弹出top-tip
    },
    //移动端优化，滚动列表时input失去焦点
    blurInput() {
      this.$refs.searchBox.blur()
    },
    ...mapActions([
      'saveSearchHistory',
      'insertSong',
      'deleteSearchHistory'
      // 'clearSearchHistory'
    ]),
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    //点击右侧的×，删除一条
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },

    //shortcut部分，配合switches组件里往外派发的switch事件，此父组件监听
    switchItem(index) {
      this.currentIndex = index
    },
    //点击最近播放列表中的歌曲（除了第一首）时，插到当前播放列表中
    selectSong(song, index) {
      if(index !== 0) {
        // this.insertSong(song) //不能直接传song，因为songs数组里的song只是实例
        this.insertSong(new Song(song))
        this.$refs.topTip.show() //点击最近播放列表项时弹出top-tip
      }
    },
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  }
}
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"
@import "../../common/stylus/mixin"

.add-song
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 200
  background $color-background
  &.slide-enter-active, $.slide-leave-active
    transition all .3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .header
    position relative
    height 44px
    text-align center
    .title
      line-height 44px
      font-size $font-size-large
      color $color-text
    .close
      position absolute
      top 0
      right 8px
      .icon-close
        display block
        padding 12px
        font-size 20px
        color $color-theme
  .search-box-wrapper
    margin 20px
  .shortcut
    .list-wrapper
      position absolute
      top 165px
      bottom 0
      width 100%
      .list-scroll
        height 100%
        overflow hidden
        .list-inner
          padding 20px 30px
  .search-result
    position fixed
    top 124px
    bottom 0
    width 100%
  .tip-title
    text-align center
    padding 18px 0
    font-size 0
    .icon-ok
      font-size $font-size-medium
      color $color-theme
      margin-right 4px
    .text
      font-size $font-size-medium
      color $color-text
</style>