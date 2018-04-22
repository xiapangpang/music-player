<template>
  <!-- 播放列表有歌曲时才显示 -->
  <div class="player" v-show="playlist.length > 0">
    <!-- 动画钩子函数 通过js创建css动画 enter和leave必须有回调函数 enter和after-enter有缩放效果 leave和after-leave不设置-->
    <transition name="normal" 
    @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt="">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <span class="icon-back"></span>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="imageWrapper">
                <img class="image" ref="image" :class="cdCls" :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 传入data是为了当currentLyric发生变化时自动调用refresh方法 -->
          <scroll class="middle-r" ref="lyriclist" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" v-for="(line, index) in currentLyric.lines" :key="index"
                :class="{'current':currentLineNum===index}">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange" @percentChanging="onProgressBarChanging" ref="progressBar"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <span :class="iconMode"></span>
            </div>
            <div class="icon i-left" :class="disableCls">
              <span class="icon-prev" @click="prev"></span>
            </div>
            <div class="icon i-center" :class="disableCls">
              <span :class="playIcon" @click="togglePlaying"></span>
            </div>
            <div class="icon i-right" :class="disableCls">
              <span class="icon-next" @click="next"></span>
            </div>
            <div class="icon i-right">
              <span :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper" ref="miniWrapper">
            <img width="40" height="40" :src="currentSong.image" :class="cdCls">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <span :class="miniPlayIcon" @click.stop="togglePlaying" class="icon-mini"></span>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <span class="icon-playlist"></span>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <!-- 只有指定地址不够，还要在currentSong发生改变时调用audio的play方法，
    要watch下currentSong变化 -->
    <audio :src="currentSong.url" ref="audio" @playing="ready" @error="error"
    @timeupdate="updateTime" @ended="end" @pause="paused"></audio>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {prefixStyle} from 'common/js/dom'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd', //用一个变量维护dot的变化
      playingLyric: null //cd下面当前播放的歌词
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong', //getters里的currentSong也要映射过来
      'playing',
      'currentIndex',
      'mode', //可以通过this.mode访问到当前的播放模式
      'sequenceList',
      'favoriteList'
    ]),
    //normal和mini播放器的图标切换
    playIcon() { //配合改变播放暂停的切换样式，播放时暂停图标，暂停时播放图标,不要搞反了
      return this.playing ? 'icon-pause' : 'icon-play' //icon-pause和icon-play对应字体图标文件里的
    },
    miniPlayIcon() { //mini的状态切换样式，同上
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini' //同上
    },
    //cd样式切换
    cdCls() {
      return this.playing ? 'play' : ''
    },
    //songReady时样式上的配合 不能点击时给一个disable的class
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    //计算歌曲播放比例,传到子组件progress-bar里，添加当前进度样式
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    //三种播放模式通过iconMode计算属性得到
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  created() {
    this.touch = {} //关联touchstart和touchmove，在created下是因为并不需要getter和setter
  },
  methods: {
    //展开和收起
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },

    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),

    // mini到normal动画相关 enter和after-enter阶段有缩放效果
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({ //注册animation
        name: 'move',
        animation,
        presets: {
          duration: 400, //间隔时间
          easing: 'linear' //缓动
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done) //运行animation  done是动画完之后执行，执行完后跳到afterEnter
    },
    afterEnter() {
      animations.unregisterAnimation('move') //done执行后跳到afterEnter
      this.$refs.cdWrapper.style.animation = '' //清空animation
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all .4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done) //监听transitionend事件，完成后调用done
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale() {
      const targetWidth = 40 //mini自身宽度
      const paddingLeft = 40 //mini中心到左边缘距离
      const paddingBottom = 30 //mini中心到底部边缘距离
      const paddingTop = 80 //normal到顶部边缘距离
      const width = window.innerWidth * 0.8 //normal自身宽度
      const scale = targetWidth / width //初始缩放比例
      const x = -(window.innerWidth / 2 - paddingLeft) //normal动画到minix轴的偏移量，normal中心到mini中心，向左移是负值
      const y = (window.innerHeight - paddingTop - width / 2) - paddingBottom //normal动画到miniy轴的偏移量，normal中心到mini中心，向下移是正值
      return {
        x,
        y,
        scale
      }
    },

    //播放暂停功能,切换状态：
    togglePlaying() {
      if(!this.songReady) { //歌曲加载好之后才能播放暂停
        return 
      }
      this.setPlayingState(!this.playing) //传payload
      if(this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },

    //前进后退功能：
    prev() {
      if(!this.songReady) { //歌曲加载好之后才能前进后退
        return
      }
      if(this.playlist.length === 1) { //只有一首歌时
        this.loop()
        // return
      }else {
        let index = this.currentIndex - 1
        if(index === -1) { //即当前歌曲为第一首歌 往前退变成最后一首歌
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index) //修改index(有提交mutation的过程)，cuurentSong随之发生变化
        //但切换下一首时但icon没有变化，即playing状态没有修改  
        if(!this.playing) { //如果playing状态为false即暂停状态，切下一首时调用togglePlaying改变playing的状态
          this.togglePlaying()
        }
      }
    },
    next() {
      if(!this.songReady) {
        return
      }
      if(this.playlist.length === 1) { //只有一首歌时
        this.loop()
        // return
      }else {
        let index = this.currentIndex + 1 //在mapGetter里传入了currentIndex，所以可通过this.currentIndex取到当前索引
        if(index === this.playlist.length) { //考虑到顺序播放，如果到了最后一首，下一首是第一首
          index = 0
        }
        this.setCurrentIndex(index) //修改index，cuurentSong随之发生变化
        if(!this.playing) { //如果playing状态为false即暂停状态，要调用togglePlaying切换状态
          this.togglePlaying()
        }
      }
    },
    //配合data里的标志位songReady修复连续点击时报错问题，歌曲ready时才能点击下一首
    ready() {
      this.songReady = true
      this.savePlayHistory(this.currentSong) //在player歌曲ready时需要写history，以便记录后面的最近播放列表等
      // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000)
      }
    },
    paused() {
      this.setPlayingState(false)
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
    },
    ...mapActions([
      'savePlayHistory',
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    error() { //网络加载失败或url有问题时播放暂停前进后退功能失效，触发error事件时保证也能够正常使用
      this.songReady = true
    },

    //播放器进度相关功能：
    updateTime(e) {
      this.currentTime = e.target.currentTime //audio有currentTime属性，赋值给data里的currentTime
    },
    format(interval) { //将得到的时间戳改成分和秒的格式
      interval = interval | 0 //向上取整
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad(num, n = 2) { //补零，n是补到的字符串长度
      num = num.toString()
      while(num.length < n) { //1位数时前面补零，2位数时不变
        num = '0' + num
      }
      return num
    },

    //父组件player接住/监听子组件progress-bar派发的percentChange事件
    // onProgressBarChange(percent) { //操作audio，currentTime不仅可读还可写
    //   const currentTime = this.currentSong.duration * percent
    //   this.$refs.audio.currentTime = currentTime
    //   if(!this.playing) { //暂停时拖动还是暂停的，需要变为播放状态
    //     this.togglePlaying()
    //   }
    //   if(this.currentLyric) {
    //     this.currentLyric.seek(currentTime * 1000)
    //   }
    // },
    onProgressBarChanging (percent) {
      this.currentTime = this.currentSong.duration * percent
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000)
      }
    },
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.currentTime = this.$refs.audio.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
      if (!this.playing) {
        this.togglePlaying()
      }
    },

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

    //拉到末尾还能继续播放
    end() { //利用audio自身的ended事件，当歌曲播放时派发
      if(this.mode === playMode.loop) { //单曲循环时
        this.loop()
      } else { //顺序随机播放时
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0 //audio自带的currentTime属性赋为0
      this.$refs.audio.play()
      if(this.currentLyric) {
        this.currentLyric.seek(0) //单曲循环时 到结束时又偏移到歌曲的开始
      }
    },

    //解析歌词
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        if(this.currentSong.lyric !== lyric) { //防止切换太快导致歌词乱掉
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if(this.playing) {
          // 这个时候有可能用户已经播放了歌曲，要切到对应位置
          this.currentLyric.seek(this.currentTime * 1000)
        }
        // console.log(this.currentLyric)
      }).catch(() => { //没有歌词情况下
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    //歌词滚动，保持当前高亮歌词在中间
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum //当前播放歌词
      if(lineNum > 5) { //为了保持当前歌词在中间，第五行以下的歌词以1s的速度往上自行滚动，高亮的那一行前面一直有5行歌词
        let lineEl = this.$refs.lyricLine[lineNum - 5] //p标签数组
        this.$refs.lyriclist.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyriclist.scrollToElement(0, 0, 1000)
      }
      this.playingLyric = txt //cd下面当前播放的歌词
    },

    //middle部分cd和lyric的左右滑动切换
    middleTouchStart(e) {
      this.touch.initiated = true
      // 用来判断是否是一次移动
      this.touch.moved = false
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
    },
    middleTouchMove(e) {
      if(!this.touch.initiated) { //如果没有经过touchstart就到了touchmove事件，就会return掉
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX //一开始点击的x轴的位置
      const deltaY = touch.pageY - this.touch.startY
      if(Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth //最开始停留的位置
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX)) //列表向左滚动宽度，最小值为-window.innerWidth，最大值为0
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth) //定义滑动比例，列表向左滚动宽度/屏幕宽度
      this.$refs.lyriclist.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)` //lyriclist是scroll组件，取其下的el元素
      this.$refs.lyriclist.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent //percent越大透明度越小
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      //分向左和向右滑动两种情况，滑动的距离超过10%就应滑动到目标位置
      if(this.currentShow === 'cd') { //右向左滑动
        if(this.touch.percent > 0.1) { //比例大于0.1，不应该跑到最左边
          offsetWidth = -window.innerWidth //最终停的位置
          opacity = 0
          this.currentShow = 'lyric'
        }else {
          offsetWidth = 0
          opacity = 1
        }
      }else { //左向右滑动
        if(this.touch.percent < 0.9) {
          offsetWidth = 0 //超过10%就偏移回去
          this.currentShow = 'cd'
          opacity = 1
        }else { //大于0.9 没有滑动
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyriclist.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)` //最终位置
      this.$refs.lyriclist.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },

    //点击右下角的icon-playlist按钮,显示歌曲列表playlist
    showPlaylist() {
      this.$refs.playlist.show() //调用playlist组件里的show方法
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
    currentSong(newSong, oldSong) {
      if(!newSong.id) { //歌曲没有时return掉，不然还会调用currentSong的getLyric，报错
        return
      }
      if(newSong.id === oldSong.id) { //id没变就什么都不做,防止暂停时切换模式变成了播放状态，会触发currentSong的watcher
        return 
      }
      this.songReady = false
      if(this.currentLyric) {
        this.currentLyric.stop()
        //清理操作
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      this.$refs.audio.src = newSong.url
      this.$refs.audio.play()
      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      clearTimeout(this.timer)
      this.timer = setTimeout(() => { //dom渲染之后再调play
        this.songReady = true
      }, 5000) //在手机浏览器里播放，切到后台时js不会执行但audio的play会使歌曲播放完并触发end但不执行，再切到前台时songReady永远都不会变为true，故需1s后
      this.getLyric()
    },
    playing(newPlaying) {
      if (!this.songReady) {
        return
      }
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause() //play和pause是audio自带的方法
      })
    },
    fullScreen(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.lyriclist.refresh()
          this.$refs.progressBar.setProgressOffset(this.percent)
        }, 20)
      }
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'

