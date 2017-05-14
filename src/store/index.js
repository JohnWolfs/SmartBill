import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    datePicker: null
  },
  getters: {
  },
  mutations: {
    setDatePicker(state, date) {
      state.datePicker = date
    }
  },
  // 异步的数据操作
  actions: {

  }
})
export default store
