import axios from "axios";
import config from "@/config";
const baseUrl = config.baseUrl;

const instance= axios.create({baseURL:baseUrl});
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.token= token; //请求头加上token
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
export default instance;
