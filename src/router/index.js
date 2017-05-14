import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/views/index'
import ChartPage from '@/views/chart'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'detail',
    component: IndexPage
  }, {
    path: '/chart',
    name: 'chart',
    component: ChartPage
  }]
})
