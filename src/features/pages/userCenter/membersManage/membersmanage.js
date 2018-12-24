import React, {Component} from 'react';
import {Table,Modal,Input,message,Checkbox,Radio,Form,Button} from 'antd';
import ajax from '../../../../api/usercenter'
const Search = Input.Search;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;


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


export default class MembersManage extends Component{
  constructor(props){
    super(props);
    this.state={
      addModalShow:false,
      tableLoading: false,
      dataList: [],
      paginationParams: {
        page: 1,
        pageSize: 15,
      },
      total: 0,
      keyword: '',
      resetPassId: -1,
      detailModalShow: false,
      resetPassModalShow: false,
      roleData: [],
      userDetail: {},
      edittingId:-1,
      alertType: [],
      showPass: false,
      passContent: '',
    }
  }

  componentDidMount(){
    this.getAlertType();
    this.getRoleList();
    this.getDataList();
  }

  removeMember = (id)=>{
    let self = this;
    confirm({
      title: '确认移除此用户？',
      onOk(){
        ajax.removeMember(id).then(res=>{
          if(res.result){
            message.success('移除成功');
            self.state.paginationParams.page = 1;
            self.getDataList();
          }else{
            message.error(res.result_message)
          }
        })
      }
    })
  }

  getRoleList = ()=>{
    ajax.getRoleList({page:1,pageSize:9999}).then(res=>{
      if(res.result){
        let d = [];
        res.data.map(o=>{
          d.push({
            value: o.id,
            label: o.role_name,
          })
        })
        this.setState({
          roleData: d
        })
      }else{
        message.error(res.result_message)
      }
    })
  }

  editMember = (id)=>{
    ajax.getUser(id).then(res=>{
      if(res.result){
        this.setState({
          userDetail: res.data,
          edittingId: id,
          detailModalShow: true
        })
      }else{
        message.error(res.result_message)
      }
    })
  }

  resetPassword = (id)=>{
    this.setState({
      resetPassModalShow: true,
      resetPassId: id
    })
  }

  getDataList(){
    const params = {
      keyword: this.state.keyword,
      page:this.state.paginationParams.page,
      size: this.state.paginationParams.pageSize
    }
    ajax.queryUsers(params).then(res=>{
      if(res.result){
        this.setState({
          dataList: res.data.results,
          total: res.data.total_elements
        })
      }else{
        message.error(res.result_message)
      }
    })
  }

  showAddModal = ()=>{
    this.setState({
      edittingId: -1,
      detailModalShow: true
    })
  }

  handleTableChange = (pagination,filters,sorter)=>{
    this.state.paginationParams.page = pagination.current;
    this.getDataList();
  }
  handleSearch = (val)=>{
    this.state.keyword = val;
    this.getDataList();
  }
  length_40 = (rules,value,callback)=>{
    if(value && value.length>40){
      callback('备注不能超过40个字符')
    }else{
      callback()
    }
  }
  getAlertType = ()=>{
    ajax.getAlertList().then(res=>{
      if(res.result){
        let d = [];
        res.data.map(o=>{
          d.push({
            value: o.id,
            label: o.alert_name
          })
        })
        this.setState({
          alertType: d
        })
      }else{
        message.error(res.result_message)
      }
    })
  }
  addAccount = ()=>{
    const {form} = this.props;
    form.validateFields([
      'account',
      'username',
      'mobile',
      'role_ids',
      'comment',
      'alert_enable',
      // 'userId',
      'alertType',
      'wx_account'
    ],(err,value)=>{
      if(err)
        return;
      if(this.state.edittingId === -1){

      const param = {
        account: value.account,
        mobile: value.mobile,
        role_ids: value.role_ids,
        comment: value.comment,
        alert_enable: value.alert_enable,
        alert_options: value.alertType,
        wx_account: value.wx_account,
        username: value.username
      }
        // const param = value;
        ajax.createNewUser(param).then(
          res=>{
            if(res.result){
              message.success('创建成功')
              this.setState({
                detailModalShow:false,
                showPass: true,
                passContent: res.data.password,
              })
              this.getDataList();
            }else{
              message.error(res.result_message)
            }
          }
        )
      }else{
        const param = {
          account: value.account,
          mobile: value.mobile,
          role_ids: value.role_ids,
          comment: value.comment,
          alert_enable: value.alert_enable,
          alert_options: value.alertType || [],
          wx_account: value.wx_account
        }
        ajax.updateUserInfo(param,this.state.edittingId).then(res=>{
          if(res.result){
            message.success('修改成功');
            this.setState({
              detailModalShow: false
            })
            this.state.paginationParams.page = 1;
            this.getDataList();
          }else{
            message.error(res.result_message)
          }
        })
      }
    })
  }

