<template>
  <div class="singer" ref="singer">
      <list-view :data="singers" @select="selectSinger" ref="list"></list-view> 
      <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import ListView from 'base/listview'
import {mapMutations} from 'vuex' //mapMutations为vuex提供的语法糖，写数据用的
import {playlistMixin} from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer) //传入payload数据，实现对mutation的提交，实际上执行mutaitions.js里的函数，state.singer就有值了，相当于往state里写值
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if(res.code === 0) {
          // console.log(res.data.list)
          // this.singers = res.data.list
          // console.log(this._normalizeSingers(this.singers))
          this.singers = this._normalizeSingers(res.data.list)
        }
      })
    },
    _normalizeSingers(list) { //10条热门+按照字母顺序往下排的歌手
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // debugger
      list.forEach((item, index) => {
        if(index < HOT_SINGER_LEN) {
          map.hot.items.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
        const key = item.Findex
        if(!map[key]) {
          // debugger
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push({
          id: item.Fsinger_mid,
          name: item.Fsinger_name,
          avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=259200`
        })
      })
      // console.log(map)

      // 为了得到有序列表，我们需要处理 map
      let hot = []
      let rest = []
      for(let key in map) { //map对象转为有序数组，第一层title（热门和ABC...）,第二层items，里面有id等
        let val = map[key]
        if(val.title === HOT_NAME) {
          hot.push(val)
        }else if(val.title.match(/[a-zA-Z]/)) {
          rest.push(val)
        }
      }
      rest.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0) //字母排序 -1 a在前 升序
      })
      return hot.concat(rest)
    },

    ...mapMutations({ //通过扩展运算符调mapMutations，把mutaion的修改映射成方法名setSinger
      setSinger: 'SET_SINGER'
    }),

    //组件底部要设置bottom，留空给mini播放器高度
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  components: {
    ListView
  },
  mixins: [playlistMixin]
}
</script>

<style lang="stylus" scoped>
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
