import React, {Component} from 'react';
import {Table, Input, Modal,Form,Button} from 'antd';
import channelManage from '.';

const Search = Input.Search;
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


export default class ChannelManage extends Component{
  constructor(props){
    super(props),
    this.state={
      tableLoading: false,
      paginationParams: {
        current: 1,
        total: 0,
        pageSize: 15
      },
      dataList: [],
      addModalShow: false,
      channelDetail: {},
      isEditting: false,
    }
  }

  componentDidMount(){
    this.setState({
      dataList: [
        {
          channel: '天猫-前端网页',
          loginName: '12231231241',
          password: '*****',
          id: 1
        },
        {
          channel: '天猫-前端网页',
          loginName: '12231231241',
          password: '*****',
          id: 2
        },
        {
          channel: '天猫-前端网页',
          loginName: '12231231241',
          password: '*****',
          id: 3
        },
        {
          channel: '天猫-前端网页',
          loginName: '12231231241',
          password: '*****',
          id: 4
        },
      ]
    })
  }


  handleSearch = (val)=>{
  }

  handleTableChange = (pagination,filters,sorter)=>{

  }

  showAddModal = ()=>{
    this.setState({
      isEditting: false,
      addModalShow: true
    })
  }

  editChannel = ()=>{
    //get channel detail
    this.setState({
      isEditting: true,
      addModalShow: true,
    })
  }
  length_40 = (rules,value,callback)=>{
    if(value !== ''){
      if(value.length>40){
        callback('数据平台不能超过40个字符')
      }else{
        callback()
      }
    }else{
      callback()
    }
  }

  handleAddModalOk = ()=>{
    const {form} = this.props;
    form.validateFields((err,values)=>{
      if(!err){
        if(this.state.isEditting){
          //update
        }else{
          //add new one
        }
      }
    })
  }

  render(){
    const {dataList,paginationParams,tableLoading,addModalShow,channelDetail} = this.state;
    const tableCol = [
      {
        title: '数据平台',
        key: 'channel',
        dataIndex: 'channel'
      },
      {
        title: '登录名',
        key: 'loginName',
        dataIndex: 'loginName'
      },
      {
        title: '登录密码',
        key: 'password',
        dataIndex: 'password',
      },
      {
        title: '操作',
        key: 'action',
        // dataIndex: 'action',
        render: (text,record)=>(
          <span>
            <a href="javascript:;" onClick={()=>this.editChannel(record.id)}>编辑  </a>
            <a href="javascript:;" onClick={()=>this.delChannel(record.id)}>删除</a>
          </span>
        )
      }
    ];
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="ip-container">
        <div className="func-box" >
          <Search style={{width: 200,marginBottom: 20,marginTop: 20}} onSearch={this.handleSearch} placeholder="输入IP地址"></Search>
          <Button onClick={this.showAddModal} type="primary">新增数据平台</Button>
        </div>
        <div className="table-box">
          <Table
            bordered
            columns={tableCol}
            dataSource={dataList}
            loading={tableLoading}
            pagination={paginationParams}
            onChange={this.handleTableChange}
            size="small">
          </Table>
        </div>
        <Modal maskClosable={false} destroyOnClose={true}
          visible={addModalShow}
          title="新增数据平台"
          onOk={this.handleAddModalOk}
          destroyOnClose={true}
          onCancel={()=>this.setState({addModalShow: false})}>
          <Form>
            <FormItem
              {...formLayout}
              label="数据平台">
                {
                  getFieldDecorator('channel',{
                    rules: [
                      {required: true, message:'数据平台不能为空'},
                      {validator: this.length_40}
                    ],
                    initialValue: channelDetail.channel || ''
                  })(
                    <Input placeholder="不超过40个字符"/>
                  )
                }
            </FormItem>
            <FormItem
              {...formLayout}
              label="登录名">
                {
                  getFieldDecorator('name',{
                    rules: [
                      {required: true, message:'登录名不能为空'},
                    ],
                  })(
                    <Input />
                  )
                }
            </FormItem>
            <FormItem
              {...formLayout}
              label="登录密码">
                {
                  getFieldDecorator('password',{
                    rules: [
                      {required: true, message:'登录密码不能为空'},
                    ],
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
ChannelManage = Form.create()(ChannelManage)