  validateMobile = (rule, value, callback) => {
    if (value) {
        if (!/^0?(13|14|15|17|18|19)[0-9]{9}$/.test(value)) {
            callback('手机号码格式不正确!')
        } else {
            callback()
        }
    } else {
        callback()
    }
  }

  passValid = (rules,value,callback)=>{
    const {form} = this.props;
    let ensurePass = form.getFieldValue('newPasswordEnsure');
    let newPass = form.getFieldValue('newPassword');

    if(value && ensurePass){
      if(newPass !== ensurePass){
        callback('两次输入的密码不一致')
      }else{
        callback();
      }
    }else{
      callback();
    }
  }

  resetpass = ()=>{
    const {form} = this.props;
    form.validateFields([
      'newPassword',
      'newPasswordEnsure'
    ],(err,value)=>{
      if(!err){
        const param = {
          new_pwd: value.newPassword,
          confirm_pwd: value.newPasswordEnsure
        } 
        ajax.resetUserPwd(param,this.state.resetPassId).then(res=>{
          if(res.result){
            message.success('重置成功')
            this.setState({
              resetPassModalShow: false
            })
          }else{
            message.error(res.result_message)
          }
        })
      }
     
    })
  }
  onlyENUnderLine = (rule,value,callback)=>{
    if(value && !/^[a-zA-Z][a-zA-Z_]+$/.test(value)){
      callback('账号只能包含字母与下划线')
    }else{
      callback();
    }
  }

