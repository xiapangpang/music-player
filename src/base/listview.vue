<template>
  <!-- scroll已初始化，需传入data，data变化时能重新计算scroll,正确滚动 -->
  <scroll class="listview" :data="data" ref="listview" 
  :listen-scroll="listenScroll" @scroll="scroll"
  :probe-type="probeType">
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) in group.items" class="list-group-item" :key="index"
          @click="selectItem(item)">
          <!-- @click="selectItem(item) 配合路由跳转到歌手详情页面 -->
            <img v-lazy="item.avatar" class="avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" class="item" 
        :data-index="index"
        :class="{'current':currentIndex===index}">{{item}}</li>
        <!-- 当currentIndex等于index时增加一个current的class -->
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    shortcutList() { //获取右侧快速列表数组
      return this.data.map((group) => {
        return group.title.substring(0, 1)
      })
    },
    fixedTitle() {
      if(this.scrollY > 0) { //没有这个条件的话在顶部往下拉会发现有两个title“热门”，需要去掉多余的
        return '' //这样还不够，依然是两个，只是多余的这个是空的没有文字，需要在list-fixed属性上加上v-show="fixedTitle"
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  data() {
    return {
      scrollY: -1, //需要观测scrollY
      // 要得到currentindex，需要知道listheight和scrolly，对比可知落在哪个区间，长度为26-4+1=23，区间为【0，22】
      currentIndex: 0, //对应shortcutlist哪个应高亮，currentIndex是多少对应哪个高亮，0是第一个高亮
      diff: -1 //区间上限和scrolly的差值，差值小于title高度就往上顶
    }
  },
  created() {
    this.touch = {} //onShortcutTouchStart和onShortcutTouchMove需要共享这个数据，不能放在data和props里（这俩会被vue添加getter和setter，观测props和data和computed里值的变化继而监听，和dom的数据绑定作用，这个touch并不需要观测变化）
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3 //scroll组件里设置的1会截留，但需要实时派发scroll事件
  },
  methods: {
    onShortcutTouchStart(e) { //点击右侧字母title时左侧滚到相应字母开头的歌手
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0] //touches表示当前跟踪的触摸操作的touch对象的数组
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex //记录touchstart时锚点的索引,下面要用
      
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) { //按住鼠标拖动右侧字母列表左侧相应的滚动，需要监听touchmove事件
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 //在y轴上每个锚点的偏移，|0是向下取整
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta //得到move时的ahchorIndex,+前面是字符串，要转为数字
      // console.log(anchorIndex)
      
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y //实时获取bs滚动的y轴的距离
    },
    selectItem(item) { //listview只是基础组件，点击事件只负责派发，只告诉外部我被点击了且哪个元素被点击，不牵扯业务逻辑
      this.$emit('select', item)
    },
    _scrollTo(index) {
      // debugger
      // console.log(index)
      //不分情况讨论的话会发现点击入口列表的最上方和下方空白处index是null，且往下无限拉index会一直变大，往上无限拉会一直变小成为负值
      // this.scrollY = -this.listHeight[index] //下面的代码通过bs的ste滚动到相应位置，并没有派发scroll事件，监听不到scrolly的变化，需要手动设置scrolly,等于每个lh的上限位置
      // this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) //第二个参数时0，缓动函数动画时间为0，瞬间移动
      if(!index && index !== 0) { //return掉null的情况，index可以为0
        return
      }
      if(index < 0) {
        index = 0
      }else if(index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // this.scrollY = -this.listHeight[index] 
      this.scrollY = this.$refs.listview.scroll.y //下面的代码通过bs的ste滚动到相应位置，并没有派发scroll事件，监听不到scrolly的变化，需要手动设置scrolly,等于每个lh的上限位置
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) //第二个参数时0，缓动函数动画时间为0，瞬间移动；这儿的index已经被bs做滚动边界处理了，不用考虑<0和>length-2的情况
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      //需要知道listGroup每个元素的高度，得遍历listGroup
      let height = 0 //第一个的高度一定时0
      this.listHeight.push(height)
      for(let i = 0; i < list.length; i++) { 
        let item = list[i] //得到每个group元素
        height += item.clientHeight //height累加，得到第0-n个每个group对应的高度；item为dom，用原生的clientHeight属性
        this.listHeight.push(height)
      }
    },

    //配合scroll组件底部留空给mini播放器
    refresh() {
      this.$refs.listview.refresh()
    }
  },
  watch: {
    data() { //监测data变化，data变化时延时计算settimeout
      setTimeout(() => { //数据变化到dom变化有延时，通常在nexttick之后，考虑兼容性用settimeout
        this._calculateHeight() //计算每个group高度
      }, 20)
    },
    // scrollY(newY) { //通过bs可拿到scrolly，可watch其变化
    //   const listHeight = this.listHeight //会多次使用，先保留
    //   if(newY > 0) { //在顶部往下拉
    //     this.currentIndex = 0 //往下拉到最上面为0
    //     return
    //   }
    //   for(let i = 0; i < listHeight.length - 1; i++) {
    //     let height1 = listHeight[i] //下限
    //     let height2 = listHeight[i + 1] //上限
    //     // debugger
    //     //往上拉到最下面!height2，或往上滚动落在上限和下限中间currentIndex为i；拉到最上面currentIndex为0
    //     if(!height2 || (-newY > height1 && -newY < height2)) { //!height2:遍历到最后一个,-newy:往上滚动,y值为负值,-newy是正值
    //       // debugger
    //       this.currentIndex = i
    //       console.log(this.currentIndex)
    //       this.diff = height2 + newY //newY为负值，diff表示区间上限和newy的差值
    //       // console.log(this.diff)
    //       return //跳出，不需要再循环
    //     }
    //   }
    // },
    scrollY(newY) { //通过bs可拿到scrolly，可watch其变化
      const listHeight = this.listHeight //会多次使用，先保留

      // 当滚动到顶部，newY>0 往下拉
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      //listHeight数组长度为24，比group列表元素多一个，因为listHeight分了上限和下限，第一个列表元素的上限是第二个的下限，最后必然会多出一个，所以遍历到最后一个时减1，保证height2存在，if语句中-newY才能<height2
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i] //下限
        let height2 = listHeight[i + 1] //上限
        //往上滚动落在上限和下限中间currentIndex为i，>= height1是因为第0个元素要高亮
        if (-newY >= height1 && -newY < height2) { //-newy:往上滚动,y值为负值,-newy是正值
          this.currentIndex = i
          // console.log(this.currentIndex)
          this.diff = height2 + newY //newY为负值，diff表示区间上限和newy的差值
          return //跳出，不需要再循环
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2 //listHight元素比右侧元素多一个,currentIndex对应最后一个时减2
    },
    diff(newVal) {
      // debugger
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0 //差值小于titile时，newVal - TITLE_HEIGHT 为负值，往上顶
      if (this.fixedTop === fixedTop) { //不用修改fixedtop 不用操作dom
        return //性能优化 在diff实时变化过程中，会进行dom操作，减少操作dom频率
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)` //3d是为了加速
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/variable'

  .listview
    position relative
    width 100%
    height 100%
    background-color $color-background
    overflow hidden
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        background-color $color-highlight-background
        font-size $font-size-small
        color $color-text-l
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium
    .list-shortcut
      position absolute
      right 0
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-background-d
      font-family Helvetica
      z-index 30
      .item
        padding 3px
        line-height 1
        color $color-text-l
        font-size $font-size-small
        &.current
          color $color-theme
    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
