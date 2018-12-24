import http from './http';
import URL from '../features/constants/apis'
import {getData, postData} from './fetch'

export default {
  getNavTree(){
    return getData(URL.getNavTree)
  }
}