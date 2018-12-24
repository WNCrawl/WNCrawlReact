import http from './http';
import URL from '../features/constants/apis'
import {getData, postData} from './fetch'

export default {
  login(params){
    return postData(URL.login,params)
  },
}