import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
  },
  actions: {
    // 登录时存储用户信息
    login({ state }, user) {
      state.user = user;
      window.localStorage.setItem('user', JSON.stringify(user))
      window.localStorage.setItem('token', user.token)
    },
    // 初始化用户信息
    initUser({ state }) {
      let user = window.localStorage.getItem('user')
      state.user = user ? JSON.parse(user) : null
    },
    // 清除登录状态和本地存储
    logout({ state }) {
      state.user = null
      window.localStorage.removeItem('user')
      window.localStorage.removeItem('token')
    },
  },
  modules: {
  }
})
