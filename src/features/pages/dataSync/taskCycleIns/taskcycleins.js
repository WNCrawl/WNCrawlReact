import React , {Component} from 'react';
import {Table,Input,message,Button,Icon,Tooltip,DatePicker,Modal} from 'antd';
import ajax from '../../../../api/datasync'
const {Search} = Input;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const URL = window.location.href.split('#')[0];


export default class TaskCycleIns extends Component{
  constructor(props){
    super(props),
    this.state = {
      instanceData: {
        total: 456,
        success: 400,
        running: 0,
        waitCommit: 20,
        failed: 36
      },
      paginationParam: {
        current: 1,
        pageSize: 15,
      },
      total: 100,
      tableList:[],
      tableLoading: false,
      selectedItem: [],
      suppDataId: -1,
      instanceDetail: {
        name: 'dsds_kol_OL'
      },
      filter: {
        name: '',
        bizDate: [],
        planDate: [],
        sync_status: [],
      },
      taskDetail: undefined,
    }
  }
  componentDidMount(){
    this.setState({
      suppDataId: this.props.params.suppDataId || -1
    },()=>{
      this.getTaksDetail();
    })
  }

  getTaksDetail = ()=>{
    ajax.getTaskDetail(this.state.suppDataId).then(res=>{
      if(res.result){
        this.setState({
          taskDetail: res.data[0]
        },()=>{
          this.state.filter.name = this.state.taskDetail.task_name;
          this.state.paginationParam.page = 1;
          this.getTableList();
        })
      }else{
        message.error('获取任务详情失败')
      }
    })
  }
  searchByInput = (value)=>{
    this.state.filter.name = value;
    this.state.paginationParam.page = 1;
    this.getTableList();
  }
  killInstance = ()=>{
    const {selectedItem} = this.state;
    if(selectedItem.length === 0){
      confirm({
        title: '请选择需要删除的实例',
        content: '',
        onOk() {
          
        },
      });
    }else{
      confirm({
        title: '您确定要删除此实例吗？',
        content: '',
        onOk() {
          //send del request
          ajax.delCycleIns(selectedItem).then(res=>{
            if(res.result){
              message.success('杀任务成功')
            }else{
              message.error(res.result_message)
            }
          })
        },
        onCancel() {
        },
      });
    }
  }
  handleTableChange = (pagination, filters, sorter)=>{
    this.state.paginationParam.page = pagination.current;
    this.state.filter.sync_status = filters.sync_status;
    this.getTableList();
  }
  runTasks = ()=>{
    const {selectedItem} = this.state;
    if(selectedItem.length === 0){
      confirm({
        title: '请选择需要重跑的任务。',
        content: '',
        onOk(){
          
        },
        onCancel(){}
      })
    }else{
      confirm({
        title: '您确定要重跑此任务吗？',
        content: '',
        onOk(){
          //send run task request
          ajax.reRunCycleIns(selectedItem).then(res=>{
            if(res.result){
              message.success('重跑任务成功')
            }else{
              message.error(res.result_message)
            }
          })
        },
        onCancel(){}
      })
    }
  }

  getTableList= ()=>{
    const params = {
      keyword: this.state.filter.name,
      biz_start_date: this.state.filter.bizDate[0] || '',
      biz_end_date: this.state.filter.bizDate[1] || '',
      plan_start_date: this.state.filter.planDate[0] || '',
      plan_end_date: this.state.filter.planDate[1] || '',
      page: this.state.paginationParam.page,
      size: this.state.paginationParam.pageSize,
      sync_status: this.state.filter.sync_status,
    }

    ajax.getAllCycleIns(params).then(res=>{
      if(res.result){
        this.setState({
          tableList: res.data.results,
          total: res.data.total_elements,
          instanceData: {
            total: res.data.extra.total_elements,
            success: res.data.extra.success_cnt,
            running: res.data.extra.running_cnt,
            waitCommit: res.data.extra.wait_cnt,
            failed: res.data.extra.fail_cnt,
          }
        })
      }else{
        message.error(res.result_message)
      }
    })
  }

