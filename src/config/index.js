import { Breadcrumb } from "iview";

let _baseUrl = process.env.VUE_APP_BASE_URL
let _casLogin = process.env.VUE_APP_CAS_LOGIN
let _casLogout = process.env.VUE_APP_CAS_LOGOUT
export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '分布式任务调度控制台',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: _baseUrl,
  
  /**
   * 认证中心地址 ，需拼接登录成功后重定向回来的地址
   */
  casLogin:  _casLogin,
  casLogout: _casLogout,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'task-list',
}
