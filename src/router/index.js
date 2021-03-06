// import Vue from 'vue'
// import Router from 'vue-router'
// import Rank from 'components/rank'
// import Recommend from 'components/recommend'
// import Search from 'components/search'
// import Singer from 'components/singer'
// import SingerDetail from 'components/singer-detail'
// import Disc from 'components/disc'
// import TopList from 'components/top-list'
// import UserCenter from 'components/user-center'

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = () => import('components/recommend')
const Singer = () => import('components/singer')
const Rank = () => import('components/rank')
const Search = () => import('components/search')
const SingerDetail = () => import('components/singer-detail')
const Disc = () => import('components/disc')
const TopList = () => import('components/top-list')
const UserCenter = () => import('components/user-center')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
