import ajax from '../../api/global';
import {message} from 'antd';
import { LoginType } from '../constants/loginTypes';

export const addNewCrawAction = {
  login(params){
    return dispatch=>{
      ajax.login(params).then(res=>{
        if(res.result){
          ajax.getNavTree().then(res => {
            const {result_code, result_message, data} = res;
            if(result_code === 1){
              dispatch({
                type: naviAction.GOT_NAVIGATION,
                payload: res.data
              })
            }else{
              message.error(result_message)
            }
          })
        }else{
          message.error(res.result_message)
        }
      })
    }
  }
}