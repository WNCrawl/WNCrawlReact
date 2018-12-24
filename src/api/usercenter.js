import http from './http';
import URL from '../features/constants/apis'
import {getData, postData} from './fetch'

export default {
  createNewUser(params){
    return postData(URL.createNewUser,params)
  },

  updateUserInfo(params,id){
    return postData(URL.updateUserInfo.replace('&',id),params)
  },

  resetUserPwd(params,id){
    return postData(URL.resetUserPassword.replace('&',id),params)
  },

  delUser(id){
    return getData(URL.delUser.replace('&',id))
  },

  queryUsers(params){
    return getData(URL.queryUsers,params)
  },

  createRole(params){
    return postData(URL.createRole,params)
  },

  getPermissions(params){
    return getData(URL.getPermissions,params)
  },

  updateRoleInfo(params,id){
    return postData(URL.updateRoleInfo.replace('&',id),params)
  },

  getUser(id){
    return getData(URL.getMemberDetail.replace('&',id))
  },
  updateInfo(params,id){
    return postData(URL.updateInfo.replace('&',id),params)
  },
  updatePwd(params,id){
    return postData(URL.updatePass.replace('&',id),params)
  },
  getRoleList(params){
    return getData(URL.getRoleList,params)
  },
  getRoleDetail(id){
    return getData(URL.getRoleDetail.replace('&',id))
  },
  getAlertList(params){
    return getData(URL.getAlertTypeList,params)
  },
  getRoleList(params){
    return getData(URL.getRoleList,params)
  },
  removeMember(id){
    return getData(URL.delUser.replace('&',id))
  },
  getProfile(id){
    return getData(URL.getUser.replace('&',id))
  },

}