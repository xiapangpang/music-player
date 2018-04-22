//操作localstorage缓存存取相关逻辑，搜索列表、播放列表、收藏喜欢等要用到，保存结果到本地
import storage from 'good-storage'

//存储搜索历史和播放历史和收藏历史 

//存储搜索历史相关：
//搜索列表最大只能缓存15条数据，超过的就把最老的数据给踢掉，每次插入的数据在数组第一个
const SEARCH_KEY = '__search__' //每种存储都定义一个key
const SEARCH_MAX_LENGTH = 15 //最大存储空间

//写入缓存：把query插入到当前搜索历史列表中，然后保存，最后返回一个存储过query的新列表数组且保留到本地缓存
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) //当前存储空间，默认值为空数组，没有存储过时数组为空
  //searches已经被query插入
  insertArray(searches, query, (item) => { //query插入到searches里
    return item === query //等于时说明query在searches数组中
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches) //把searches存进去
  return searches
}

//如果有重复数据，需要删掉重复的插入新的在最前，插入数组需要封装
function insertArray(arr, val, compare, maxLen) { //val是要存的值，compare定义比较函数，比较怎么查找到当前数组存在val，为true时插入，maxLen定义一个最大值
  const index = arr.findIndex(compare) //findIndex：查找当前数组中是否有某个元素，可以传入函数
  if(index === 0) { //说明是第一个数据 什么都不用做
    return
  }
  if(index > 0) { //说明数组中已存在这个数据且位置还不是第一个，前面还有数据，要把之前的数据删掉然后把它插进来到第一个位置
    arr.splice(index, 1)
  }
  arr.unshift(val) //把新值插入到数组第一个位置
  //插完后判断数组长度
  if(maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

//读取缓存：state里的searchHistory初始值始终是空数组，应该每次从本地缓存去读取
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])//从本地去读取历史列表，默认值为空数组，一次也没有存储过
}

//从当前搜索历史列表中删除query，然后保存，最后返回一个删除过query的新列表数组，删除的动作要把结果保留到本地缓存
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) //当前存储空间，默认值为空数组，没有存储过时数组为空
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches) //保存删除过query的数组到本地缓存
  return searches
}

function deleteFromArray(arr, compare) { //compare定义比较函数，为true时删掉
  const index = arr.findIndex(compare)
  if(index > -1) {
    arr.splice(index, 1)
  }
}

//点击垃圾桶时，清空所有缓存数据，返回空数组
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

//存储播放历史相关：
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

//写入缓存：把song插入到当前播放历史列表中，然后保存，最后返回一个存储过song的新列表数组且保留到本地缓存
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, []) //拿到当前播放列表
  insertArray(songs, song, (item) => { //song插入到songs里，同时传入比较函数判断song是否在里面，如果song在里面就把song放在第一位
    return song.id === item.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs) //得到的新数组songs缓存到本地
  return songs
}

//读取缓存：state里的playHistory初始值始终是空数组，应该每次从本地缓存去读取
export function loadPlay() {
  return storage.get(PLAY_KEY, [])//从本地去读取历史列表，默认值为空数组，一次也没有存储过
}

//存储收藏历史相关：
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}