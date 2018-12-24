import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';

import {naviReducer} from './navigation';
import {crawManageReducer} from './crawManage'

const appReducer = combineReducers({
  routing,
  navigation: naviReducer,
  newcraw: crawManageReducer
});
export default appReducer;