import React, {Component} from 'react';
import {Button,Select,Table,Input,message,Modal,Form,DatePicker, Divider} from 'antd';
import ajax from '../../../../api/datasync'

const confirm = Modal.confirm;
const {Search} = Input;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const URL = window.location.href.split('#')[0];
const Option = Select.Option;


const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    },
    wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
    },
}


export default class Task extends Component{
  constructor(props){
    super(props);
    this.state = {
      paginationParam: {
        page: 1,
        pageSize: 15
      },
      total: 0,
      taskList: [],
      dataModalTableList: [
        {
          name: 'dsdsadsadasdasdas',
          type: '数据同步'
        }
      ],
      showDataModal: false,
      filterInput: '',

      suppTaskName: '',
      suppTaskType: '',
      suppTaskId: '',
      loggingRecord: undefined,
      showLogModal: false,
      logContent: '',
    }
  }

  componentDidMount(){
    console.log('mount!')
    // this.setState({
    //   taskList:[
    //     {
    //       name: 'store_tmao_list',
    //       type: 'orancle',
    //       cycle: 'day',
    //       creator: 'muyan@dtstack.com',
    //       date: '2018-06-29 21:57:54',
    //       id: 3
    //     }
    //   ]
    // })
    this.getTableList();
  }
  processSourceCFG = (o)=>{
    console.log(o)
    let sql = o.slice(o.indexOf('"source_condition":') + '"source_condition":'.length,o.indexOf(', "source_type'));
    console.log(sql)
    o = o.replace(sql,'1');
    console.log(o)
    // console.log(o.replace(/\'/g,'"'))
    o = JSON.parse(o.replace(/\'/g,'"'));
    o.source_condition = sql;
    return o;
  }

  getTableList(text){
    const params = {
      size: this.state.paginationParam.pageSize,
      page: this.state.paginationParam.page,
      keyword: this.state.filterInput
    }
    ajax.getAllTask(params).then(res=>{
      if(res.result){
        res.data.results.map(o=>{
          o.source_cfg = this.processSourceCFG(o.source_cfg)
        })
        this.setState({
          total: res.data.total_elements,
          taskList: res.data.results,
        })
      }else{
        message.error(res.result_message)
      }
    })
  }
  startIt = (e)=>{
    const params = {id: e.id};
    ajax.startTask(params).then(res=>{
      if(res.result){
        message.success('启动成功');
      }else{
        message.error(res.result_message)
      }
    })
  }
  handleDeploy = (e)=>{
    ajax.deployFromtask().then(res=>{
      if(res.result){
        message.success('发布成功')
      }else{
        message.error(res.result_message)
      }
    })
  }
  handleTableChange = (pagination, filters, sorter)=>{
    this.state.paginationParam.page = pagination.current;
    this.getTableList();
  }
  handleSearchClick = (val)=>{
    console.log(val)
    this.state.filterInput = val;
    this.state.paginationParam.page = 1;
    this.getTableList();
  }
  handleDelClick = (id)=>{
    let self = this;
    confirm({
      title: '您确定要删除此任务吗？',
      content: '',
      onOk(){
        ajax.delTask(id).then(res=>{
          if(res.result){
            message.success('删除成功');

            self.state.paginationParam.page = 1;
            self.getTableList();
          }else{
            message.error(res.result_message)
          }
        })
      }
    })
    
  }
  suppData = ()=>{
    const {form} = this.props;
    form.validateFields((err,values)=>{
      if(!err){
        const param = {
          instance_name: values.dataName,
          biz_start_date: values.dataDate[0].format('YYYY-MM-DD'),
          biz_end_date: values.dataDate[1].format('YYYY-MM-DD'),
          task_id: this.state.suppTaskId,
        }
        console.log(param)

        ajax.suppSyncData(param).then(res=>{
          if(res.result){
            message.success('操作成功')
            this.setState({
              showDataModal: false,
            })
          }else{
            message.error(res.result_message)
          }
        })
      }
    })
  }

  showLog = (record)=>{
    console.log(record)
    if(typeof record.execute_host === 'string')
      record.execute_host = JSON.parse(record.execute_host.replace(/\'/g,'"'));
    this.state.loggingRecord = record;
    this.getLog(record.execute_host.length>0?record.execute_host[0]:'')
  }

  handleHostChange = (e)=>{
    this.getLog(e);
  }

  getLog = (hostIp) => {
    
    const params = {
      job_id: this.state.loggingRecord.job_id,
      task_id: this.state.loggingRecord.id,
      host_ip: hostIp
    }
    console.log(params)
    ajax.showTaskLog(params).then(res=>{
      if(res.result){
        this.setState({
          showLogModal: true,
          logContent: res.data.message
        })
      }else{
        message.error(res.result_message)
      }
    })
  }

  render(){
    const {showDataModal,dataModalTableList} = this.state;
    const {getFieldDecorator,getFieldsValue} = this.props.form;
    
    const tableCol = [
      {
        title: '任务名称',
        key: 'task_name',
        dataIndex: 'task_name',
        render: (text,record)=>(
          <a href={URL + "#/datasync/cycle/" + record.id + "/" + record.task_name}>{text}</a>
        )
      },{
        title: '数据源',
        key: 'source_cfg.source_name',
        dataIndex: 'source_cfg.source_name',
      },{
        title: '调度周期',
        key: 'schedule_cycle',
        dataIndex: 'schedule_cycle',
        render: (text,record)=>{
          return text==='1'?'天':''
        }
      },{
        title: '创建时间',
        key: 'created_at',
        dataIndex: 'created_at',
      },{
        title: '操作',
        key: 'action',
        render: (text,record)=>(
          <span>
            {/* <a href="javascript:;" onClick={()=>this.setState({showDataModal:true,suppTaskName: record.task_name,suppTaskType:record.task_type,suppTaskId:record.id})}>补数据&nbsp;</a>  */}
            <a href={URL + "#/datasync/taskdetail/" + record.id}>编辑</a> 
            <Divider type="vertical"/>
            <a href="javascript:;" onClick={()=>this.handleDelClick(record.id)}>删除</a>
            <Divider type="vertical"/>
            <a href="javascript:;" onClick={()=>this.startIt(record)}>启动</a>
            <Divider type="vertical"/>
            <a href={URL+'#/datasync/showlog/' + record.id} target="_blank">查看最近一次日志</a>
          </span>
        )
      }
    ]
    
    const modalTabelCol = [
      {
        title: '任务名称',
        key: 'name',
        dataIndex: 'name',
      },{
        title: '任务类型',
        key: 'type',
        dataIndex: 'type'
      }
    ]

    const rowSelection = {
      onChange: (rowKeys,rows)=>{
        console.log(rowKeys);
        console.log(rows)
      },
      getCheckboxProps: record=>({
      })
    }
    return (
      <div className="task-container">
        <div className="top-box">
          <Search style={{width: 160}} onSearch={this.handleSearchClick} placeholder="任务名称" className="input-box"></Search>
          <span>
            <Button style={{marginRight: 20}} type="primary" onClick={this.handleDeploy}>发布</Button>
            <Button type="primary" href={URL + "#/datasync/taskdetail"}>创建任务</Button>
          </span>
        </div>
        <div className="table-box">
          <Table bordered={true} 
          onChange={this.handleTableChange}
          pagination={
            {pageSize: this.state.paginationParam.pageSize,
            current: this.state.paginationParam.page,
            total: this.state.total}
          } size="small" 
          columns={tableCol} 
          rowKey="id"
          dataSource={this.state.taskList}>
          </Table>
        </div>

        <Modal maskClosable={false} destroyOnClose={true} visible={showDataModal} 
          okText="运行选中的任务"
          onOk={this.suppData}
          onCancel={()=>this.setState({showDataModal: false})}
          title="补数据">
          <div className="data-modal-box">
            <Form>
              <FormItem
                {...formLayout}
                label="补数据名">
                {
                  getFieldDecorator('dataName',{
                    rules: [{required: true,message:'补数据名不能为空'}]
                  })(
                    <Input placeholder="请填写补数据名"/>
                  )
                }
              </FormItem>
              <FormItem
                {...formLayout}
                label="业务日期">
                {
                  getFieldDecorator('dataDate',{
                    rules: [{required: true,message:'业务日期不能为空'}]
                  })(
                    <RangePicker format="YYYY-MM-DD"></RangePicker>
                  )
                }
              </FormItem>
            </Form>
            <Table dataSource={[{name: this.state.suppTaskName,type:'数据同步'}]} pagination={false} columns={modalTabelCol}></Table>
          </div>
        </Modal>
        <Modal
        visible={this.state.showLogModal}
        // visible={true}
        width={720}
        title="查看日志"
        destroyOnClose={true}
        onOk={()=>{this.setState({showLogModal:false})}}
        onCancel={()=>{this.setState({showLogModal:false})}}>
          <div className="log-host-select">
              <span className="title">选择IP:</span>
              <Select defaultValue={this.state.loggingRecord && this.state.loggingRecord.execute_host[0]} style={{width: 200}} onChange={()=>this.handleHostChange}>
                  {this.state.loggingRecord && this.state.loggingRecord.execute_host && this.state.loggingRecord.execute_host.map(o=>{
                    return <Option value={o}>{o}</Option>
                  })}
              </Select>
          </div>
          <div className="log-content">
            <pre>
              {this.state.logContent}
            </pre>
          </div>
        </Modal>
      </div>
      
    )
  }
}
Task = Form.create()(Task);