.player
  .normal-player
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 150
    background $color-background
    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      opacity 0.6
      filter blur(20px)
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
      .title
        width 70%
        margin 0 auto
        text-align center
        line-height 40px
        no-wrap()
        font-size $font-size-large
        color $color-text
      .subtitle
        line-height 20px
        text-align center
        font-size $font-size-medium
        color $color-text
    .middle
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          left 10%
          top 0
          width 80%
          height 100%
          .cd
            width 100%
            height 100%
            border-radius 50%
            border 10px solid rgba(255, 255, 255, .1)
            box-sizing border-box
            &.play
              animation rotate 20s linear infinite //rotate的实现在最下面
            &.pause
              animation-play-state paused //css3属性 animation-play-state: paused|running
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              border-radius 50%
        .playing-lyric-wrapper
          width 80%
          margin 30px auto 0 auto
          overflow hidden
          text-align center
          .playing-lyric
            height 20px
            line-height 20px
            font-size $font-size-medium
            color $color-text-l   
      .middle-r
        display inline-block
        vertical-align top
        width 100%
        height 100%
        overflow hidden
        .lyric-wrapper
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height 32px
            color $color-text-l
            font-size $font-size-medium
            &.current
              color $color-text
    .bottom 
      position absolute
      bottom 50px
      width 100%
      .dot-wrapper
          text-align center
          font-size 0
          .dot
            display inline-block
            vertical-align middle
            margin 0 4px
            width 8px
            height 8px
            border-radius 50%
            background $color-text-l
            &.active
              width 20px
              border-radius 5px
              background $color-text-ll
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0px auto
        padding 10px 0
        .time
          color $color-text
          font-size $font-size-small
          flex 0 0 30px
          line-height 30px
          width 30px
          &.time-l
            text-align left
          &.time-r
            text-align right
        .progress-bar-wrapper
          flex: 1
      .operators
          display flex
          align-items center
          .icon
            flex 1
            color $color-theme
            &.disable
              color $color-theme-d
            span
              font-size 30px
          .i-left
            text-align right
          .i-center
            text-align center
            padding 0 20px
            span
              font-size 40px
          .i-right
            text-align left
          .icon-favorite
            color $color-sub-theme

    &.normal-enter-active, &.normal-leave-active
      transition all .4s
      .top, .bottom
        transition .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      .top
        transform translate3d(0, -100px, 0)
      .bottom
        transform translate3d(0, 100px, 0)

  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 180
    width 100%
    height 60px
    background $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition all .4s
    &.mini-enter, &.mini-leave-to
      opacity 0
    .icon
      flex 0 0 40px
      width 40px
      height 40px
      padding 0 10px 0 20px
      img
        border-radius 50%
        &.play
          animation rotate 20s linear infinite
        &.pause
          animation-play-state paused
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        no-wrap()
        font-size $font-size-medium
        color $color-text
      .desc
        no-wrap()
        font-size $font-size-small
        color $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size 30px
        color $color-theme-d
      .icon-mini
        font-size 32px
        position absolute
        left 0
        top 0

@keyframes rotate 
  0% 
    transform rotate(0)
  100%
    transform rotate(360deg)
</style>