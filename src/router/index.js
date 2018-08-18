import Vue from 'vue'
import Router from 'vue-router'
import recommend from '../components/recommend.vue'
import rank from '../components/rank.vue'
import search from '../components/search.vue'
import singer from '../components/singer.vue'
import singerDetail from '../components/singer-detail.vue'
import rankDetail from '../components/rankDetail.vue'
import discDetail from '../components/discDetail.vue'
import personCenter from '../components/personCenter.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: discDetail
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: rank,
      children: [
        {
          path: ':id',
          component: rankDetail
        }
      ]
    },
    {
      path: '/search',
      component: search,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/personCenter',
      component: personCenter
    }
  ]
})
router.push('/recommend')
export default router
