var express = require('express')
var port = 8080

var app = express()

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})

// var express = require('express');
// var proxy = require('http-proxy-middleware');

// var app = express();
// app.use('/static', express.static('static'));
// app.use('/splcloud', proxy({
//   target: 'https://c.y.qq.com', 
//   changeOrigin: true, 
//   headers: {
//     referer: 'https://y.qq.com/',
//     host: 'c.y.qq.com'
//   }
// }
// ));

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html')
// })
// app.listen(3000)

// var express = require('express')
// var config = require('./config/index')
// var axios = require('axios')

// var app = express()

// var apiRoutes = express.Router()
// apiRoutes.get('/getList', function (req, res) {
//   var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

//   axios.get(url, {
//     headers: {
//       referer: 'https://c.y.qq.com/',
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then(function (response) {
//     res.json(response.data)
//   }).catch(function (error) {
//     console.log(error)
//   })
// })
// apiRoutes.get('/getLyric', function (req, res) {
//   var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

//   axios.get(url, {
//     headers: {
//       referer: 'https://c.y.qq.com/',
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then((response) => {
//     // jsonp 数据转为 json 数据
//     var result = response.data

//     if (typeof result === 'string') {
//       var reg = /^\w+\(({[^()]+})\)$/
//       var matches = result.match(reg)

//       if (matches) {
//         result = JSON.parse(matches[1])
//       }
//     }

//     res.json(result)
//     // res.json(response.data)
//   }).catch((error) => {
//     console.log(error)
//   })
// })

// apiRoutes.get('/getRecommend', function (req, res) {
//   var url = '/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

//   axios.get(url, {
//     headers: {
//       referer: 'https://c.y.qq.com/',
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then(function (response) {
//     res.json(response.data)
//   }).catch(function (error) {
//     console.log(error)
//   })
// })
// apiRoutes.get('/getDiscList', function (req, res) {
//   var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

//   axios.get(url, {
//     headers: {
//       referer: 'https://c.y.qq.com/',
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then(function (response) {
//     res.json(response.data)
//   }).catch(function (error) {
//     console.log(error)
//   })
// })

// // export function getTopList() { //排行榜是json请求
// //   // const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
// //   const url = '/v8/fcg-bin/fcg_myqq_toplist.fcg'

// //   const data = Object.assign({}, commonParams, {
// //     platform: 'h5',
// //     needNewCode: 1,
// //     format: 'json'
// //   })

// //   return axios.get(url, {
// //     params: data
// //   }).then((res) => {
// //     return Promise.resolve(res.data)
// //   })
// // }

// app.use('/api', apiRoutes)

// app.use(express.static('./dist'))

// var port = 8080
// module.exports = app.listen(port, function (err) {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log('Listening at http://localhost:' + port + '\n')
// })