  handleBizDateChange = (val,valStr)=>{
    this.state.filter.bizDate = valStr;
    this.state.paginationParam.page = 1;
    this.getTableList();
  }

  handlePlanDateChange = (val,valStr)=>{
    this.state.filter.planDate = valStr;
    this.state.paginationParam.page = 1;
    this.getTableList();
  }

  render(){
    const {instanceData,paginationParam,tableList,tableLoading,suppDataId,instanceDetail,total} = this.state;
    const tableCol = [
      {
        title: '任务名称',
        key: 'task_name',
        dataIndex: 'task_name',
        // render: (text,record)=>(
        //     <a href={URL + "#/datasync/taskdetail/" + record.id}>text</a>
        // )
      },{
        title: '状态',
        key: 'sync_status',
        dataIndex: 'sync_status',
        filters:[
          {text: '成功',value: 2},
          {text: '等待运行',value: 0},
          {text: '失败',value: 3},
          {text: '运行中',value: 1},
        ],
        render: (text,record)=>{
          return text === 3?<div>失败 <Tooltip title={record.message}><Icon type="question-circle-o" /></Tooltip></div>:text===2?'成功':text===0?'等待运行':text===1?'运行中':''
        }
      },{
        title: '开始时间',
        key: 'start_date',
        dataIndex: 'start_date',
      },{
        title: '结束时间',
        key: 'end_date',
        dataIndex: 'end_date'
      },{
        title: '运行时长',
        key: 'cost_time',
        dataIndex: 'cost_time'
      },{
        title: '数据同步量',
        key: 'sync_cnt',
        dataIndex: 'sync_cnt'
      }
    ]
    const rowSelection = {
      onChange: (rowKeys,rows)=>{
        let i = [];
        rows.map(o=>{
          i.push(o.id)
        })
        this.state.selectedItem = i;
      },
      getCheckboxProps: record=>({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      })
    }
    if(suppDataId===-1){
      tableCol.splice(2,0,{
        title: '调度周期',
        key: 'cycle',
        dataIndex: 'cycle',
        filters: [
          {text: '天任务', value: 'day'},
          {text: '小时任务', value: 'hour'}
        ],
        render: (text,record)=>(
          text==='day'?'天任务':'小时任务'
        )
      });
    }
    return(
      <div className="cycle-container">
        {
          suppDataId!==-1?<div className="nav"><a href={window.location.href.indexOf('suppdatadetail')>-1?URL + "#/datasync/suppdata":URL + "#/datasync/task"}><Icon type="left"/>{this.state.taskDetail?this.state.taskDetail.task_name:''}</a></div>:''
        }
        <div className="stauts-box">
          <span className="total">任务实例总数：{instanceData.total}</span>
          <span><a className="success">成功：{instanceData.success}</a>  <a className="running">运行中：{instanceData.running}</a>   <a className="failed">失败：{instanceData.failed}</a>  </span>
        </div>
        <div className="func-box">
          <span className="co"><Search style={{width: 160}} defaultValue={this.state.taskDetail?this.state.taskDetail.task_name:undefined} onSearch={this.searchByInput} placeholder="任务名称"/></span>
          <span className="co">业务日期 <RangePicker onChange={this.handleBizDateChange} format="YYYY-MM-DD"></RangePicker></span>
          <span className="co">计划日期 <RangePicker onChange={this.handlePlanDateChange} format="YYYY-MM-DD"></RangePicker></span>
        </div> 
        <div className="table-box">
          <Table
           rowSelection={rowSelection}
           columns={tableCol}
           dataSource={tableList}
           onChange={this.handleTableChange}
           pagination={{current: paginationParam.page,total: total,pageSize:paginationParam.pageSize}}
           loading={tableLoading}
           size="small"
           >
          </Table>
          <div className="btn-box">
            <Button style={{marginRight: 20}} type="primary" onClick={this.killInstance.bind(this)}>批量杀人物</Button>
            <Button type="primary" onClick={this.runTasks.bind(this)}>重跑当前任务</Button>
          </div>
        </div>
      </div>
    )
  }
}
