import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    //当前是前进还是后退
    direction: 'forward',
  },
  getters: {
  },
  mutations: {
    UPDATE_DIRECTION(state, payLoad) {
      state.direction = payLoad.direction
    },
  }
})
