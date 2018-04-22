import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() { //dom ready时
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() { //具体在组件里实现，一旦组件定义函数就会覆盖掉这里的函数，如果没有定义就会抛错
      throw new Error('component must implement handlePlaylist method')
    }
  }
}