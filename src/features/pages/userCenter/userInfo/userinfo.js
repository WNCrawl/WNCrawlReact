import React,{Component} from 'react';
import {Modal,Form,Input,message} from 'antd';
import ajax from '../../../../api/usercenter'
import Cookie from '../../../../utils/cookie'
// import './style.scss'

const FormItem = Form.Item;

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
export default class UserInfo extends Component{
  constructor(props){
    super(props),
    this.state = {
      userInfo: {},
      showEditModal: false,
      showResetModal: false,
      userId: -1,
    }
  }

  componentDidMount(){
    this.state.userId = Cookie.getCookie('dt_user_id');
    this.getUserInfo();
  }
  getUserInfo(){
    ajax.getProfile(this.state.userId).then(res=>{
      if(res.result){
        this.setState({
          userInfo: res.data,
        })
      }else{
        message.error(res.result)
      }
    })
  }

  edit = ()=>{
    this.setState({
      showEditModal: true
    })
  }
  resetPass = ()=>{
    this.setState({
      showResetModal: true
    })
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

  handleEditOk = ()=>{
    const {form} = this.props;
    form.validateFields([
      'newName',
      'newPhone',
      'newWXUserId',
    ],(err,value)=>{
      if(!err){
        const param = {
          account: value.newName,
          mobile: value.newPhone,
          wx_account: value.newWXUserId
        }
        ajax.updateInfo(param,this.state.userId).then(res=>{
          if(res.result){
            message.success('修改成功')
            this.setState({
              showEditModal:false,
            })
            this.getUserInfo();
          }else{
            message.error(res.result_message)
          }
        })
      }else{
        console.log(err)
      }
    })
  }

  handleResetOk = ()=>{
    const {form} = this.props;
    form.validateFields([
      'old_pwd',
      'new_pwd',
      'confirm_pwd'
    ],(err,value)=>{
      if(!err){
        ajax.updatePwd(value,this.state.userId).then(res=>{
          if(res.result){
            message.success('修改密码成功')
            this.setState({
              showResetModal:false
            })
          }else{
            message.error(res.result_message)
          }
        })
      }
    })
  }

  render(){
    const {userInfo,showEditModal,showResetModal} = this.state;
    const {getFieldDecorator} = this.props.form;
    return(
      <div className="userinfo-container">
        <p>个人信息</p>
        <div className="info-box">
          <div className="top-box">
            账号：{userInfo.username}&nbsp;&nbsp;&nbsp;
            <a href="javascript:;" onClick={this.edit}>编辑  </a>
            <a href="javascript:;" onClick={this.resetPass}>修改密码</a>
          </div>
          <div className="bottom-box">
            <p>基础信息：</p>
            <div>
              <p>姓名：{userInfo.account}</p>
              <p>手机号：{userInfo.mobile}</p>
              <p>微信userId：{userInfo.wx_account}</p>
              <p>创建时间：{userInfo.created_at}</p>
            </div>
          </div>
        </div>
        <Modal maskClosable={false} destroyOnClose={true}
          visible={showEditModal}
          onOk={this.handleEditOk}
          title="编辑信息"
          onCancel={()=>this.setState({showEditModal:false})}>
          <Form>
            <FormItem
             {...formLayout}
             label="账号">
                <span>{userInfo.username}</span>
            </FormItem>
            <FormItem
              {...formLayout}
              label="姓名">
              {
                getFieldDecorator('newName',{
                  rules: [
                    {required: true, message: '姓名不能为空'}
                  ],
                  initialValue: userInfo.account
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem
              {...formLayout}
              label="手机号">
              {
                getFieldDecorator('newPhone',{
                  rules: [
                    {required: true, message: '手机号不能为空'},
                    {validator: this.validPhone}
                  ],
                  initialValue: userInfo.mobile
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem
              {...formLayout}
              label="微信user id">
              {
                getFieldDecorator('newWXUserId',{
                  rules: [
                    {required: true, message: '微信user id不能为空'},
                    {validator: this.validPhone}
                  ],
                  initialValue: userInfo.wx_account
                })(
                  <Input/>
                )
              }
            </FormItem>
          </Form>
        </Modal>
        <Modal maskClosable={false} destroyOnClose={true}
         visible={showResetModal}
         onOk={this.handleResetOk}
         onCancel={()=>this.setState({showResetModal:false})}
         title="重置密码">
         <Form>
           <FormItem 
            {...formLayout}
            label="旧密码">
             {
               getFieldDecorator('old_pwd',{
                rules: [
                  {required: true, message: '旧密码不可为空'}
                ]
              })(
                <Input type="password"/>
              )
             }
           </FormItem>
           <FormItem 
            {...formLayout}
            label="新密码">
             {
               getFieldDecorator('new_pwd',{
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
               getFieldDecorator('confirm_pwd',{
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
      </div>
    )
  }
}
UserInfo = Form.create()(UserInfo)