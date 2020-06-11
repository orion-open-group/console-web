import {
  login,
} from '@/api/user'
import {setToken, getToken, localSave, processMenus, getMenuByRouter} from '@/libs/util'
import routers from '@/router/routers'
import {getParams} from "../../libs/util";

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    menuAuthor: [],
    logoutUrl: ''
  },
  mutations: {
    setUserName(state, name) {
      state.userName = name
    },
    setMenus(state, menus) {
      state.menuAuthor = menus
    },
    setLogoutUrl(state, url) {
      state.logoutUrl = url
    },
    setHasGetInfo(state, hasGetInfo) {
      state.hasGetInfo = hasGetInfo
    }
  },
  actions: {
    // 登录
    handleLogin({commit}, {userName, password}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },

  }
}
