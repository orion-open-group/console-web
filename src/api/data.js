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

export const cleanRunningLock = (param) => {
  return axios.request({
    url: '/task/schedule/cleanRunningLock',
    params: param,
    method: 'post'
  })
}

export const getTaskConfigList = (param) => {
  return axios.request({
    url: '/task/config/list',
    params: param,
    method: 'get'
  })
}

export const addTaskConfig = (param) => {
  return axios.request({
    url: '/task/config/add',
    data: param,
    method: 'post'
  })
}

export const getTaskGroupList = (param) => {
  return axios.request({
    url: '/task/group/list',
    params: param,
    method: 'get'
  })
}

export const getTaskLogList = (param) => {
  return axios.request({
    url: '/task/log/list',
    params: param,
    method: 'get'
  })
}

export const deleteTask = (param) => {
  return axios.request({
    url: '/task/config/delete',
    data: param,
    method: 'post'
  })
}

export const modifyTask = (param) => {
  return axios.request({
    url: '/task/config/modify',
    data: param,
    method: 'post'
  })
}

export const resumeSchedule = (param) => {
  return axios.request({
    url: '/task/schedule/resume',
    data: param,
    method: 'post'
  })
}

export const pauseSchedule = (param) => {
  return axios.request({
    url: '/task/schedule/pause',
    data: param,
    method: 'post'
  })
}

export const deleteGroup = (param) => {
  return axios.request({
    url: '/task/group/delete',
    data: param,
    method: 'post'
  })
}

export const modifyGroup = (param) => {
  return axios.request({
    url: '/task/group/modify',
    data: param,
    method: 'post'
  })
}

export const queryGroupUser = (param) => {
  return axios.request({
    url: '/task/group/user/list',
    params: param,
    method: 'get'
  })
}

export const addGroup = (param) => {
  return axios.request({
    url: 'task/group/add',
    data: param,
    method: 'post'
  })
}

export const addGroupUser = (param) => {
  return axios.request({
    url: '/task/group/user/add',
    data: param,
    method: 'post'
  })
}

export const taskCommandCopy = (param) => {
  return axios.request({
    url: 'task/command/taskCopy',
    data: param,
    method: 'post'
  })
}

export const taskCommandAbort = (param) => {
  return axios.request({
    url: 'task/command/abort',
    data: param,
    method: 'post'
  })
}

export const taskCommandPause = (param) => {
  return axios.request({
    url: 'task/command/pause',
    data: param,
    method: 'post'
  })
}

export const taskCommandResume = (param) => {
  return axios.request({
    url: 'task/command/resume',
    data: param,
    method: 'post'
  })
}

export const deleteGroupUser = (param) => {
  return axios.request({
    url: '/task/group/user/delete',
    data: param,
    method: 'post'
  })
}


