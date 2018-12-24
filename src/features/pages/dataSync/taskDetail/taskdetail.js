import React,{Component} from 'react';
import {Link,hashHistory} from 'react-router';
import {Input,Button,Form,Select,Collapse,DatePicker,TimePicker,Icon,Divider,Tooltip,message} from 'antd';
import moment from 'moment';

import ajax from '../../../../api/datasync'
import '../style.scss'

const FormItem = Form.Item;
const {Panel} = Collapse;
const Option = Select.Option;
const Textarea = Input.TextArea;
const URL = window.location.href.split('#')[0];


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

const customPanelStyle = {
  background: '#f7f7f7',
  border: 0,
  overflow: 'hidden',
};


export default class TaskDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      taskId: -1,
      taskDetail: undefined,
      dataSource: [],
      hostList: [],
    }
  }

  componentWillMount(){

  }


  processSourceCFG = (o)=>{
    console.log(o)
    let sql = o.slice(o.indexOf('"source_condition": "') + '"source_condition": "'.length,o.indexOf('", "source_type'));
    console.log(sql)
    o = o.replace(sql,'1');
    // sql = sql[0] === '"'?sql.slice(1):sql;
    // sql = sql[sql.length-1] === '"'?sql.slice(0,sql.length-1):sql;
    console.log(sql)
    console.log(o)
    // console.log(o.replace(/\'/g,'"'))
    o = JSON.parse(o.replace(/\'/g,'"'));
    o.source_condition = sql;
    
    return o;
  }

  componentDidMount(){
    console.log('uopmb')
    this.getHostList();
    this.getSourceList();

    this.state.taskId = this.props.params.taskId || -1;

    if(this.state.taskId !== -1){
      //get detail
      ajax.getTaskDetail(this.state.taskId).then(res=>{
        console.log(res);
        if(res.result){
          let d = res.data;
          d.source_cfg = this.processSourceCFG(d.source_cfg)

          //后端传过来的是字符串，处理一下
          // d.source_cfg = d&&d.source_cfg?JSON.parse(d.source_cfg.replace(/\'/g,'"')):{}
          d.target_cfg = d&&d.target_cfg?JSON.parse(d.target_cfg.replace(/\'/g,'"')):{}
          d.schedule_date = d&&d.schedule_date?JSON.parse(d.schedule_date.replace(/\""/g,'').replace(/\'/g,'"')):{}
          if(typeof d.execute_host === 'string'){
            d.execute_host = JSON.parse(d.execute_host.replace(/\""/g,'').replace(/\'/g,'"'))
          }
          this.setState({
            taskDetail: d
          },()=>{
            console.log(this.state.taskDetail)
          })
        }else{
          message.error(result_message)
        }
      })
    }
  }


  length_40 = (rules,value,callback)=>{
    if(value && value.length>40){
      callback('任务名称不能超过40个字符')
    }else{
      callback()
    }
  }
  taskNameValid = (rules,value,callback) => {
    if(value && value.length > 40){
      callback('任务名称不能超过40个字符');
      
    }else if(value && value.indexOf('/')!==-1){
      callback('任务名称不能包含"/"字符')
    }else{
      callback();
    }
  }
  getHostList = ()=>{
    ajax.getHostList().then(res=>{
        this.setState({
          hostList: res.data instanceof Array?res.data:[],
        },()=>{
          console.log(this.state.hostList)
        })
    })
  }
  getSourceList = ()=>{
    ajax.getSourceList({page:1,size:9999}).then(res=>{
      if(res.result){
        this.setState({
          dataSource: res.data.results,
        },()=>{
          console.log(this.state.dataSource)
        })
      }else{
        message.error(res.result_message)
      }
    })
    console.log(this.state.dataSource)
  }
  handleSave = ()=>{
    const {form} = this.props;
    form.validateFields((err,values)=>{
      console.log(values)
      if(!err){
        const params = {
          task_name: values['taskName'],
          task_desc: values['taskDesc'],
          execute_host: values['execute_host'],
          source_cfg: {
            source_name: values['taskSource'][0],
            // source_table: values['taskTableName'],
            source_condition: values['taskFilterContent'],
            source_type: values['taskSource'][1],
            source_id: values['taskSource'][2],
          },
          target_cfg: {
            target_name: values['taskSyncSource'],
            // target_table: values['taskSyncTableName'],
            target_path: values['taskFilePath'],
          },
          effect_date: values['affectDate'].format('YYYY-MM-DD HH:mm:ss'),
          schedule_cycle: values['taskScheCycle'] || '1',
          schedule_date: {
            day: values['taskScheTime_day'],
            hour: values['taskScheTime_hour'],
            minute: values['taskScheTime_minute'],
            day_of_week: values['taskScheTime_week']
          }
        }
        if(!params.schedule_date.day) delete params.schedule_date.day;
        if(!params.schedule_date.hour) delete params.schedule_date.hour;
        if(!params.schedule_date.minute) delete params.schedule_date.minute;
        if(!params.schedule_date.day_of_week) delete params.schedule_date.day_of_week;
        
        console.log(params)
        if(this.state.taskId === -1){
          ajax.saveTask(params).then((res)=>{
            if(res.result){
              message.success('创建成功');
              hashHistory.push('datasync/task')
            }else{
              message.error(res.result_message)
            }
          })
        }else{
          ajax.updateTask(params,this.state.taskId).then(res=>{
            if(res.result){
              hashHistory.push('datasync/task')
            }else{
              message.error(res.result_message)
            }
          })
        }
      }
    })
  }

  render(){
    const {getFieldDecorator,getFieldsValue} = this.props.form;
    let {dataSource,taskId,taskDetail} = this.state;
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    let currentForm = getFieldsValue();
    return (
      <div className="task-detail-container">
      <div className="content-box">
      <div className="nav">
        <Link to="/datasync/task" className="nav-btn">
          <Icon type="left" />
          <span>{!taskDetail?'任务管理':taskDetail.name}</span>
        </Link>
      </div>
      <Divider/>
        {/* <Collapse bordered={true} defaultActiveKey={['1','2','3','4']}>
          <Panel key="1" header="基本信息"> */}
            <Form>
              <span className="title">基本信息</span>
              { taskDetail && taskId!==-1 && <FormItem
                {...formLayout}
                label="任务ID">
                {
                  getFieldDecorator('taskId',{
                    rules: [
                      {required: true,message:'任务ID不可为空'},
                    ],
                    initialValue: taskDetail.id
                  })(
                    <Input placeholder="请输入任务ID" disabled/>
                  )
                }
              </FormItem>}
              <FormItem
                {...formLayout}
                label="任务名称">
                {
                  getFieldDecorator('taskName',{
                    rules: [
                      {required: true,message:'任务名称不可为空'},
                      {validator: this.taskNameValid}
                    ],
                    initialValue: !taskDetail?undefined:taskDetail.task_name
                  })(
                    <Input placeholder="请输入任务名称"/>
                  )
                }
              </FormItem>
              <FormItem
                {...formLayout}
                label="任务描述">
                {
                  getFieldDecorator('taskDesc',{
                    initialValue: !taskDetail?undefined:taskDetail.task_desc
                  })(
                    <Input placeholder="请输入任务描述"/>
                  )
                }
              </FormItem>
              <FormItem
                {...formLayout}
                label="指定主机">
                {
                  getFieldDecorator('execute_host',{
                    rules: [
                      {required: true,message:'主机不可为空'}
                    ],
                    initialValue: !taskDetail?undefined:taskDetail.execute_host
                  })(
                    <Select  getPopupContainer={triggerNode => triggerNode.parentNode} mode="multiple">
                      {this.state.hostList.map(o=>{
                        return <Option value={`${o.node_ip}:${o.node_port}`}>{`${o.node_ip}:${o.node_port}`}</Option>
                      })}
                    </Select>
                  )
                }
              </FormItem>
              {taskDetail && taskId !== -1 && 
              <div>
                <FormItem
                  {...formLayout}
                  label="创建时间">
                  {taskDetail.created_at}
                </FormItem>
                <FormItem
                  {...formLayout}
                  label="创建人">
                  {taskDetail.creator_name}
                </FormItem>
              </div>
            }
            {/* </Form>
          </Panel>
          <Panel key="2" header="数据源配置">
            <Form> */}
            <span className="title title-top">数据源配置</span>
              <FormItem
                  {...formLayout}
                  label="数据源">
                  {
                    getFieldDecorator('taskSource',{
                      rules: [
                        {required: true,message:'数据源不可为空'}
                      ],
                      initialValue: !taskDetail?undefined:[taskDetail.source_cfg.source_name,taskDetail.source_cfg.source_type,taskDetail.source_cfg.source_id]
                    })(
                      <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} placeholder="请选择数据源">
                        {
                          dataSource.map(o=>{
                            return <Option value={[o.source_name,o.source_type,o.id]}>
                              {o.source_name}
                            </Option>
                          })
                        }
                      </Select>
                    )
                  }
                </FormItem>
              {/* <FormItem
                {...formLayout}
                label={<span>数据表</span>}>
                {
                  getFieldDecorator('taskTableName',{
                    rules: [
                      // {required: true,message:'数据表名不可为空'}
                    ],
                    initialValue: !taskDetail?undefined:taskDetail.source_cfg.source_table
                  })(
                    <Input placeholder="请输入数据表名"/>
                  )
                }
              </FormItem> */}
              <FormItem
                {...formLayout}
                label={<span>过滤条件</span>}>
                {
                  getFieldDecorator('taskFilterContent',{
                    rules: [
                      {required: true, message: '过滤条件不可为空'}
                    ],
                    initialValue: !taskDetail?undefined:taskDetail.source_cfg.source_condition
                  })(
                    <Textarea rows={4} placeholder="直接输入最终同步数据的sql，动态参数请用{}表达，请务必写出分页逻辑。">

                    </Textarea>
                  )
                }
              </FormItem>
            {/* </Form> */}
          {/* </Panel>
          <Panel key="3" header="数据同步">
            <Form> */}
            <span className="title title-top">数据同步</span>
              <FormItem
                  {...formLayout}
                  label="数据源">
                  {
                    getFieldDecorator('taskSyncSource',{
                      rules: [
                        // {required: true,message:'数据源不可为空'}
                      ],
                      initialValue: !taskDetail?'oss':taskDetail.target_cfg.target_name
                      // initialValue: 'oss'
                    })(
                      <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} placeholder="请选择数据源">
                        {/* {
                          dataSource.map(o=>{
                            return <Option value={[o.source_name,o.source_type,o.id]}>
                              {o.source_name}
                            </Option>
                          })
                        } */}
                        <Option value="oss">oss</Option>
                      </Select>
                    )
                  }
                </FormItem>
              {/* <FormItem
                {...formLayout}
                label="数据表">
                {
                  getFieldDecorator('taskSyncTableName',{
                    rules: [
                      {required: true,message:'数据表名不可为空'}
                    ],
                    initialValue: !taskDetail?undefined:taskDetail.target_cfg.target_table
                  })(
                    <Input placeholder="请输入数据表名"/>
                  )
                }
              </FormItem> */}
              {/* <FormItem
                {...formLayout}
                label="Buket名">
                {
                  getFieldDecorator('taskTableName',{
                    rules: [
                      {required: true,message:'buket名不可为空'}
                    ]
                  })(
                    <Input placeholder="请输入buket名"/>
                  )
                }
              </FormItem> */}
              <FormItem
                {...formLayout}
                label={<span>文件路径<Tooltip title="默认按照数据表名称_时间动态参数“的格式生成在数据表所在的文件路径下，也支持用户自定义。"><Icon type="question-circle-o"></Icon></Tooltip></span>}>
                {
                  getFieldDecorator('taskFilePath',{
                    rules: [
                      // {required: true,message:'文件路径不可为空'}
                    ],
                    initialValue: !taskDetail?'source':taskDetail.target_cfg.target_path
                  })(
                    <Input placeholder="请输入文件路径"/>
                  )
                }
              </FormItem>
            {/* </Form>
          </Panel>
          <Panel key="4" header="任务调度">
            <Form> */}
            <span className="title title-top">任务调度</span>
              <FormItem
                {...formLayout}
                label="生效日期">
                  {
                    getFieldDecorator('affectDate',{
                      rules: [
                        {required: true, message: '生效日期不能为空'}
                      ],
                      initialValue: !taskDetail?undefined:moment(taskDetail.effect_date, 'YYYY-MM-DD HH:mm:ss')
                    })(
                      <DatePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择时间">
                      </DatePicker>
                    )
                  }
              </FormItem>
              {/* <FormItem 
                {...formLayout}
                label="调度周期">
                {
                  getFieldDecorator('taskScheCycle',{
                    rules: [{
                      required: true,messages: '调度周期不可为空'
                    }],
                    initialValue: !taskDetail?'1':taskDetail.schedule_cycle
                  })(
                    <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} disabled={true}>
                      <Option value="1">天</Option>
                      <Option value="2">时</Option>
                    </Select>
                  )
                }
              </FormItem> */}
              {/* {getFieldsValue().taskScheCycle === '1'? */}
              <div>
                <FormItem
                {...formLayout}
                label={<span>调度设置<Tooltip title="填写格式为：*/number"><Icon type="question-circle-o"></Icon></Tooltip></span>}>
                  {
                    getFieldDecorator('taskScheTime_week',{
                      rules: [
                        // {required: true, message: '周不能为空'}
                      ],
                      initialValue: !taskDetail?undefined:taskDetail.schedule_date.day_of_week

                    })(
                      <div className="ph-box">
                      <Input defaultValue={!taskDetail?undefined:taskDetail.schedule_date.day_of_week} style={{width: 200}}/>
                      <a className="ph-text" href="javascript:;">周调度(number or name of weekday (0-6 or mon,tue,wed,thu,fri,sat,sun))</a>
                      </div>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formLayout}
                  label=" "
                  colon={false}>
                  {
                    getFieldDecorator('taskScheTime_day',{
                      rules: [{
                        // required: true,message:'天数不可为空'
                      }],
                      initialValue: !taskDetail?undefined:taskDetail.schedule_date.day
                    })(
                      <div className="ph-box">
                      <Input defaultValue={!taskDetail?undefined:taskDetail.schedule_date.day} style={{width: 200}} />
                      <a className="ph-text" href="javascript:;">天调度(day of the month (1-31))</a>
                        
                      </div>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formLayout}
                  label=" "
                  colon={false}>
                  {
                    getFieldDecorator('taskScheTime_hour',{
                      rules: [{
                        // required: true,message:'小时数不可为空'
                      }],
                      initialValue: !taskDetail?undefined:taskDetail.schedule_date.hour
                    })(
                      <div className="ph-box">
                      <Input defaultValue={!taskDetail?undefined:taskDetail.schedule_date.hour} style={{width: 200}} />

                      <a className="ph-text" href="javascript:;">小时调度(hour (0-23))</a>

                      </div>
                    )
                  }
                </FormItem> 
                <FormItem
                  {...formLayout}
                  label=" "
                  colon={false}>
                  {
                    getFieldDecorator('taskScheTime_minute',{
                      rules: [{
                        // required: true,message:'分钟数不可为空'
                      }],
                      initialValue: !taskDetail?undefined:taskDetail.schedule_date.minute
                    })(
                      <div className="ph-box">
                      <Input defaultValue={!taskDetail?undefined:taskDetail.schedule_date.minute} style={{width: 200}}/>
                      <a className="ph-text" href="javascript:;">分钟调度(minute (0-59))</a>
                      </div>
                    )
                  }
                </FormItem>
                </div>
                {/* :
                <div>
                  <FormItem
                    {...formLayout}
                    label="开始时间">
                    {
                      getFieldDecorator('taskScheBeginTime',{
                        rules: [{required:true,message:'开始时间不可为空'}]
                      })(
                        <TimePicker format="HH:mm"></TimePicker>
                      )
                    }
                  </FormItem>
                  <FormItem
                    {...formLayout}
                    label="间隔时间">
                    {
                      getFieldDecorator('taskScheIntervals',{
                        rules: [{required:true,message:'间隔时间不可为空'}],
                        initialValue: '5'
                      })(
                        <Select  getPopupContainer={triggerNode => triggerNode.parentNode}>
                          <Option key="5">5小时</Option>
                          <Option key="6">6小时</Option>
                          <Option key="7">7小时</Option>
                        </Select>
                      )
                    }
                  </FormItem>
                  <FormItem
                    {...formLayout}
                    label="结束时间">
                    {
                      getFieldDecorator('taskScheEndTime',{
                        rules: [{required:true,message:'间隔时间不可为空'}]
                      })(
                        <TimePicker format="HH:mm"></TimePicker>
                      )
                    }
                  </FormItem>
                </div>
              } */}
            </Form>
          {/* </Panel>
        </Collapse> */}
        <div className="btn-box">
          <Button className="btn" href={URL + "#/datasync/task"}>取消</Button>
          <Button type="primary" onClick={this.handleSave}>保存</Button>
        </div>
        </div>
      </div>
    )
  }
}
TaskDetail = Form.create()(TaskDetail)