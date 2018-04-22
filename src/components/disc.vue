<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {createSong} from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    }
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if(!this.disc.dissid) { //处理边界情况：如果用户在此详情页面中刷新，回跳到recommend路由，因为刷新后recommend是空对象，获取不到详情数据
        this.$router.push('/recommend') //会向history栈添加一个新的记录，当用户点击浏览器后退按钮时，则回到之前的URL
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        if(res.code === 0) {
          // console.log(res.cdlist[0].songlist)
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let res = []
      list.forEach((musicData) => {
        if(musicData.songid && musicData.albumid) {
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