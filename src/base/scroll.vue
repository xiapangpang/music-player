<template>
  <div ref="wrapper">
    <!-- scroll组件内层套上任何一个dom -->
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

// const DIRECTION_H = 'horizontal'
// const DIRECTION_V = 'vertical'

export default {
  props: { //控制一些props
    probeType: { //为1时，会非实时（屏幕滑动超过一定时间后）派发scroll事件,会截流
      type: Number,
      default: 1
    },
    click: { //点击列表是否派发click事件
      type: Boolean,
      default: true
    },
    listenScroll: { //是否让scroll监听滚动事件，用于歌手列表左右联动
      type: Boolean,
      default: false //最开始的推荐列表不关心滚动位置，没有监听滚动事件，就都默认为false
    },
    data: { //列表数据
      type: Array,
      default: function() {
        return []
      }
    },
    pullup: { //是否派发滚动到底部的事件，用于上拉加载
      type: Boolean,
      default: false
    },
    beforeScroll: { //是否派发列表滚动开始的事件，因为bs会在滚动一开始派发beforescrollstart事件
      type: Boolean,
      default: false
    },
    refreshDelay: { //当数据更新后，延时刷新scroll。要定义成props让外部来控制这个时间，因为每个外部组件因为动画等刷新时间不同。
      type: Number,
      default: 20
    },
    // direction: {
    //   type: String,
    //   default: DIRECTION_V
    // }
  },
  mounted() { //ready时调用_initScroll()
    setTimeout(() => { //确保dom已渲染完才初始化bs
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) { //wrapper没有值时return掉，因为bs初始化时第一个参数不能传入undefined
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, { //bs初始化
        probeType: this.probeType, //外部控制scroll的probeType是啥，就初始化成啥样
        click: this.click, //同上
        // eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
      })

      if (this.listenScroll) {
        let me = this //外层保留vue实例的this
        this.scroll.on('scroll', (pos) => { //这里的this是指向scroll的
          me.$emit('scroll', pos) //调用的是vue实例的emit方法
        })
        // this.scroll.on('scroll', (pos) => {
        //   this.$emit('scroll', pos)
        // })
      }

      if (this.pullup) { // 是否派发滚动到底部事件，用于上拉加载
        this.scroll.on('scrollEnd', () => { //滚动结束 后 派发scrollEnd事件，派发一次
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) { //滚动到底部
            this.$emit('scrollToEnd') //滚动到底部 事件
          }
        })
      }

      if (this.beforeScroll) { // 是否派发列表滚动开始的事件
        this.scroll.on('beforeScrollStart', () => { //事件回调里对外派发beforeScroll事件
          this.$emit('beforeScroll')
        })
      }
    },
    //bs方法的代理，在我们的组件上代理会用到的这些方法
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    refresh() { //刷新scroll，重新计算高度
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments) //调用apply是因为scrollto会接收一些参数，要把参数传入bs的scrollto里
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: { //是个对象，如果data有变化刷新scroll
    data() {
      // setTimeout(() => {
      //   this.refresh()
      // }, 20)
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay) //刷新时间定义成props让外部组件控制
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
