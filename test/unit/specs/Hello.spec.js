import Vue from 'vue'
import Hello from '@/components/Hello'
import 'babel-polyfill'
import router from '@/router'
import store from '@/store'

Hello.store = store
Hello.router = router

describe('Hello.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Hello)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('111')
  })
})
