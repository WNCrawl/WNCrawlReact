import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import {Layout} from 'antd';
import SideNav from '../../components/SiderNav';

import './style.scss';
const URL = window.location.href.split('#')[0];


const {Sider} = Layout;

// const sideNavData = [
//   {
//     name: '角色管理',
//     key: '0',
//     children: [],
//     path: URL + '#/usercenter/rolemanage'
//   },{
//     name: '成员管理',
//     key: '1',
//     children: [],
//     path: URL + '#/usercenter/membersmanage'
//   }
// ]

const mapState = state => ({
  navTree: state.navigation.navTree
});

const mapDispatch = dispatch => ({});

@connect(mapState,mapDispatch)
export default class UserCenter extends Component{
  constructor(props){
    super(props)
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
      if(o.permission_name === '用户管理'){
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
        {window.location.href.indexOf('userinfo') === -1 && 
        <Sider>
          <SideNav navData={this.state.sideNavData}></SideNav>
        </Sider>}
        <Layout>
          {this.props.children}
        </Layout>
      </Layout>
    )
  }
}