<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {createSong} from 'common/js/song'

export default {
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      // return this.topList.picUrl //图片太丑换成第一首歌的图片
      if(this.songs.length) {
        return this.songs[0].image
      }
      return ''
    }
  },
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if(!this.topList.id) { //在本页面刷新时会回退到上级页面
        this.$router.push('/rank')
        return 
      }
      getMusicList(this.topList.id).then((res) => {
        if(res.code === 0) {
          // console.log(res.songlist)
          this.songs = this._normalizeSongs(res.songlist) //然后将songs传入music-list标签
        }
      })
    },
    _normalizeSongs(list) {
      let res = []
      list.forEach(item => {
        const musicData = item.data
        if(musicData.songid && musicData.albumid) {
          res.push(createSong(musicData)) //调用createSong，返回song的实例
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
    transition all .3s ease 
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
