// 入口文件 我们组装模块并导出 store 的地方

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import creatLogger from 'vuex/dist/logger' //每次通过mutation修改state时会再控制台打logger，显示前后的state

Vue.use(Vuex) //注册插件

//npm run dev的NODE_ENV是dev环境，如果是npm run build时是production环境，故线下调试的话debugger设为true
const debug = process.env.NODE_ENV !== 'production' 

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  //线下调试时要开启严格模式，会检测state的修改是否来源于commit mutation，开启会有点性能损耗，不建议在线上使用，要在开发环境下使用
  //即debug为true时开启严格模式，上线时模式关闭
  strict: debug,
  plugins: debug ? [creatLogger()] : [] //支持数组，默认creatLogger
})
