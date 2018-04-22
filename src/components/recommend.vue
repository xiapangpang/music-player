<template>
  <div class="recommend" ref="recommend">
    <!-- <div class="recommend-content"> 引入scroll后将div改为scroll-->
    <!-- 要传一个data，数据拿到后把dom撑开，重新计算scroll调用refresh才能让scroll正确滚动，否则在mounted时计算，组件高度没有，就滚动不了。后来有数据时scroll就发生不了任何变化 -->
    <scroll ref="scroll" class="recommend-content" :data="discList"> 
      <!-- 加一个div，bscroll是父子级，子级只有第一个元素才会滚动，需要在外面创建一个元素，使之成为recommend-content第一个元素，才能使slider和榜单一起滚动，在recommend-content上做引用并初始化bscroll -->
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <!-- 解决fc和bs的click冲突：fastclic会阻止默认的click，加上needsclick就不会手动拦截click，不会阻止链接的点击-->
                <img class="needsclick" @load="loadImage" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <!-- 要有data和scroll里的watch,这里的discList渲染后scroll会监听到变化,然后调用refresh -->
            <li v-for="(item, index) in discList" class="item" :key="index" @click="selectItem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div> 
            </li>
          </ul>
        </div>
      </div>
      <!-- 歌单列表渲染之前展示一个正在加载的loading -->
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getRecommend, getDiscList} from 'api/recommend'
import Slider from 'base/slider'
import Scroll from 'base/scroll'
import Loading from 'base/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  // 获取数据调用create函数
  created() {
    this._getRecommend()
    this._getDiscList()
    // setTimeout(() => { //慢网速下看loading效果
    //   this._getDiscList()
    // }, 100000)
  },
  methods: {
    _getRecommend() {
      // getRecommend是promise .then获取返回值
      getRecommend().then((res) => {
        // 请求成功
        // debugger
        if(res.code === 0) {
          // console.log(res.data.slider)
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if(res.code === 0) {
          // console.log(res.data.list) //不加header的话报错，因为请求头里有referer和host限制
          this.discList = res.data.list
        }
      })
    },
    loadImage() { //一旦有图片触发onload事件，就调用loadImage方法
      if(!this.checkLoaded) { //设置一个标志位checkLoaded，确保只执行一次，因为只需要一张图片下载好就能撑开；挂在this上的，不然未定义报错
        this.$refs.scroll.refresh() //imageonload出来,bs调用refresh时已有slider高度，滚动高度就从slider区开始一直滚动到底部，如果还没渲染就调用refresh，高度会缺少一块导致滚不到底部
        this.checkLoaded = true
      }
    },
    
    //组件底部要设置bottom，留空给mini播放器高度
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },

    //点击跳转歌单二级页面
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    //
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  mixins: [playlistMixin]
}
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/variable"

  .recommend
    position fixed
    width 100%
    top 88px
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          color $color-theme
          font-size $font-size-medium
        .item
          display flex
          padding 0 20px 20px 20px
          align-items center
          box-sizing border-box
          .icon
            flex 0 0 60px
            padding-right 20px
            width 60px
          .text
            flex 1
            display flex
            flex-direction column
            justify-content center
            line-height 20px
            overflow hidden
            font-size $font-size-medium
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
