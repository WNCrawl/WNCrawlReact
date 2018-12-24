import {naviAction} from '../constants/actionTypes'

const initState = {
  privilege: {
    authorities: []
  },
  navTree: []
};
export const naviReducer = (state = initState, action) => {
  const {type,payload} = action;
  let newState = Object.assign({},state)
  switch(action.type){
    case naviAction.GOT_NAVIGATION: 
      newState.navTree = payload;
      return newState;

    default: return state;
  }
}