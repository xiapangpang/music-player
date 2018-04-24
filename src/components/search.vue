<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item, index) in hotKey" :key="index" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="deleteAllConfirm">
                <span class="icon-clear"></span>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <delete-all-confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空"
    @confirm="deleteAll"></delete-all-confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box'
import {getHotKey} from 'api/search'
import Suggest from 'components/suggest'
import {mapActions, mapGetters} from 'vuex'
import SearchList from 'base/search-list'
import DeleteAllConfirm from 'base/delete-all-confirm'
import Scroll from 'base/scroll'
import {playlistMixin} from 'common/js/mixin'

export default {
  data() {
    return {
      hotKey: [],
      query: '',
      refreshDelay: 120 //增删歌曲动画时间100ms
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    _getHotKey() {
      getHotKey().then((res) => {
        if(res.code === 0) {
          // console.log(res.data.hotkey)
          this.hotKey = res.data.hotkey.slice(0, 10) //取前十条热门搜索数据
        }
      })
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    //从搜索框里拿到query的变化值，然后把query通过props传递给suggest组件，会触发query的watch，调用this.search方法即api请求，拿到result，result一旦更新dom就会更新
    onQueryChange(query) {
      this.query = query
    },

    //移动端优化，滚动列表时input失去焦点
    blurInput() {
      this.$refs.searchBox.blur()
    },

    //保存搜索结果
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    //点击右侧的×，删除一条
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },
    //点击垃圾桶，全部清除
    //考虑用户体验，不能直接deleteAll，要先弹窗提醒
    // deleteAll() {
    //   this.clearSearchHistory()
    // },
    deleteAllConfirm() {
      this.$refs.confirm.show()
    },
    deleteAll() {
      this.clearSearchHistory()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
    
    //组件底部要设置bottom，留空给mini播放器高度
    handlePlaylist(playlist) { //覆盖掉mixin里的handlePlaylist
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh() //刷新scroll组件
      this.$refs.searchResult.style.bottom = bottom
      //search-result包裹的scroll组件在suggset上，想要调用scroll的refresh需通过suggest做一层代理；当suggest组件的refresh被调用后，实际上调用了suggest里scroll组件refresh方法，重新计算，search组件里可以拿到suggest的引用，然后调用this.$refs.suggest的refresh
      this.$refs.suggest.refresh()
    },
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  //从搜索结果列表suggest切到搜索主页，会发现不能滚动，需要watch的变化，手动刷新
  watch: {
    query(newQuery) {
      if(!newQuery) { //如果从搜索列表suggest切到主页，query是从有到无，要手动刷新shortcut组件
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    DeleteAllConfirm,
    Scroll
  },
  mixins: [playlistMixin]
}
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/variable"
  @import "../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin 20px
    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0
      width 100%
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin 0 20px 20px 20px
          .title
            margin-bottom 20px
            font-size $font-size-medium
            color $color-text-l
          .item
            display inline-block
            padding 5px 10px
            margin 0 20px 10px 0
            border-radius 6px
            background $color-highlight-background
            font-size $font-size-medium
            color $color-text-d
        .search-history
          position relative
          margin 0 20px
          .title
            display flex
            align-items center
            height 40px
            font-size $font-size-medium
            color $color-text-l
            .text
              flex 1
            .clear
              extend-click()
              .icon-clear
                font-size $font-size-medium
                color $color-text-d
    .search-result
      position fixed
      width 100%
      top 178px
      bottom 0
</style>
