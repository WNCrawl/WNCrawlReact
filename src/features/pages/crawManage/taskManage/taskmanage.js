import React, {Component} from 'react';
import {Input,Button,Select,Modal,Table,Form,message,Divider} from 'antd';
import ajax from '../../../../api/crawmanage'

const {Search} = Input;
const {Option} = Select;
const {confirm} = Modal;
const FormItem = Form.Item;
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



export default class TaskManage extends Component{
  constructor(props){
    super(props);
    this.state = {
      tableLoading: false,
      dataList: [],
      selectOptions: [
        {
          name: '天猫-生意参谋',
          value: '1'
        },
        {
          name: '天猫-赤兔名品',
          value: '2'
        },
        {
          name: '天猫-淘宝直通车',
          value: '3'
        },
      ],
      paginationParam: {
        page: 1,
        pageSize: 15
      },
      total: 0,
      showCrawCreateModal: false,
      showCrawProjectInfoModal: false,
      keyword: '',
      channel: [],
      filter: {
        is_deploy: [],
      }
    }
  }

  componentDidMount(){
    console.log('mount')
    this.getDataList();
    this.getPlatFormList();
  }

  handleCreateCraw(){
    console.log('handle create')
    const {form} = this.props;
    form.validateFields((err,value)=>{
      if(!err){
        console.log(value)
      }
    })
  }

  handleSearch = (val)=>{
    console.log(val)
    this.state.keyword = val
    this.getDataList();
  }
  handleSelect = (val)=>{
    console.log(val)
    this.state.channel = val
    this.getDataList();
  }

  handleTableChange = (pagination, filters, sorter)=>{
    console.log(pagination);
    console.log(filters);
    console.log(sorter);

    this.state.paginationParam.page = pagination.current;
    this.state.filter.is_deploy = filters.is_deploy;

    this.getDataList();
  }
  validNameInput(rules,value,callback){
    if(value !== ''){
      if(value.length > 40){
        callback('任务名称不能超过40个字符')
      }else
        callback()
    }else{
      callback()
    }
  }
  handleSearchChange = (e)=>{
    this.state.filter.platform_id = e.target.value;
  }
  getPlatFormList = ()=>{
    ajax.getPlatList().then(res=>{
      if(res.result){
        this.setState({
          selectOptions:res.data instanceof Array?res.data:[]
        })
      }else{
        message.error(res.result_message)
      }
    })
  }
  getDataList = ()=>{
    const params = {
      keyword: this.state.keyword,
      platform_id: this.state.channel,
      page: this.state.paginationParam.page,
      size: this.state.paginationParam.pageSize,
      is_deploy: this.state.filter.is_deploy,
    }
    ajax.getAllTask(params).then(res=>{
      if(res.result){
        this.setState({
          dataList: res.data.results,
          total: res.data.total_elements
        })
        console.log('sett')
      }else{
        message.error(res.result_message)
      }
    })
  } 
  handleTaskClick = (status,record)=>{
    // let self = this;
    // status = status.toString();
    // if(status==='2'){
    //   console.log('停止')
    // }else if(status === '1'){
    //   console.log('启动')
    // }else if(status === '-1'){
    //   console.log('重试')
    // }else if(status === '0'){
      confirm({
        title: '确定要发布此任务吗?',
        content:'',
        onOk() {
          const params = {}
          ajax.deployProject(params,record.project_name).then(res=>{
            if(res.result){
              message.success('发布成功')
            }else{
              message.error(res.result_message)
            }
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      })
    // }
  }
  showCreateCrawModal=()=>{
    this.setState({
      showCrawCreateModal: true
    })
  }
  handletaskDel = (id)=>{
    console.log(id)
    let self = this;
    confirm({
      title: '确定要删除此任务吗?',
      content:'',
      onOk() {
        ajax.removeTask(id).then(res=>{
          if(res.result){
            message.success('删除成功');
            self.state.paginationParam.page = 1;
            self.getDataList();
          }else{
            message.error(res.result_message)
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }
  handleCrawProductInfoOk = ()=>{
    
  }
  render(){
    const {total,showCrawProductInfoModal,dataList,tableLoading,selectOptions,paginationParam,showCrawCreateModal} = this.state
    const tableCol = [
      {
        title: '工程名称',
        key: 'task_name',
        dataIndex: 'task_name',
        render: (text,record)=>(
          <a href={URL + '#/crawmanage/crawtaskdetail/1/' + record.id}>{text}</a>
        )
      },{
        title: '数据平台',
        key: 'platform_name',
        dataIndex: 'platform_name',
      },{
        title: '状态',
        key: 'is_deploy',
        dataIndex: 'is_deploy',
        render: (text,record)=>(
          text === 1?'已发布':text===0?'未发布':''
        ),
        filters: [
          {text: '未发布',value: 0},
          {text: '已发布',value: 1}
        ]
      },{
        title: '创建时间',
        key: 'created_at',
        dataIndex: 'created_at',
      },{
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        render: (text,record)=>(
          <span>
            <a href="javascript:;" onClick={()=>this.handleTaskClick(record.status,record)}>
              {
                record.is_deploy === 1?'再次发布':'发布'
              }
            </a>
            <Divider type="vertical"></Divider>
            <a href="javascript:;" onClick={()=>this.handletaskDel(record.id)}>删除</a>
            

            {record.is_deploy === 1 && <span><Divider type="vertical"></Divider><a href={URL + '#/crawmanage/scriptdetail/' + record.project_id + '/' + record.id}>查看脚本</a></span>}

            {/* {record.is_deploy === 1 && <span><Divider type="vertical"></Divider></span>} */}

            {record.is_deploy === 1 && <span><Divider type="vertical"></Divider><a href={URL + '#/crawmanage/crawsche/' + record.task_name}>查看爬虫进度</a></span>}
            
          </span>
        )
      }
    ];
    const {getFieldDecorator} = this.props.form;
    return(
      <div className='taskmanage-container'>
        <div className='func-box'>
          <span>
            <Search style={{width: 160, marginRight: 20}} className="search-box" placeholder="工程名称"  onSearch={this.handleSearch}></Search>

            <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} style={{minWidth: 150}} mode="multiple" onChange={this.handleSelect} placeholder="数据平台">
              {
                selectOptions.map(o=>(
                  <Option key={o.id} value={o.platform_id}>{o.platform_name}</Option>
                ))
              }
            </Select>
          </span>
          <span>
            <Button type="primary" href={URL + "#/crawmanage/crawtaskdetail/1"}>新建爬虫任务</Button>
          </span>
        </div>
        <div className="table-box">
          <Table 
            bordered
           dataSource={dataList}
           columns={tableCol}
           rowKey="id"
           loading={tableLoading}
           onChange={this.handleTableChange}
           pagination={{current: paginationParam.page,pageSize:paginationParam.pageSize,total:total}}
           size="small">
          </Table>
        </div>
        <Modal maskClosable={false} destroyOnClose={true}
          visible={showCrawCreateModal}
          title="创建任务"
          onOk={this.handleCreateCraw.bind(this)}
          onCancel={()=>this.setState({showCrawCreateModal:false})}
          destroyOnClose={true}>
            <Form>
              <FormItem
                {...formLayout}
                label="任务名称">
                {
                  getFieldDecorator('taskName',{
                    rules: [
                      {required: true,message: '任务名称不可为空'},
                      {validator: this.validNameInput}
                    ]
                  })(
                    <Input placeholder="不超过40个字符"/>
                  )
                }
              </FormItem>
            </Form>
        </Modal>
      </div>
    )
    
  }
}
TaskManage = Form.create()(TaskManage)