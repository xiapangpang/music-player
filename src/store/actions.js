//异步操作，异步修改，对mutation所做的封装

import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
//第一个参数为可解构为commit方法和state属性的state对象,
//第二个参数为payload，当点击selectPla，告诉它这个列表是啥和索引是啥
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList) //提交playlist为randomlist
    index = findIndex(randomList, list[index]) //这首歌在randomlist里的索引
  } else {
    commit(types.SET_PLAYLIST, list) //顺序列表
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

//背景图上的随机播放全部
export const randomPlay = function({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

//歌曲的搜索结果列表的歌曲点击跳转，要提交多个mutations
//playlist
export const insertSong = function({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌，删掉此歌
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) { //如果当前插入的序号大于列表中的序号，插入的位置在其后
      playlist.splice(fpIndex, 1) //删除找到的索引
      currentIndex-- //删掉后，前面的数组长度要-1
    } else { //插入的位置在其前
      playlist.splice(fpIndex + 1, 1) //整体长度+1，删除的位置是下一位
    }
  }

  //sequenceList
  //计算sequenceList应该要插入的位置，定义临时变量currentSIndex
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  //之前的sequenceList是否包含我们要插入的song
  let fsIndex = findIndex(sequenceList, song) 
  //在currentSIndex插入song
  sequenceList.splice(currentSIndex, 0, song)
  //如果已经包含了这首歌
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) { //插入在后面，直接删掉之前的索引
      sequenceList.splice(fsIndex, 1)
    } else { //插入在前面，数组长度+1，之前的索引需要+1
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query)) //saveSearch在cache中实现，gn:把query插入到当前搜索历史列表中，然后保存，最后返回一个存储过query的新列表数组且保留到本地缓存
}
export const deleteSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query)) //deleteSearch在cache中实现，gn:从当前搜索历史列表中删除query，然后保存，最后返回一个删除过query的新列表数组，删除的动作要把结果保留到本地缓存
}
export const clearSearchHistory = function({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch()) //clearSearch在cache中实现，gn:点击垃圾桶时，清空所有缓存数据，返回空数组
}

//playlist的点击×，从当前列表中删掉歌曲。和上面的insertSong类似。
export const deleteSong = function({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex 
  let pIndex = findIndex(playlist, song) //找到这首歌在playlist中的索引，然后删除
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song) //找到这首歌在sequenceList中的索引，然后删除
  sequenceList.splice(sIndex, 1)

  //当前播放歌曲在删除索引之后，删掉歌曲后currentIndex减1 或 删除的是最后一首，currentIndex等于pIndex
  if(currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  // if(!playlist.length) { //整个列表删完了
  //   commit(types.SET_PLAYING_STATE, false)
  // }else { //删除后还有播放列表时要切换播放状态，删之前如果暂停状态删之后要播放状态
  //   commit(types.SET_PLAYING_STATE, true)
  // }
  //上面的代码可优化为：
  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}
//playlist的点击垃圾桶，清空播放列表，全都置为初始状态
export const deletSongList = function({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

//player每播放一首歌都要存在最近播放等列表里，同时还要记录到本地缓存，和上面的saveSearchHistory一样。去cache里存储一个播放历史。
export const savePlayHistory = function({commit}, song) { //song是当前歌曲
  commit(types.SET_PLAY_HISTORY, savePlay(song)) //savePlay在cache中实现，gn:把song插入到当前播放历史列表中，然后保存，最后返回一个存储过song的新列表数组且保留到本地缓存
}

//点击红心按钮，收藏。和上面的类似，都是vuex共享和保留在本地缓存中。
export const saveFavoriteList = function({commit}, song) { //操作单个song
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
export const deleteFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}