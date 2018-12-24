import React from 'react';
import {connect} from 'react-redux';
import {Layout} from 'antd';
import classnames from 'classnames';
import {hashHistory,Link} from 'react-router';
import {createGlobalAction} from './actions/actionCreator'
import TopNav from './components/TopNav';

import '../assets/styles/main.scss'

const mapState = state => ({
  navTree: state.navigation.navTree,
  a: state.navigation
});

const mapDispatch = dispatch => ({
  getNavTree(){
    dispatch(createGlobalAction.getNavTree())
  }
});

@connect(mapState,mapDispatch)
export default class CrawApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      
    }
  }

  componentDidMount(){
    if(window.location.href.indexOf('login')===-1)
      this.props.getNavTree();

  }

  

  componentWillReceiveProps(nextProps){
  }


  componentDidUpdate(){
    if(window.location.href.indexOf('login')===-1 && this.props.navTree.length===0)
      this.props.getNavTree();
  }
  render(){
    const {children} = this.props;
    return (
      <Layout style={{height: '100%'}}>
        {window.location.href.split('#')[1] !== '/login' && <TopNav {...this.props}/>}
        {children}
      </Layout>
    )
  }
}