import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'iview'
import {canTurnTo, setTitle} from '@/libs/util'
import store from '@/store'
import config from '@/config'


/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}


Vue.use(Router)
const router = new Router({
  routes,
  mode: 'hash' // history 不要采用history,如果采用history需支持服务端渲染
})


const turnTo = (to, access, next, homepage = '/') => {
  if (to.name === '_home') {
    next({replace: true, name: homepage})
  } else if (to.name === 'error_401' || to.name === 'error_500') {
    next()
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  console.log(to.name);
  if(to.name == "login") {
    next();
  }else if (localStorage.getItem("token")) {
    turnTo(to, store.state.user.menuAuthor, next)
  } else { 
    next({name:"login"});
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
