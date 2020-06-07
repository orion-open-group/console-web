import axios from 'axios'
import store from '@/store'
import config from '@/config'
import {getParams} from './util'


// import { Spin } from 'iview'

const casLoginUrl= config.casLogin

class HttpRequest {
  constructor(__baseUrl) {
    this.baseUrl =__baseUrl
    console.log(__baseUrl);
    this.queue = {}
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }

    return config
  }

  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      //解决sso对于非ajax 的重定向
      config.headers['X-Requested-With'] = 'XMLHttpRequest'
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }

      // config.withCredentials = true
      this.queue[url] = true
      return config
    }, error => {
      console.log(error)
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const {data, status} = res
      //判断是否
      if (data.status_code && data.status_code === '302') {
        console.log("status_code 302");
        const redirectUrl = casLoginUrl + location.href
        window.location.href = redirectUrl
        return Promise.reject(res)
      }
      return {data, status}
    }, error => {
      if (error.response.status === 403) {
        window.location.href = "index.html"
      }
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const {request: {statusText, status}, config} = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: {responseURL: config.url}
        }
      }
      return Promise.reject(error)
    })
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
