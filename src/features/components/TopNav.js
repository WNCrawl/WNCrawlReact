import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import {Layout,Menu,Dropdown,Icon,message} from 'antd';
import Cookie from '../../utils/cookie'

const {Header} = Layout;
const URL = window.location.href.split('#')[0];
const {getCookie,clearAllCookie, deleteAllCookies} = Cookie;

const mapState = state => ({
  navTree: state.navigation.navTree instanceof Array?state.navigation.navTree:[]
});

const mapDispatch = dispatch => ({});

@connect(mapState,mapDispatch)
export default class TopNav extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentUrl: -1,
      selectKey: [],
      userName: '',

      navData: [],
    }
  }

  componentDidMount(){
    const {pathname} = location;
    if(!getCookie('dt_token')){
      window.location.href = URL + '#/login';
      return;
    }
    this.setSelectKey();
    this.setState({
      userName: getCookie('dt_username').replace(/\"/g,'')
    })
  }

  componentWillReceiveProps(nextProps){
    this.setSelectKey();
    this.progressNavData(nextProps.navTree)
  }

  progressNavData = (list)=>{
    
  }

  loginOut = ()=>{
    if(clearAllCookie()){
      window.location.href = '/wncrawl.html#/login'
    }else{
      message.error('登出失败')
    }
  }

  setSelectKey = ()=>{

    if(window.location.href.indexOf('usercenter') > -1){
      if(window.location.href.indexOf('userinfo') > -1){
        this.setState({
          selectKey: ['2']
        })
      }else if(window.location.href.indexOf('rolemanage') > -1){
        this.setState({
          selectKey: ['1']
        })
      }
    }
  }


  render(){
    const {navTree} = this.props;
    const {selectKey} = this.state;
    const currentUrl = window.location.href;

    let flag = false;

    const dropOverlay = (
    <Menu
      selectedKeys = {selectKey}
      >
      {
          navTree && navTree.map(o=>{
            if(o.permission_name === '用户管理'){
              return <Menu.Item key="1">
                <a href={o.permission_url}>用户管理</a>
              </Menu.Item>
            }
          })
        }
      <Menu.Item key="2">
        <a href={URL + "#/usercenter/userinfo"}>个人信息</a>
      </Menu.Item>
      <Menu.Item>
        <a href="javascript:;" onClick={this.loginOut}>退出登录</a>
      </Menu.Item>
    </Menu>)



    return (
      <Header className="top-nav">
        <div className="container">
        <div className="nav-btn-logo">
          <span className="logo">
            云采集
          </span>
          <span className="nav-btn">
            <ul>
              {
                 navTree && navTree.map(o=>{
                  return (
                    o.permission_name !== '用户管理' && <li className={currentUrl.indexOf(o.permission_url.split('/wncrawl.html#/')[1].split('/')[0])!==-1?'active':''} key={o.id}><a href={o.permission_url}>{o.permission_name}</a></li>
                  )
                }
                )
              }
            </ul>
          </span>
        </div>
          <div className="rightDrop">
            <Dropdown overlay={dropOverlay} trigger={['click']}>
              <a>{this.state.userName}<Icon type="down"/></a>
            </Dropdown>
          </div>
        </div>
      </Header>
    )
  }
}