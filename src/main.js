// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueBus from 'vue-bus'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import './assets/theme.scss'
import './assets/common.scss'
Vue.config.productionTip = false

Vue.use(VueBus)
Vue.use(MuseUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