  render(){
    const {getFieldDecorator,getFieldsValue} = this.props.form;
    const {edittingId,userDetail,alertType,tableLoading,roleData,dataList,paginationParams,detailModalShow,resetPassModalShow} = this.state;
    const tableCol = [
      {
        title: '用户账号',
        key: 'username',
        dataIndex: 'username',
      },{
        title: '姓名',
        key:'account',
        dataIndex: 'account'
      },{
        title: '联系电话',
        key: 'mobile',
        dataIndex: 'mobile'
      },{
        title: '备注',
        key: 'comment',
        dataIndex: 'comment'
      },{
        title: '创建时间',
        key: 'created_at',
        dataIndex: 'created_at',
      },{
        title: '操作',
        key: 'action',
        render: (text,record)=>(
          <span>
            <a href="javascript:;" onClick={()=>this.removeMember(record.id)}>移除成员 </a>
            <a href="javascript:;" onClick={()=>this.editMember(record.id)}>编辑 </a>
            <a href="javascript:;" onClick={()=>this.resetPassword(record.id)}>重置密码</a>
          </span>
        )
      }
    ];

    return (
      <div className="member-manage-container">
        <div className="top-box">
          <Search style={{width:200}} placeholder="输入用户账号/姓名" onSearch={this.handleSearch}></Search>
          <Button type="primary" onClick={this.showAddModal}>新增账号</Button>
        </div>
        <div className="table-box">
          <Table
           bordered
           rowKey="id"
           columns={tableCol}
           loading={tableLoading}
           dataSource={dataList}
           pagination={{current: paginationParams.page,total:this.state.total,pageSize:paginationParams.pageSize}}
           onChange={this.handleTableChange}
           size="small">

          </Table>
        </div>
        <Modal maskClosable={false} destroyOnClose={true}
         visible={detailModalShow}
         title="新增账号"
         onOk={this.addAccount}
         onCancel={()=>this.setState({detailModalShow:false})}>
          <Form>
            <FormItem
             {...formLayout}
             label="账号">
              {
                getFieldDecorator('username',{
                  rules:[
                    {required: true, message: '账号不可为空'},
                    {validator: this.onlyENUnderLine}
                  ],
                  initialValue: edittingId!==-1?userDetail.username:undefined
                })(
                  <Input disabled={this.state.edittingId!==-1} />
                )
              }
            </FormItem>
            <FormItem
             {...formLayout}
             label="姓名">
              {
                getFieldDecorator('account',{
                  rules:[
                    {required: true, message: '姓名不可为空'}
                  ],
                  initialValue: edittingId!==-1?userDetail.account:undefined
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem
             {...formLayout}
             label="手机号">
              {
                getFieldDecorator('mobile',{
                  rules:[
                    // {required: true, message: '账号不可为空'}
                    {validator: this.validateMobile}
                  ],
                  initialValue: edittingId!==-1?userDetail.mobile:undefined
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem
             {...formLayout}
             label="用户角色">
              {
                getFieldDecorator('role_ids',{
                  rules:[
                    {required: true, message: '用户角色不可为空'}
                  ],
                  initialValue: edittingId!==-1?userDetail.role_ids:undefined
                })(
                  <CheckboxGroup options={roleData}/>
                )
              }
            </FormItem>
            <FormItem
             {...formLayout}
             label="备注">
              {
                getFieldDecorator('comment',{
                  rules:[
                    // {required: true, message: '用户角色不可为空'}
                    {validator: this.length_40}
                  ],
                  initialValue: edittingId!==-1?userDetail.comment:undefined
                })(
                  <Input placeholder="不超过40个字符"/>
                )
              }
            </FormItem>
            <FormItem
             {...formLayout}
             label="是否告警">
              {
                getFieldDecorator('alert_enable',{
                  initialValue: edittingId!==-1?userDetail.alert_enable:0
                })(
                  <RadioGroup>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
            <FormItem
             {...formLayout}
             label="微信userid">
              {
                getFieldDecorator('wx_account',{
                  rules:[
                    {required: true, message: '微信userid不可为空'}
                  ],
                  initialValue: edittingId!==-1?userDetail.wx_account:undefined
                })(
                  <Input/>
                )
              }
            </FormItem>
            {getFieldsValue().alert_enable === 1 && <FormItem
             {...formLayout}
             label="告警类型">
              {
                getFieldDecorator('alertType',{
                  rules:[
                    {required: true, message: '告警类型不可为空'}
                  ],
                  initialValue: edittingId!==-1?userDetail.alert_ids:undefined
                })(
                  <CheckboxGroup options={alertType}/>
                  // <Input/>
                )
              }
            </FormItem>}
          </Form>
        </Modal>
        <Modal maskClosable={false} destroyOnClose={true} 
         visible={resetPassModalShow}
         title="重置密码"
         onOk={this.resetpass}
         onCancel={()=>this.setState({resetPassModalShow:false})}>
            <Form>
              <FormItem
                {...formLayout}
                label="新密码">
                {
                  getFieldDecorator('newPassword',{
                    rules: [
                      {required: true, message: '新密码不可为空'},
                      {validator: this.passValid}
                    ]
                  })(
                    <Input type="password"/>
                  )
                }
              </FormItem>
              <FormItem
                {...formLayout}
                label="确认新密码">
                {
                  getFieldDecorator('newPasswordEnsure',{
                    rules: [
                      {required: true, message: '确认新密码不可为空'},
                      {validator: this.passValid}
                    ]
                  })(
                    <Input type="password"/>
                  )
                }
              </FormItem>
            </Form>
        </Modal>
        <Modal
        visible={this.state.showPass}
        onOk={()=>this.setState({showPass:false})}
        onCancel={()=>this.setState({showPass:false})}
        title="密码">
              <p>{this.state.passContent}</p>
        </Modal>
      </div>
    )
  }
}
MembersManage = Form.create()(MembersManage)