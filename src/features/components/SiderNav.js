import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Menu,Layout} from 'antd';

const {Sider} = Layout;
const {SubMenu} = Menu;

export default class SideNav extends Component{
  constructor(props){
    super(props);
    this.state = {
      defaultOpenKey: ['sub0'],
      defaultSelectKey: ['10']
    }
  }
  componentDidMount(){
    const {navData} = this.props;
    // this.setOpenKey(navData)

    this.setSelectKey(navData)
  }

  componentWillReceiveProps(nextProps){
    const {navData} = nextProps;
    // this.setOpenKey(navData)
    this.setSelectKey(navData)

  }

  setSelectKey(navData){
    let cur =  window.location.href.split('/wncrawl.html#')[1];
    navData.map(o=>{
      if(cur.replace(/\d+|\//g,'').indexOf(o.permission_url.split('/wncrawl.html#')[1].replace(/\d+|\//g,'')) !== -1){
        this.setState({
          defaultSelectKey: [o.id.toString()]
        })
      }else if(cur.replace(/\d+|\//g,'') === 'datasyncshowlog' && o.permission_url.split('/wncrawl.html#')[1].replace(/\d+|\//g,'')==='datasynctask'){
        //特殊的子页面特殊处理--数据同步中的查看日志
        this.setState({
          defaultSelectKey: [o.id.toString()]
        })
      }else if(cur.replace(/\d+|\//g,'') === 'crawmanageshowcrawlog' && o.permission_url.split('/wncrawl.html#')[1].replace(/\d+|\//g,'')==='crawmanagescriptdetail'){
        //特殊的子页面特殊处理--爬虫管理中的查看日志
        this.setState({
          defaultSelectKey: [o.id.toString()]
        })
      }
    })
  }

  sideNavClick = (item)=>{
    this.setState({
      defaultOpenKey:[item.keyPath[1]],
      defaultSelectKey: [item.key]
    })
  }

  render(){
    const {navData} = this.props;
    const {defaultOpenKey,defaultSelectKey} = this.state;
    return(
      <Menu
        onClick={this.sideNavClick.bind(this)}
        mode="inline"
        theme="light"
        defaultOpenKeys={defaultOpenKey}
        selectedKeys={defaultSelectKey}
        className="side-nav"
        style={{height: '100%',borderRight:0}}
      >
        {
          navData.map(i=>(
            i.children.length>0?
              <SubMenu key={i.id} title={i.permission_name}>
                {i.children.map(o=>(
                  o.children.length>0?
                  <SubMenu key={o.id} title={o.permission_name}>
                    o.children.map(p=>(
                      <Menu.Item key={p.id}><a href={p.permission_url}>{p.permission_name}</a></Menu.Item>
                    ))
                  </SubMenu>:
                  <Menu.Item key={o.id}><a href={o.permission_url}>{o.permission_name}</a></Menu.Item>
                ))}
              </SubMenu>:
              <Menu.Item key={i.id}><a href={i.permission_url}>{i.permission_name}</a></Menu.Item>
          ))
        }
      </Menu>
    )
  }
}