import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = { //只保留基础数据，其他可以计算得到，然后放在getters里
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence, //语义化的方式，如果直接写012会语义不详，在config配置
  currentIndex: -1, //当前播放哪首歌，前进后退播放要修改此值；不需要currentSong是因为playlist的currentIndex就是
  disc: {},
  topList: {},
  // searchHistory: []
  searchHistory: loadSearch(),
  // playHistory: []
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state