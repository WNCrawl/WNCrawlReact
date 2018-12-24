import React, {Component} from 'react';
import {Select,Modal,message} from 'antd';
import ajax from '../../../../api/datasync'


const Option = Select.Option;

export default class ShowLog extends Component{
  constructor(props){
    super(props);
    this.state = {
      taskId: -1,
      taskDetail: {},
      chooseingHost: '',
      interval: Object,
    }
  }

  componentWillMount(){
    this.state.taskId = this.props.params.taskId || -1;

    ajax.getTaskDetail(this.state.taskId).then(res=>{
      if(res.result){
        let d = res.data;

        //后端传过来的是字符串，处理一下
        d.source_cfg = d&&d.source_cfg?JSON.parse(d.source_cfg.replace(/\'/g,'"')):{}
        d.target_cfg = d&&d.target_cfg?JSON.parse(d.target_cfg.replace(/\'/g,'"')):{}
        d.schedule_date = d&&d.schedule_date?JSON.parse(d.schedule_date.replace(/\""/g,'').replace(/\'/g,'"')):{}
        if(typeof d.execute_host === 'string'){
          d.execute_host = JSON.parse(d.execute_host.replace(/\""/g,'').replace(/\'/g,'"'))
        }
        this.setState({
          taskDetail: d,
          chooseingHost: d.execute_host.length>0?d.execute_host[0]:undefined
        },()=>{
          this.loadInte();
        })
      }else{
        message.error(result_message)
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
      job_id: this.state.taskDetail.job_id,
      task_id: this.state.taskDetail.id,
      host_ip: this.state.chooseingHost
    }
    ajax.showTaskLog(params).then(res=>{
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
              {this.state.taskDetail.execute_host && this.state.taskDetail.execute_host.map(o=>{
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