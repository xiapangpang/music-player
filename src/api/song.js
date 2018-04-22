import axios from 'axios'

const commonParams = {
  g_tk: 916037377,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}

// const debug = process.env.NODE_ENV !== 'production'

export function getLyric(mid) {
  // https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg
  const url = '/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    pcachetime: +new Date(), //1523031754494 是个时间戳 动态参数
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}