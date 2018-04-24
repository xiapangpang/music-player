<template>
  <!-- 为了能实时刷新，需要把data传入scroll;pullup传入，上拉刷新 -->
  <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" ref="suggest"
  :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <span :class="getIconCls(item)"></span>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {search} from 'api/search'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll'
import Loading from 'base/loading'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20 //如果要改变每页数量，只需改这里

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1, //配合search方法，需要维护page变量
      result: [],
      pullup: true,
      hasMore: true, //searchMore里的标志位
      beforeScroll: true
    }
  },
  methods: {
    search() { //请求服务端抓取检索数据，然后渲染到列表里
      // debugger
      this.page = 1 //第一次search时需要设置page，query改变时page要从1开始，以及把scroll组件重置到顶部
      this.$refs.suggest.scrollTo(0, 0) //同上
      this.hasMore = true
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if(res.code === 0) {
          // console.log(res.data)
          this.result = this._genResult(res.data)
          this._checkMore(res.data) //每次拿到结果时都check下有没有多余的
        }
      })
    },
    _genResult(data) { //data里我们需要的是两个字段，song和zhida
      let ret = []
      if(data.zhida && data.zhida.singerid) { //不仅有zhida字段还要有singerid才能保证结果是歌手
        ret.push({...data.zhida, ...{type: TYPE_SINGER}}) //扩展运算符，到一个对象上;添加一个type是为了getIconCls区分class样式
      }
      if(data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    getIconCls(item) {
      if(item.type === TYPE_SINGER) {
        return 'icon-mine'
      }else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if(item.type === TYPE_SINGER) {
        return item.singername
      }else {
        return `${item.name} - ${item.singer}`
      }
    },

    //上拉刷新监听scrollToEnd事件，调用searchMore方法
    searchMore() {
      if(!this.hasMore) {
        return 
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if(res.code === 0) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data) //每次拿到结果时都check下有没有多余的
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if(!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) { //当前页的数量 + 当前页*每页固定数量20 > 总数量
        this.hasMore = false
      }
    },

    //点击搜索结果列表的某项，跳转到二级路由
    selectItem(item) {
      if(item.type === TYPE_SINGER) {
        const singer = {
          id: item.singermid,
          name: item.singername,
          avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`
        }
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      }else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ]),
 
    //移动端优化，滚动列表时收起键盘，这里只写基本事件，逻辑在外层组件suggest标签上写
    listScroll() {
      this.$emit('listScroll')
    },

    //想刷新search组件里search-result的scroll组件，但search-result包裹的scroll组件在suggset上，要调用scroll的refresh需通过suggest做一层代理
    refresh() {
      this.$refs.suggest.refresh() //当suggest组件的refresh被调用后，实际上调用了suggrst里用到的scroll组件refresh方法，重新计算
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        return
      }
      this.search(newQuery) //请求服务端
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/variable"
  @import "../common/stylus/mixin"

  .suggest
    height 100%
    overflow hidden
    .suggest-list
      padding 0 30px
      .suggest-item
        display flex
        align-items center
        padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        [class^="icon-"]
          font-size 14px
          color $color-text-d
      .name
        flex 1
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
          no-wrap()
    .no-result-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>