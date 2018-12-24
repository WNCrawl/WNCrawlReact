// import {asyncComponent} from 'react-async-component';
import React from 'react';
import {Route,IndexRoute} from 'react-router';


import CrawApp from './container'

import DataSync from './pages/dataSync'
import Task from './pages/dataSync/task'
import SuppData from './pages/dataSync/suppData'
import Cycle from './pages/dataSync/cycle'
import TaskDetail from './pages/dataSync/taskDetail'
import SuppDataDetail from './pages/dataSync/suppDataDetail'
import TaskCycleIns from './pages/dataSync/taskCycleIns'
import ShowLog from './pages/dataSync/showLog'

import CrawManage from './pages/crawManage'
import TaskManage from './pages/crawManage/taskManage/taskmanage';
import CrawSche from './pages/crawManage/crawsche'
import CreateTaskIndex from './pages/crawManage/createTaskIndex'
import IpManage from './pages/crawManage/ipManage'
import ChannelManage from './pages/crawManage/channelManage'
import CrawTaskDetail from './pages/crawManage/crawTaskDetail'
import ScriptDetail from './pages/crawManage/scriptDetail'
import ShowCrawLog from './pages/crawManage/ShowCrawLog'
import NodeManage from './pages/crawManage/nodeManage'

import UserCenter from './pages/userCenter'
import RoleManage from './pages/userCenter/roleManage'
import MembersManage from './pages/userCenter/membersManage'
import UserInfo from './pages/userCenter/userInfo'
import Login from './pages/login'

import NotFound from './pages/404'
import Forbidden from './pages/403'


const Routers = 
<Route path="/" component={CrawApp}>

  <IndexRoute component={DataSync}></IndexRoute>
  <Route path="notfound" component={NotFound}></Route>
  <Route path="forbidden" component={Forbidden}></Route>

  
  <Route path="datasync" component={DataSync}>
    <Route path="task" component={Task}></Route>
    <Route path="taskdetail(/:taskId)" component={TaskDetail}></Route>
    <Route path="suppdata" component={SuppData}></Route>
    <Route path="cycle(/:suppDataId/:taskName)" component={Cycle}></Route>
    <Route path="suppdatadetail/:suppDataId" component={SuppDataDetail}></Route>
    <Route path="showlog/:taskId" component={ShowLog}></Route>
    {/* <Route path="taskcycleins/:suppDataId" component={TaskCycleIns}></Route> */}
  </Route>

  <Route path="crawmanage" component={CrawManage}>
    <Route path="taskmanage" component={TaskManage}></Route>
    <Route path="crawsche(/:taskname)(/:scriptname)" component={CrawSche}></Route>
    <Route path="createcrawindex" component={CreateTaskIndex}></Route>
    {/* <Route path="basesettings(/:taskId)" component={BaseSettings}></Route> */}
    <Route path="ipmanage" component={IpManage}></Route>
    <Route path="channelmanage" component={ChannelManage}></Route>
    {/* <Route path="editscript(/:taskId)" component={EditScript}></Route> */}
    <Route path="crawtaskdetail/:mode(/:id)" component={CrawTaskDetail}></Route>
    <Route path="scriptdetail(/:scriptId/:taskId)" component={ScriptDetail}></Route>
    <Route path="showcrawLog/:scriptId" component={ShowCrawLog}></Route>
    <Route path="nodemanage" component={NodeManage}></Route>
  </Route>

  <Route path="usercenter" component={UserCenter}>
    <Route path="rolemanage" component={RoleManage}></Route>
    <Route path="membersmanage" component={MembersManage}></Route>
    <Route path="userinfo" component={UserInfo}></Route>
  </Route>

  <Route path="login" component={Login}></Route>

</Route>

export default Routers;