import React, {Component,PropType} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Row,Col} from 'antd'
import TopNav from '../../components/TopNav'

export default class Index extends Component{
  constructor(props){
    super(props);
    this.setState = {

    }
  }
  
  componentDidMount(){
  }

  render(){
    return (
      <div>
        {/* <TopNav></TopNav> */}
        <p>Here is index</p>
      </div>
    )
  }
}