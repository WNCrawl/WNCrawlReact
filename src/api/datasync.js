import http from './http';
import URL from '../features/constants/apis'
// import { url } from 'inspector';
import {getData, postData} from './fetch'

export default {
  saveTask(params){
    return postData(URL.saveNewTask,params);
  },
  getAllTask(params){
    return getData(URL.allTaskList,params)
  },
  updateTask(params,id){
    return postData(URL.updateTaskSync.replace('&',id),params)
  },
  delTask(id){
    return getData(URL.delTask + id)
  },
  getTaskDetail(id){
    return getData(URL.getTaskInfo + id)
  },
  getAllCycleIns(params){
    return postData(URL.allCycleIns,params)
  },
  delCycleIns(params){
    return postData(URL.delCycleIns,params)
  },
  reRunCycleIns(params){
    return postData(URL.reRunCycleIns,params)
  },
  allSuppData(params){
    return getData(URL.allSuppData,params)
  },
  getSuppDataDetail(params,id){
    return getData(URL.suppDataDetail + id,params)
  },
  delSuppData(params){
    return getData(URL.delSuppData,params)
  },
  reRunSuppData(params){
    return postData(URL.reRunSuppData,params)
  },
  getHostList(params){
    return getData(URL.getHostList,params)
  },
  getSourceList(params){
    return postData(URL.getAllSources,params)
  },
  suppSyncData(params){
    return postData(URL.suppSyncData,params)
  },
  killAllInstance(id){
    return getData(URL.killAllInstance.replace('&',id))
  },
  startTask(params){
    return postData(URL.startTask,params)
  },
  deployFromtask(params){
    return postData(URL.deployFromtask,params)
  },
  showTaskLog(params){
    return postData(URL.showTaskLog,params)
  }
}