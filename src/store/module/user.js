import {
  login,
  getUserInfo,
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

    // 获取用户相关信息
    getUserInfo({commit}) {
      return new Promise((resolve, reject) => {
          try {
            let userInfoApi = '/user/info'
            if (location.href.includes('ticket')) {
              const param = getParams(location.href);
              userInfoApi += '?ticket=' + param.ticket
            }
            getUserInfo(userInfoApi).then(res => {
              let data = res.data
              if (data.code === '200') {
                commit('setUserName', data.data.username)
                const menus = processMenus(data.data.menus)
                data.data.menus = menus
                commit('setMenus', menus)
                commit('setLogoutUrl', data.data.logoutUrl)
                localSave('username', data.data.username)
                localSave('logoutUrl', data.data.logoutUrl)
                const menu = getMenuByRouter(routers, menus)
                let page = '/'
                if (menu && menu.length > 0) {
                  page = menu[0].name
                  if (menu[0].children && menu[0].children.length > 0) {
                    page = menu[0].children[0].name
                  }
                }
                data.data.homePage = page
              }
              commit('setHasGetInfo', true)
              resolve(data.data)
            }).catch(err =>
              reject(err)
            )
          } catch (error) {
            reject(error)
          }
        }
      )
    }
  }
}
