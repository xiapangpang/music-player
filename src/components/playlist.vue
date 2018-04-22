<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <span class="icon" :class="iconMode" @click="changeMode"></span>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="deleteAllConfirm">
              <span class="icon-clear"></span>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="listContent" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li class="item" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)" ref="listItem">
              <span class="current" :class="getCurrentIcon(item)"></span>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <span :class="getFavoriteIcon(item)"></span>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <span class="icon-delete"></span>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <span class="icon-add"></span>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <delete-all-confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空"
    @confirm="deleteAll"></delete-all-confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Scroll from 'base/scroll'
import {playMode} from 'common/js/config'
import DeleteAllConfirm from 'base/delete-all-confirm'
import {shuffle} from 'common/js/util'
import AddSong from 'components/add-song'

export default {
  data() {
    return {
      showFlag: false,
      refreshDelay: 120
    }
  },
  methods: {
    show() {
      this.showFlag = true
      //当调用show时，是从display:none切为隐藏到显示的，显示以后dom才能被正确计算，
      //这时要重新计算bs，所以在show时要调用scroll的refresh方法重新计算。否则无法滚动。
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong) //打开播放列表时需要一开始就滚动到当前播放歌曲
      }, 20)
    },
    hide() {
      this.showFlag = false
    },

    //当前播放歌曲高亮样式
    getCurrentIcon(item) {
      if(this.currentSong.id === item.id) {
        return 'icon-play'
      }else {
        return ''
      }
    },

    //点击播放列表歌曲切换到该歌曲
    selectItem(item, index) {
      //随机播放时，找到当前播放列表元素在playlist中的索引，去setCurrentIndex；其他模式直接setCurrentIndex
      if(this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => { //playlist从getters中取；当前播放列表元素id===item的id，找到这个元素在playlist的索引然后设置这个索引
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true) //不仅要切换歌曲还要切换播放状态
    },

    //滚动列表，保证当前播放歌曲在列表第一个位置：找到当前歌曲在sequenceList中的索引，然后访问到第几个li，然后滚动过去
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((song) => { //找到当前歌曲在sequenceList中的索引
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300) //300ms动画，滚动到当前播放的li
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),

    //点击×从列表中删除歌曲
    deleteOne(item) {
      this.deleteSong(item)
      //防止整个列表删完后再点击一首歌，playlist会弹出来，因为playlist长度为0时，父级player的display为none，当再去点击一首歌时，display不为none，所以一下就展示了
      if(!this.playlist.length) {
        this.hide()
      }
    },
    ...mapActions([
      'deleteSong',
      'deletSongList',
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),

    //点击垃圾桶，全部清除
    //考虑用户体验，不能直接deleteAll，要先弹窗提醒
    deleteAllConfirm() {
      this.$refs.confirm.show()
    },
    deleteAll() {
      this.deletSongList()
      this.hide()
    },

    //和播放器player组件里一样
    //三种播放模式的切换
    changeMode() {
      // debugger
      //三种样式的切换
      const mode = (this.mode + 1) % 3 //通过this.mode取到mode,到下一种状态就+1，只有三种状态要取模
      this.setPlayMode(mode) 
      //三种列表的切换
      let list = null
      if(mode === playMode.random) { //对sequenceList做洗牌,shuffle函数
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list) //播放模式切换时并不希望当前播放的歌曲改变
      this.setPlaylist(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => { //当list变化时要重新设置currentIndex，findIndex是es6的语法，接收一个函数，函数里可拿到每个list元素
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index) //playlist改变时要让currentIndex也改变，来保证currentSong不变
    },

    //点击下方添加歌曲到队列时，弹出添加歌曲的页面
    addSong() {
      this.$refs.addSong.show()
    },

    //右下角收藏红心按钮
    getFavoriteIcon(song) {
      if(this.isFavorite(song)) {
        return 'icon-favorite'
      }else {
        return 'icon-not-favorite'
      }
    },
    toggleFavorite(song) {
      if(this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      }else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1 //index大于-1，isFavorite为真，否则为假
    }

  },
  watch: {
    //配合scrollToCurrent，什么时候滚动列表使当前播放歌曲在列表第一个位置？歌曲切换成功时，就需要watch currentSong的变化
    currentSong(newSong, oldSong) {
      if(!this.showFlag || newSong.id === oldSong.id) {
        return 
      }
      // this.scrollToCurrent(newSong)
      setTimeout(() => {
        this.scrollToCurrent(newSong)
      }, 20)
    }
  },
  computed: {
    //左上角三种播放模式的切换，通过iconMode计算属性得到
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode',
      'favoriteList'
    ]),
    //左上角三种播放模式右侧相对应的文案：
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  components: {
    Scroll,
    DeleteAllConfirm,
    AddSong
  }
}
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"
@import "../../common/stylus/mixin"

.playlist 
//全屏铺满
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 200
  background-color $color-background-d
  &.list-fade-enter-active, &.list-fade-leave-active
    transition opacity 0.3s
    .list-wrapper
      transition all 0.3s
  &.list-fade-enter, &.list-fade-leave-to
    opacity 0
    .list-wrapper
      transform translate3d(0, 100%, 0)
  &.list-fade-enter
  .list-wrapper
    position absolute
    left 0
    bottom 0
    width 100%
    background-color $color-highlight-background
    .list-header
      position relative
      padding 20px 30px 10px 20px
      .title
        display flex
        align-items center
        .icon
          margin-right 10px
          font-size 30px
          color $color-theme-d
        .text
          flex 1
          font-size $font-size-medium
          color $color-text-l
        .clear
          extend-click()
          .icon-clear
            font-size $font-size-medium
            color $color-text-d
    .list-content
      max-height 240px //若有多出的内容，需要滚动列表
      overflow hidden
      .item
        display flex
        align-items center
        height 40px
        padding 0 30px 0 20px
        overflow hidden
        &.list-enter-active, &.list-leave-active
          transition all 0.1s
        &.list-enter, &.list-leave-to
          height 0
        .current
          flex 0 0 20px
          width 20px
          font-size $font-size-small
          color $color-theme-d
        .text
          flex 1
          no-wrap()
          font-size $font-size-medium
          color $color-text-d
        .like
          extend-click()
          margin-right 15px
          font-size $font-size-small
          color $color-theme
          .icon-favorite
            color $color-sub-theme
        .delete
          extend-click()
          font-size $font-size-small
          color $color-theme
    .list-operate
      width 140px
      margin 20px auto 30px auto
      .add
        display flex
        align-items center
        padding 8px 16px
        border 1px solid $color-text-l
        border-radius 100px
        color $color-text-l
        .icon-add
          margin-right 5px
          font-size $font-size-small-s
        .text
          font-size $font-size-small
    .list-close
      text-align center
      line-height 50px
      background $color-background
      font-size $font-size-medium-x
      color $color-text-l
</style>