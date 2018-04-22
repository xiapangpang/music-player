<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <ul>
        <li class="item" v-for="(item, index) in topList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" alt="">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getTopList} from 'api/rank'
import Scroll from 'base/scroll'
import Loading from 'base/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  data() {
    return {
      topList: []
    }
  },
  created() {
    // setTimeout(() => { //测试loading
    //   this._getTopList()
    // }, 1000)
    this._getTopList()
  },
  methods: {
    _getTopList() {
      // debugger
      getTopList().then(res => {
        if(res.code === 0) {
          // console.log(res.data.topList)
          this.topList = res.data.topList
        }
      })
    },
    //组件底部要设置bottom，留空给mini播放器高度
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh() //dom结构变化需要手动refresh scroll组件
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item) 
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  watch: {
    topList() {
      setTimeout(() => {
        this.$Lazyload.lazyLoadHandler()
      }, 20)
    }
  },
  components: {
    Scroll,
    Loading
  },
  mixins: [playlistMixin]
}
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"
@import "../../common/stylus/mixin"

.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0 20px
      padding-top 20px
      height 100px
      &:last-child
        padding-bottom 20px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        padding 0 20px
        height 100px
        overflow hidden
        background $color-highlight-background
        color $color-text-d
        font-size $font-size-small
        .song
          no-wrap()
          line-height 26px
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
