import axios from '@/libs/api.request'

export const scheduleTypeDecode = (code) => {
  switch(code)
  {
    case "SCHEDULE":
      return "调度";
    case "SCHEDULE_STOP":
      return "终止";
  }
  return code;
}
export const scheduleStateDecode = (code) =>{
  switch(code)
  {
    case "INIT":
      return "待下发";
    case "PUBLISHING":
      return "下发中";
    case "PUBLISH_FAIL":
      return "下发失败";
    case "RUN":
      return "执行中";
    case "PAUSE":
      return "暂停";
    case "STOPING":
      return "终止中";
    case "ABORT":
      return "终止";
    case "FINISH":
      return "完成";
    case "DELETED":
      return "已取消";
  }
  return code;
}

export const login = (param) => {
  return axios.request({
    url: '/user/login',
    params: param,
    method: 'post'
  })
}

export const scheduleImmediate= (param) => {
  return axios.request({
    url: '/schedule/immediate',
    data: param,
    method: 'post'
  })
}

export const cleanRunningLock = (param) => {
  return axios.request({
    url: '/schedule/cleanRunningLock',
    params: param,
    method: 'post'
  })
}

export const getTaskConfigList = (param) => {
  return axios.request({
    url: '/task/list',
    params: param,
    method: 'get'
  })
}

export const addTaskConfig = (param) => {
  return axios.request({
    url: '/task/add',
    data: param,
    method: 'post'
  })
}

export const getTaskGroupList = (param) => {
  return axios.request({
    url: '/group/list',
    params: param,
    method: 'get'
  })
}

export const getTaskLogList = (param) => {
  return axios.request({
    url: '/command/list',
    params: param,
    method: 'get'
  })
}

export const deleteTask = (param) => {
  return axios.request({
    url: '/task/delete',
    data: param,
    method: 'post'
  })
}

export const modifyTask = (param) => {
  return axios.request({
    url: '/task/modify',
    data: param,
    method: 'post'
  })
}

export const resumeSchedule = (param) => {
  return axios.request({
    url: '/schedule/resume',
    data: param,
    method: 'post'
  })
}

export const pauseSchedule = (param) => {
  return axios.request({
    url: '/schedule/pause',
    data: param,
    method: 'post'
  })
}

export const deleteGroup = (param) => {
  return axios.request({
    url: '/group/delete',
    data: param,
    method: 'post'
  })
}

export const modifyGroup = (param) => {
  return axios.request({
    url: '/group/modify',
    data: param,
    method: 'post'
  })
}

export const addGroup = (param) => {
  return axios.request({
    url: '/group/add',
    data: param,
    method: 'post'
  })
}


export const taskCommandCopy = (param) => {
  return axios.request({
    url: '/command/taskCopy',
    data: param,
    method: 'post'
  })
}

export const taskCommandAbort = (param) => {
  return axios.request({
    url: '/command/abort',
    data: param,
    method: 'post'
  })
}


export const taskCommandDelete = (param) => {
  return axios.request({
    url: '/command/delete',
    data: param,
    method: 'post'
  })
}

export const taskCommandPause = (param) => {
  return axios.request({
    url: '/command/pause',
    data: param,
    method: 'post'
  })
}

export const taskCommandResume = (param) => {
  return axios.request({
    url: '/command/resume',
    data: param,
    method: 'post'
  })
}


