'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/api': {
      //   target: 'http://localhost:9000/foo/bar',
      //   xtarget: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg', // 设置你调用的接口域名和端口号 别忘了加http
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': '/'// 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
      //   }
      // }
      '/musichall': {
        target: 'https://c.y.qq.com', // 设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          '^/musichall': '/musichall'
        }
      },
      '/splcloud': {
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        pathRewrite: {
          '^/splcloud': '/splcloud'
        },
        headers: { //200但是failed，qq后端有验证，需带上referer和host,如果要进一步防范就是参数验签，验证参数
          referer: 'https://y.qq.com/',
          // referer: 'https://y.qq.com/portal/disclist.html',
          host: 'c.y.qq.com'
        }
      },
      '/lyric': {
        //https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        pathRewrite: {
          '^/lyric': '/lyric'
        },
        headers: {
          referer: 'https://y.qq.com/portal/player.html',
          // referer: 'https://y.qq.com/',
          host: 'c.y.qq.com'
        }
      },
      '/qzone': {
        //https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        pathRewrite: {
          '^/qzone': '/qzone'
        },
        headers: {
          referer: 'https://y.qq.com/n/yqq/playsquare/3826046389.html',
          // referer: 'https://y.qq.com/',
          host: 'c.y.qq.com'
        }
      },
      '/v8': {
        //https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg
        //https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        pathRewrite: {
          '^/v8': '/v8'
        },
        headers: {
          referer: 'https://m.y.qq.com/',
          // referer: 'https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id=4&type=top'
          host: 'c.y.qq.com' //注意不是m.y.qq.com
        }
      },
      '/soso': {
        //https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp
        target: 'https://c.y.qq.com',
        changeOrigin: true,
        pathRewrite: {
          '^/soso': '/soso'
        },
        headers: {
          referer: 'https://m.y.qq.com/',
          host: 'c.y.qq.com'
        }
      },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
