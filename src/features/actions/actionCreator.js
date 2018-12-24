import ajax from '../../api/global';
import loginAjax from '../../api/login'
import {message} from 'antd';
import { naviAction } from '../constants/actionTypes';

export const createGlobalAction = {
  getNavTree(login_flag){
    return dispatch => {
      ajax.getNavTree().then(res => {
        const {result_code, result_message, data} = res;
        if(result_code === 1){
          if(res.data === {} || res.data.length === 0){
            window.location.href = '/wncrawl.html#/forbidden';
            return;
          }
          dispatch({
            type: naviAction.GOT_NAVIGATION,
            payload: res.data
          })
          if(login_flag){
            window.location.href = res.data[0].permission_url
          }
        }else{
          message.error(result_message)
        }
      })
    }
  },
  login(params){
    return dispatch=>{
      loginAjax.login(params).then(res=>{
        if(res.result){
          dispatch(this.getNavTree(true))
        }else{
          message.error(res.result_message)
        }
      })
    }
  }
}
