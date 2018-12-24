import http from './http';
import URL from '../features/constants/apis'
import {getData, postData} from './fetch'

export default {

  createFile(params){
    return postData(URL.createFile,params);
  },
  createCrawProject(params){
    return postData(URL.creaCrawProject,params)
  },
  getProjectTree(params){
    return getData(URL.getProjectTree.replace('&',params))
  },
  getAllTask(params){
    return postData(URL .getAllTask,params)
  },
  renameFile(params){
    return postData(URL.renameFile,params)
  },
  deployProject(params,name){
    return getData(URL.deployProject.replace('&',name))
  },
  getTaskInfoByScriptId(id){
    return getData(URL.getTaskByScriptId.replace('&',id));
  },
  getScriptList(params){
    return postData(URL.getCrawScriptList,params)
  },
  startScript(params){
    return postData(URL.startScripts,params)
  },
  stopScript(params){
    return postData(URL.stopScripts,params)
  },
  disableScripts(params){
    return postData(URL.disableScripts,params)
  },
  enableScripts(params){
    return postData(URL.enableScripts,params)
  },
  updateFileContent(params){
    return postData(URL.updateFileContent,params)
  },
  delFile(params){
    return postData(URL.delFile,params)
  },
  getFileContent(params){
    return postData(URL.getFileContent,params)
  },
  getTakeDetail(id){
    return getData(URL.getTaskDetail.replace('&',id))
  },
  delProject(id){
    return getData(URL.delProject,id)
  },
  getAccountList(params){
    return getData(URL.getAccountList,params)
  },
  buildProject(params,name){
    return postData(URL.buildProject.replace('&',name),params)
  },
  addNewFile(params){
    return postData(URL.addNewFile,params)
  },
  getHostList(params){
    return getData(URL.getHostList,params)
  },
  saveScriptConfig(params){
    return postData(URL.saveScriptConfig,params)
  },
  getTaskList(params){
    return getData(URL.getAllTask,params)
  },
  createNewTask(params){
    return postData(URL.createNewTask,params)
  },
  removeTask(id){
    return getData(URL.removeTask.replace('&',id))
  },
  updateTask(params,id){
    return postData(URL.updateTask.replace('&',id),params)
  },
  getPlatList(params){
    return getData(URL.getPlatformList,params)
  },

  createPIP(params){
    return postData(URL.createProxyIp,params)
  },
  getPIP(id){
    return getData(URL.getProxyIp.replace('&',id))
  },
  updatePIP(params,id){
    return postData(URL.updateProxyIp.replace('&',id),params)
  },
  delPIP(id){
    return getData(URL.delProxyIp.replace('&',id))
  },
  getAllPIP(params){
    return postData(URL.getAllProxyIp,params)
  },

  getPlatformList(params){
    return getData(URL.getPlatformList,params)
  },
  getCrawSche(params){
    return postData(URL.getCrawSche,params)
  },
  getScriptResult(params){
    return getData(URL.getScriptResult,params)
  },
  getScriptLogLine(params){
    return getData(URL.getScriptLogLine,params)
  },
  runScript(params){
    return postData(URL.runScript,params)
  },
  showCrawTaskLog(params){
    return postData(URL.showCrawTaskLog,params)
  },
  getScriptDetail(params){
    return getData(URL.getScriptDetail,params)
  },
  createNode(params){
    return postData(URL.createNode, params)
  },
  updateNode(params,id){
    return postData(url.updateNode.replace('&',id),params)
  },
  delNode(id){
    return postData(URL.delNode.replace('&',id))
  },
  queryNode(id){
    return getData(URL.queryNode.replace('&',id))
  },
  getNodeList(params){
    return getData(URL.getNodeList,params)
  },
  getNodePartTwo(params){
    return postData(URL.getNodePartTwo,params)
  },
  getAllNode(params){
    return getData(URL.getAllNode,params)
  },
  removeScriptDetailItem(param){
    return getData(URL.removeScriptDetailItem, param)
  }
}