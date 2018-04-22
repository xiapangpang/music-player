import axios from 'axios'

const commonParams = {
  g_tk: 916037377,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}

export function getHotKey() { //热门搜索是json请求
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const url = '/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

//搜索框内搜索关键词，抓取显示的结果列表
export function search(query, page, zhida, perpage) { //query表示检索词，page表示第几页，zhida表示是否需要歌手数据，perpage表示每页数量
  // const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const url = '/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    perpage,
    n: perpage,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    platform: 'h5',
    needNewCode: 1,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}