
import React, {Component} from 'react';
import {Select,Modal,message} from 'antd';
import ajax from '../../../../api/crawmanage'



const Option = Select.Option;

export default class ShowCrawLog extends Component{
  constructor(props){
    super(props);
    this.state = {
      scriptId: -1,
      taskDetail: {},
      chooseingHost: '',
      interval: Object,
      hostList: [],

    }
  }

  componentWillMount(){
    this.state.scriptId = this.props.params.scriptId || -1;
    // this.getHost();
    this.getTaskDetail();
  }

  getTaskDetail = ()=>{
    ajax.getScriptDetail({script_id: this.state.scriptId}).then(res=>{
      if(res.result){
        this.state.taskDetail = res.data;
        this.setState({
          hostList: res.data,
          chooseingHost: res.data.length>0?res.data[0]:undefined
        },()=>{
          this.loadInte();
        })
        // this.getHost();
      }else{
        message.error(res.result_message)
      }
    })
  }

  
  loadInte = ()=>{
    this.getLog();
    this.state.interval = setInterval(()=>{
      this.getLog()
    },5000)
  }


  handleHostChange = (e)=>{
    clearInterval(this.state.interval);
    this.setState({
      chooseingHost: e
    },()=>{
      this.loadInte();
    })
  }

  getLog = () => {
    const params = {
      script_id: this.state.scriptId,
      host_ip: this.state.chooseingHost
    }
    ajax.showCrawTaskLog(params).then(res=>{
      if(res.result){
        this.setState({
          logContent: res.data.message
        })
      }else{
        message.error(res.result_message)
      }
    })
  }


  render(){

    return (
      <div className="log-content-container">
        <div className="func-bar">
          <span className="title">选择IP:</span>
          <Select value={this.state.chooseingHost} style={{width: 200}} onChange={this.handleHostChange}>
              {this.state.hostList.map(o=>{
                return <Option key={o} value={o}>{o}</Option>
              })}
          </Select>
        </div>
        <div className="log-content-box">
          <pre>
            {this.state.logContent}
          </pre>
        </div>
      </div>
    )
  }

  
}