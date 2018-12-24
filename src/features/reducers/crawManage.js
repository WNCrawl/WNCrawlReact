import {TaskDeve} from '../constants/crawManageTypes'

const initState = {
  newCrawInfo: {
    desc: '',
    dataPlat: [],
    interval: '',
    host: [],
    source: '',
    path: '',
    taskId: '',
  },
  openingScriptInfo: JSON.parse(localStorage.getItem('openingScript')) || {}
}

  export const crawManageReducer = (state = initState, action) => {
    switch(action.type){
      case TaskDeve.SAVE_NEW_CRAW_INFO: {
        return action.payload;
      }
      case TaskDeve.SAVE_OPENING_INFO: {
        state.openingScriptInfo = action.payload;
        localStorage.setItem('openingScript',JSON.stringify(action.payload))
        return state;
      }

      default: return state;
    }
  }