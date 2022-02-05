import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showNavi: true,
    showCtrlBox: false,
    windowSize: 1, // 0: minimize 1: restore 2: maximize
  },
  getters: {
    getShowNavi: (state) => {
      return state.showNavi
    },
    getShowCtrlBox: (state) => {
      return state.showCtrlBox
    },
    windowSize: state => state.windowSize
  },
  mutations: {
    maximize(state) {
      state.windowSize = 2
    },
    restore(state) {
      state.windowSize = 1
    }
    // toggleNavi (state, payload) {
    //   state.showNavi = payload
    // },
  },
  actions: {
    maximize(context) {
      context.commit('maximize')
    },
    restore(context) {
      context.commit('restore')
    }
    // toggleNavi (context, payload) {
    //   context.commit('toggleNavi', payload)
    // }
  },
  modules: {
  },
})