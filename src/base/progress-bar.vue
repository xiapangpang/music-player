<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" 
        @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>    
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
const progressBtnWidth = 16 //计算整个progress的宽度要减去按钮的宽度

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {} //用实例上的一个touch对象来维护在不同的回调之间的通讯，在不同的回调函数里需共享数据
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true //给this.touch一个标志位，表示已初始化
      this.touch.startX = e.touches[0].pageX //记录一开始的点击的x轴位置
      this.touch.left = this.$refs.progress.clientWidth //记录开始点击时已在进度条上的偏移值
    },
    progressTouchMove(e) { //move时实时改变滚动条的进度
      if(!this.touch.initiated) { //如果没有经过touchstart就到了touchmove事件，就会return掉
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX //touchmove事件里有新的touch值,x轴的移动距离
      //最小值为0，一开始btn所在位置是已经偏移的位置，加上手指移动的偏移量；当手指拖动很远时偏移量肯定会超过整个进度条宽度，所以要小于bar的宽度，和进度条宽度即下面的barWidth进行Math.min
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
      this.$emit('percentChanging', this._getPercent())
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent() //通知父组件改变了多少percent，拖动释放就能跳到相应位置而不是停不住
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px` //进度条的偏移量
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)` //按钮小球的偏移量
    },
    // _triggerPercent() { //通知父组件要改变的percent
    //   const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
    //   const percent = this.$refs.progress.clientWidth / barWidth
    //   this.$emit('percentChange', percent) //告诉外界拖动完成，percent要改变，派发percentChange事件，在父组件player中监听percentChange事件
    // },
    progressClick(e) { //设置偏移量
      const rect = this.$refs.progressBar.getBoundingClientRect() //progressBar到左边缘的距离
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth) 
      this._triggerPercent() //通知父组件改变了多少percent
    },

    setProgressOffset(percent) {
      if (percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = percent * barWidth
        this._offset(offsetWidth)
      }
    },
    _triggerPercent() {
      this.$emit('percentChange', this._getPercent())
    },
    _getPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      return this.$refs.progress.clientWidth / barWidth
    }
  },
  watch: {
    // percent(newPercent) {
    //   if(newPercent >= 0 && !this.touch.initiated) { //没有在拖动过程中才可以改变percent，不然会跳动，但拖到一个位置停不下来，要在end时派发事件_triggerPercent
    //     const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
    //     const offsetWidth = barWidth * newPercent //进度条宽度*歌曲播放比例=偏移宽度
    //     this._offset(offsetWidth)
    //   }
    // }

    percent(newPercent) {
      this.setProgressOffset(newPercent)
    }
  } 
}
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/variable'

  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      height 4px
      background rgba(0, 0, 0, .3)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        top -13px
        left -8px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>
