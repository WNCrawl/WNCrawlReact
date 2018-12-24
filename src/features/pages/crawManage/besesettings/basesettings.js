import React,{Component} from 'react';
import {Form,Icon,Button,Input,Select,Collapse,Tooltip} from 'antd';
import {hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {addNewCrawAction} from '../../../actions/crawManage'

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;


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

const mapState = state => ({
  newCrawInfo: state.newcraw.newCrawInfo
});

const mapDispatch = dispatch => ({
  handleNextStepClick(params){
    dispatch(addNewCrawAction.handleNextStepClick(params))
  }
})

@connect(mapState,mapDispatch)
export default class BaseSettings extends Component{
  constructor(props){
    super(props),
    this.state = {
      taskDetail: {
        taskName: '',
        taskId: '',
        createTime: '',
        taskId: '',
        creator: ''
      },
      crawWays: [],
      hosts: [],
      dataSources: [],
    }
  }

  componentDidMount(){
    
  }

  length_100 = (rules,value,callback)=>{
    if(value.length>100){
      callback('爬虫描述不能超过100个字符')
    }else{
      callback()
    }
  }
  length_40 = (rules,value,callback)=>{
    if(value.length>40){
      callback('任务名称不能超过40个字符')
    }else{
      if(/^[0-9a-zA-Z_]{1,}$/.test(value)){
        callback()
      }else{
        callback('任务名称只能包含英文、数字与下划线')
      }
    }
  }
  nextStep = ()=>{
    const {form} = this.props;
    form.validateFields((err,value)=>{
      if(!err){
        //执行保存然后跳转
        value.id = this.state.taskId;
        this.props.handleNextStepClick(value);
        // hashHistory.push('crawmanage/editscript/' + this.state.taskDetail.taskId)
        hashHistory.push('crawmanage/editscript/1')

      }
    })
  }
  render(){
    const {getFieldDecorator} = this.props.form;
    const {taskDetail,crawWays,hosts,dataSources} = this.state;

    return(
      <div className="baseSetting-container">
        <div className="func-box">
          <span><Icon type="left"></Icon>{taskDetail.taskName}</span>
          <span>
            <Button className="btn">保存并退出</Button>
            <Button className="btn">取消</Button>
            <Button className="btn" type="primary" onClick={this.nextStep}>下一步</Button>
          </span>
        </div>
        <div></div>
            <Form>
              <FormItem
               {...formLayout}
               label="任务ID">
               <p>{taskDetail.taskId}</p>
              </FormItem>
              <FormItem
               {...formLayout}
               label="任务名称">
               {
                 getFieldDecorator('taskName',{
                   rules: [
                     {required: true, message: '任务名称不能为空'},
                     {validator: length_40}
                   ]
                 })(
                  <Input disabled value={taskDetail.taskName}/>
                 )
               }
              </FormItem>

              <FormItem
               {...formLayout}
               label="爬虫描述">
               {
                 getFieldDecorator('desc',{
                   rules: [
                    //  {retuqires: true, message: '爬虫描述不可为空'},
                     {validator: this.length_100}
                   ]
                 })(
                    <Input placeholder="不超过100个字符"/>
                 )
               }
              </FormItem>
              <FormItem
               {...formLayout}
               label="数据平台">
               {
                 getFieldDecorator('dataPlat',{
                   rules: [
                     {retuqires: true, message: '数据平台不可为空'},
                    //  {validator: this.length_100}
                   ]
                 })(
                    <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} mode="multiple">
                      {
                        crawWays.map(o=>(
                          <Option key={o.value}>{o.name}</Option>
                        ))
                      }
                    </Select>
                 )
               }
              </FormItem>
              <FormItem
               {...formLayout}
               label="调度周期">
               {
                 getFieldDecorator('interval',{
                   rules: [
                     {retuqires: true, message: '调度周期不能为空'},
                    //  {validator: length_100}
                   ]
                 })(
                    <Input placeholder="支持多个调度表达式，中间用','隔开"/>
                 )
               }
              </FormItem>
              <FormItem
               {...formLayout}
               label="指定主机">
               {
                 getFieldDecorator('host',{
                   rules: [
                     {retuqires: true, message: '主机不能为空'},
                    //  {validator: length_100}
                   ]
                 })(
                    <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} mode="multiple">
                      {
                        hosts.map(o=>(
                          <Option key={o.value}>{o.name}</Option>
                        ))
                      }
                    </Select>
                 )
               }
              </FormItem>
              <FormItem
               {...formLayout}
               label="创建时间">
               <p>{taskDetail.createTime}</p>
              </FormItem>
              <FormItem
               {...formLayout}
               label="创建人">
               <p>{taskDetail.creator}</p>
              </FormItem>
            </Form>
      </div>
    )
  }
}
BaseSettings = Form.create()(BaseSettings)