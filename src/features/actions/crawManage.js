import ajax from '../../api/global';
import {message} from 'antd';
import { TaskDeve } from '../constants/crawManageTypes';

export const addNewCrawAction = {
  saveNewCrawInfo(params){
    return{
      type: TaskDeve.SAVE_NEW_CRAW_INFO,
      payload: {
        newCrawInfo: params
      },
    }
  },
  saveOpeningInfo(params){
    return {
      type: TaskDeve.SAVE_OPENING_INFO,
      payload: params
    }
  }
}