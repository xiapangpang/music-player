// import jsonp from 'common/js/jsonp'
import axios from 'axios'

const commonParams = {
  g_tk: 916037377,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}

// const debug = process.env.NODE_ENV !== 'production'

// const options = {
//   param: 'jsonCallback'
// }

// export function getRecommend() {
//   const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

//   const data = Object.assign({}, commonParams, {
//     platform: 'h5',
//     uin: 0,
//     needNewCode: 1
//   })

//   return jsonp(url, data, options)
// }
//发现是json请求 用不上jsonp
export function getRecommend() {
  const url = '/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

//jsonp请求报错，有referer和host限制，还是要用反向代理
// const options = {
//   param: 'jsonCallback'
// }

// export function getDiscList() {
//   const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

//   const data = Object.assign({}, commonParams, {
//     platform: 'yqq',
//     needNewCode: 0,
//     hostUin: 0,
//     format: 'jsonp',
//     sortId: 5,
//     sin: 0,
//     ein: 29,
//     categoryId: 10000000,
//     rnd: Math.random()
//   })

//   return jsonp(url, data, options)
// }
export function getDiscList() {
  const url = '/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    needNewCode: 0,
    hostUin: 0,
    format: 'json', //axios,ajax请求变成json
    sortId: 5,
    sin: 0,
    ein: 29,
    categoryId: 10000000,
    rnd: Math.random()
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

//首页二级歌单列表
export function getSongList(disstid) {
  //https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg
  const url = '/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    needNewCode: 0,
    hostUin: 0,
    format: 'json',
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}