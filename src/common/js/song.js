import {Base64} from 'js-base64'
import {getLyric} from 'api/song'

export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album, //专辑
    duration, //做播放器时用的 播放时间
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  //api里获取到的歌词在这里调用，
  //因为歌词就是song的属性，直接拿不到的歌词需要调用这个接口，给Song类扩展方法//因为歌词就是song的属性，直接拿不到的歌词需要调用这个接口，给Song类扩展方法getLyric
  getLyric() { //player组件调用
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if(typeof res === 'string') { //res带有callback函数名，需要去掉取到里面的
          var reg = /^\w+\(({[^()]+})\)$/
          if(res.match(reg)) {
            res = JSON.parse(res.match(reg)[1]) //数组，第一个是整个字符，第二个是第一个括号捕获
          }
        } 

        if (res.code === 0) { //res已经去掉函数名，解析里面的base64格式的歌词
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

//因为后面排行榜等也会用到，为避免使用大量重复的new函数，不直接实例化，扩展为工厂函数
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
    url: `http://dl.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
  })
}

//musicData里的singer是个数组，但需要的是字符串，抽象成函数
function filterSinger(singer) {
  let res = []
  if(!singer) {
    return ''
  }
  singer.forEach(s => {
    res.push(s.name) //歌手名
  })
  return res.join('/') //有多个时歌手名之间用“/”分开
}