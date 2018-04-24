<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{'active':currentPageIndex===index}"></span>
    </div>
  </div>
</template>

<script>
import {addClass} from 'common/js/dom'
import BScroll from 'better-scroll'

export default {
  name: 'slider',
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() { // 在domready时，初始化BS，保证渲染时间;ref需要在dom渲染完成后才会有,在mounted(){} 钩子中调用或者this.$nextTick(()=>{})中调用
    setTimeout(() => {
      this._setSliderWidth() //不传参数isResize是undefined，一开始的this.loop && !isResize为真，两倍
      this._initDots() //在slider初始化之前要先初始化dots，和children.length保持一致
      this._initSlider()

      if(this.autoPlay) { //设置自动播放
        this._play()
      }
    }, 20) //刷新频率16.7ms

    window.addEventListener('resize', () => { //改变窗口大小时slider宽也要改变，重算宽度
      if(!this.slider || !this.slider.enabled) { //slider没有初始化时什么都不做
        return
      }
      this._setSliderWidth(true) //resize时不能再加宽度，不*2,也要给_setSliderWidth传一个标志位
      this.slider.refresh() //重新计算宽度后刷新
      // clearTimeout(this.resizeTimer)
      // this.resizeTimer = setTimeout(() => {
      //   if (this.slider.isInTransition) {
      //     this._onScrollEnd()
      //   } else {
      //     if (this.autoPlay) {
      //       this._play()
      //     }
      //   }
      //   this.refresh()
      // }, 60)
    })
  },
  activated() {
    this.slider.enable()
    // let pageIndex = this.slider.getCurrentPage().pageX
    // this.slider.goToPage(pageIndex, 0, 0)
    // this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated() {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  beforeDestroy() {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  methods: {
    refresh() {
      if (this.slider) {
        this._setSliderWidth(true)
        this.slider.refresh()
      }
    },
    _setSliderWidth(isResize) { // 设置isResize标志位
      this.children = this.$refs.sliderGroup.children //ref操作dom元素
      // console.log(this.children.length)

      let width = 0 //sliderGroup的宽度
      let sliderWidth = this.$refs.slider.clientWidth
      for(let i = 0; i < this.children.length; i++) { //计算sliderGroup的宽度，累加child宽度
        let child = this.children[i]
        addClass(child, 'slider-item') //给每个child添加类名slider-item
        
        child.style.width = sliderWidth + 'px' //每个child的宽度是父容器的宽度
        width += sliderWidth //sliderGroup的宽度是sliderWidth的累加
      }

      if(this.loop && !isResize) { //初始化BStroll时传入loop,为保证循环切换会克隆两个dom,所以是两倍的slider宽度；resize时不能再加宽度
        width += sliderWidth * 2
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },

    _initDots() {
      this.dots = new Array(this.children.length)
    },

    _initSlider() { // 初始化slider
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, //惯性
        snap: true,
        snapLoop: this.loop, //无缝循环轮播
        snapThreshold: 0.3, //滚动距离超过宽度/高度的 30% 时切换图片
        snapSpeed: 400 //切换动画时长 400ms
      })

      this.slider.on('scrollEnd', () => { //切换下一张时时间触发 展示元素为active元素
        let pageIndex = this.slider.getCurrentPage().pageX //getCurrentPage():snap为true时获取滚动的当前页，返回的对象结构为 {x, y, pageX, pageY}
        if(this.loop) {
          pageIndex = pageIndex - 1 //循环时默认第一个元素会添加一个拷贝
        }
        this.currentPageIndex = pageIndex

        if(this.autoPlay) { //第一张滑到第二张后就不继续了，要cleartimeout
          clearTimeout(this.timer)
          this._play()
        }
      })
    },

    _play() { //跳到下一张，需要修改currentPageIndex
      let pageIndex = this.currentPageIndex + 1
      if(this.loop) {
        pageIndex += 1
      }

      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  destroyed() { //有利于内存释放
    clearTimeout(this.timer)
  }

}
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/variable"

  .slider
    min-height 1px
    // height 150px
    // margin-bottom 14px
    .slider-group
      position relative
      overflow hidden
      white-space nowrap
      // height 150px
      .slider-item
        // width 100%
        // height 150px
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
        img
          display block
          width 100%
          vertical-align middle
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 4px
        width 8px
        height 8px
        border-radius 50%
        background $color-text-l
        &.active
          width 20px
          border-radius 5px
          background $color-text-ll
</style>
