<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition> 
</template>

<script>
import {mapGetters} from 'vuex' //为取数据提供语法糖 通过mapGetters扩展到computed计算属性里
import {getSingerDetail} from 'api/singer'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([ //mapGetters里是数组，可map多个getters
      'singer' //对应到getters.js里的singer，映射后可以在vue实例中挂载一个singer属性，可以拿到singer，在created函数里可以看到数据传递
    ]),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created() {
    // console.log(this.singer) //在created函数中可以看到路由之间跳转的数据传递
    // debugger
    this._getDetail()
  },
  methods: {
    _getDetail() {
      if(!this.singer.id) { //处理边界情况：如果用户在此详情页面中刷新，回跳到singer路由，因为刷新后singer是空对象，获取不到详情数据
        this.$router.push('/singer') //会向history栈添加一个新的记录，当用户点击浏览器后退按钮时，则回到之前的 URL
        return
      }
      getSingerDetail(this.singer.id).then(res => { //上面通过vuex已获取到singer，可以拿到id
        if(res.code === 0) {
          // console.log(res.data.list)
          this.songs = this._normalizeSongs(res.data.list)
          // console.log(this.songs)
        }
      })
    },
    _normalizeSongs(list) {
      let res = []
      list.forEach(item => {
        let {musicData} = item //拿到musicData
        if(musicData.albummid && musicData.songid) {
          res.push(createSong(musicData)) //调用createSong且创建Song的实例
        }
      })
      return res
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
