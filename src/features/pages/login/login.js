import React,{Component} from 'react';
import {Input,Button,Form,message} from 'antd';
import ajax from '../../../api/login';
import {connect} from 'react-redux';
import {createGlobalAction} from '../../actions/actionCreator'


import './style.scss'

const FormItem = Form.Item;


const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    },
    wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    },
}


const mapState = state => ({
  navTree: state.navigation.navTree,
  a: state.navigation
});

const mapDispatch = dispatch => ({
  getNavTree(){
    dispatch(createGlobalAction.getNavTree())
  },
  login(params){
    dispatch(createGlobalAction.login(params))
  }
});

@connect(mapState,mapDispatch)
export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      imgSrc: '',
    }
  }

  componentDidMount(){
    this.setState({
      imgSrc: 'http://172.16.10.61/uic/api/v2/account/login/gen-captcha'
    })
  }

  login = ()=>{
    const {form} = this.props;
    form.validateFields((err,value)=>{
      if(!err){
        this.props.login(value)
      }
    })
  }

  render(){
    const {getFieldDecorator}  = this.props.form;
    const {imgSrc} = this.state;

    return (
      <div className="login-container">
        <div className="form-box">
          <p className="title">云采集</p>
          <Form>
            <FormItem
              {...formLayout}>
              {
                getFieldDecorator('username',{
                  rules: [
                    {required: true, message: '用户名不可为空'}
                  ]
                })(
                  <Input placeholder="请输入用户名"/>
                )
              }
            </FormItem>
            <FormItem
              {...formLayout}>
              {
                getFieldDecorator('password',{
                  rules: [
                    {required: true, message: '密码不可为空'}
                  ]
                })(
                  <Input size="large" placeholder="请输入密码" type="password"/>
                )
              }
            </FormItem>
            {/* <FormItem
              {...formLayout}
              label="验证码">
              {
                getFieldDecorator('validcode',{
                  rules: [
                    // {required: true, message: '验证码不可为空'}
                  ]
                })(
                  <div style={{display: 'flex'}}>
                    <Input/>
                    <img src={imgSrc}/>
                  </div>
                )
              }
            </FormItem> */}
            <FormItem
              {...formLayout}>
              <Button htmlType="submit"  style={{width: '100%'}} type="primary" onClick={this.login}>登录</Button>
            </FormItem>
          </Form>
          <div>
          </div>
        </div>
      </div>
    )
  }
}
Login = Form.create()(Login)