import axios from '@/libs/api.request'


export const getAppInfo = (param) => {
  return axios.request({
    url: '/gateway/app/query',
    params: param,
    method: 'get'
  })
}

export const addAppInfo = (param) => {
  return axios.request({
    url: '/gateway/app/add',
    data: param,
    method: 'post'
  })
}

export const modifyApp = (param) => {
  return axios.request({
    url: '/gateway/app/modify',
    data: param,
    method: 'post'
  })
}

export const deleteApp = (param) => {
  return axios.request({
    url: '/gateway/app/delete',
    data: param,
    method: 'post'
  })
}


export const getServiceInfo = (param) => {
  return axios.request({
    url: '/gateway/service/query',
    params: param,
    method: 'get'
  })
}

export const addServiceInfo = (param) => {
  return axios.request({
    url: '/gateway/service/add',
    data: param,
    method: 'post'
  })
}


export const modifyServiceInfo = (param) => {
  return axios.request({
    url: '/gateway/service/modify',
    data: param,
    method: 'post'
  })
}


export const deleteServiceInfo = (param) => {
  return axios.request({
    url: '/gateway/service/delete',
    data: param,
    method: 'post'
  })
}


export const enableService = (param) => {
  return axios.request({
    url: '/gateway/service/enable',
    data: param,
    method: 'post'
  })
}


export const disableService = (param) => {
  return axios.request({
    url: '/gateway/service/disable',
    data: param,
    method: 'post'
  })
}

export const queryMethod = (param) => {
  return axios.request({
    url: '/gateway/method/query',
    params: param,
    method: 'get'
  })
}

export const addMethod = (param) => {
  return axios.request({
    url: '/gateway//method/add',
    data: param,
    method: 'post'
  })
}

export const modifyMethod = (param) => {
  return axios.request({
    url: '/gateway/method/modify',
    data: param,
    method: 'post'
  })
}

export const deleteMethod = (param) => {
  return axios.request({
    url: '/gateway/method/delete',
    data: param,
    method: 'post'
  })
}

export const disableMethod = (param) => {
  return axios.request({
    url: '/gateway/method/disable',
    data: param,
    method: 'post'
  })
}


export const enableMethod = (param) => {
  return axios.request({
    url: '/gateway/method/enable',
    data: param,
    method: 'post'
  })
}




