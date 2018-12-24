import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import {Layout} from 'antd';
import SideNav from '../../components/SiderNav';

import './style.scss';

const {Sider} = Layout;
const URL = window.location.href.split('#')[0];

// const sideNav = [
//   {
//     name: '任务管理',
//     key: '0',
//     children: [],
//     path: URL + '#/crawmanage/taskmanage'
//   },{
//     name: '爬虫进度',
//     key: '1',
//     children: [],
//     path: URL + '#/crawmanage/crawsche'
//   },
//   {
//     name: 'IP管理',
//     key: '2',
//     children: [],
//     path: URL + '#/crawmanage/ipmanage'
//   }
// ]

const mapState = state => ({
  navTree: state.navigation.navTree
});

const mapDispatch = dispatch => ({});

@connect(mapState,mapDispatch)
export default class CrawManage extends Component{
  constructor(props){
    super(props);
    this.state = {
      sideNavData: []
    }

  }

  componentDidMount(){
    this.setSideNav(this.props.navTree)

  }

  componentWillReceiveProps(nextprops){
    this.setSideNav(nextprops.navTree)

  }

  setSideNav = (list)=>{
    list.map((o,i)=>{
      if(o.permission_name === '爬虫管理'){
        this.setState({
          sideNavData: list[i].children
        });
        return;
      }
    })
  }

  render(){
    return (
      <Layout>
        <Sider>
          <SideNav navData={this.state.sideNavData}></SideNav>
        </Sider>
        <Layout>
          {this.props.children}
        </Layout>
      </Layout>
    )
  }
}