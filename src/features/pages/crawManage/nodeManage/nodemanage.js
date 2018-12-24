import React, {Component} from 'react';
import {Table,Button,Input,Select, Modal,Form,Divider,message,Popover} from 'antd';
import ajax from '../../../../api/crawmanage';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const confirm = Modal.confirm;
const Search = Input.Search;

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    },
    wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    },
}

const formLayout_inline = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    },
    wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    },
}


export default class NodeManage extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataList: [],
      paginationParams: {
        page: 1,
        pageSize: 15
      },
      total: 0,
      showModal: false,
      edittingId: -1,
      nodeDetail: {},
      search_type:'node_id',
      keyword:''
    }
  }


  handleTableChange = (pagination,filters,sorter)=>{
    // this.state.filter.status = filters.status;
    // this.state.filter.ip_type = filters.ip_type;
    this.state.paginationParams.page = pagination.current;
    this.getTableData();
    // this.getDataList();
  }


  getDataList(){
    const param = {
      size: this.state.paginationParams.pageSize,
      page: this.state.paginationParams.page,
      // keyword: this.state.filter.keyword,
      // status: this.state.filter.status,
      // type: this.state.filter.type,
    }
    param[this.state.search_type] = this.state.keyword;
    ajax.getNodeList(param).then(res=>{
      if(res.result){
        this.setState({
          dataList: res.data.results,
          total:res.data.total_elements
        })
      }else{
        message.error(res.result_message)
      }
    })
  }

  handleSearch = (e)=>{
    this.state.keyword = e;
    this.getDataList();
  }

  componentDidMount(){
    // this.getDataList();
    this.getTableData();
  }
  addNewNode = ()=>{
    this.setState({
      showModal: true
    })
  }

  motifyNode = ()=>{
      //新增
      const {form} = this.props;
      form.validateFields((err,value)=>{
        if(!err){
          const params = value;
          if(this.state.edittingId === -1){
            ajax.createNode(params).then(res=>{
              if(res.result){
                message.success('添加成功');
                this.state.paginationParams.page = 1;
                this.getDataList();
                this.setState({
                  showModal: false
                })
              }else{
                message.error(res.result_message);
              }
            })
          }else{
            ajax.motifyNode(params,this.state.edittingId).then(res=>{
              if(res.result){
                message.success('修改成功');
                this.state.paginationParams.page = 1;
                this.getDataList();
                this.setState({
                  showModal: false
                })
              }else{
                message.error(res.result_message);
              }
            })
          }
        }
      })
  }

  handDelNode = (id)=>{
    ajax.delNode(id).then(res=>{
      if(res.result){
        message.success('删除成功');
        this.state.paginationParams.page = 1;
        this.getDataList();
      }else{
        message.error(res.result_message)
      }
    })
  }
  handleEdit = (id)=>{
    this.state.edittingId = id;
    ajax.queryNode(id).then(res=>{
      if(res.result){
        this.setState({
          nodeDetail: rees.data,
          showModal: true
        })
      }else{
        message.error(res.result_message)
      }
    })
  }

  getTableData = ()=>{
    const param = {
      size: this.state.paginationParams.pageSize,
      page: this.state.paginationParams.page,
    }
    param[this.state.search_type] = this.state.keyword;
    ajax.getAllNode(param).then(res=>{
      if(res.result){
        this.setState({
          dataList: res.data.results,
          total:res.data.total_elements
        },()=>{
          if(res.data.results.length>0)
            this.getTableDataPartTwo(0);
        })
      }else{
        message.error(res.result_message)
      }
    })
  }

  getTableDataPartTwo=(index)=>{
    const {dataList} = this.state;
    if(!dataList[index]) return;
    const param = {
      node_ip: dataList[index].node_ip,
      node_port: dataList[index].node_port
    }
    ajax.getNodePartTwo(param).then(res=>{
      if(res.result){
        dataList[index] = {
          ...dataList[index],
          ...res.data
        }
        this.setState({
          dataList
        },()=>{
          if(index < dataList.length){
            this.getTableDataPartTwo(index+1)
          }
        })
      }
    })
  }

  render(){
    const {paginationParams,total} = this.state;
    const {getFieldDecorator} = this.props.form;
    const tbaleCol = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id'
      },{
        title: '名字',
        dataIndex:'node_name',
        key: 'node_name'
      },{
        title: 'ip',
        dataIndex: 'node_ip',
        key: 'node_ip'
      },{
        title: '端口',
        dataIndex: 'node_port',
        key: 'node_port'
      },{
        title: '节点状态',
        dataIndex: 'status',
        key: 'status'
      },{
        title: '工程数量',
        dataIndex: 'projects_count',
        key: 'projects_count',
        render: (text,record)=>(
          <Popover title="脚本列表" content={
            <div>
              {
                record.projects && record.projects.map(o=>(
                  <p>{o}</p>
                ))
              }
            </div>
          }>
            <span style={{display: 'block',cursor: 'pointer'}}>{text}</span>
          </Popover>
        )
      },{
        title: '脚本数量',
        dataIndex: 'spiders_count',
        key: 'spiders_count',
      },{
        title: '待运行',
        dataIndex: 'pending',
        key: 'pending'
      },{
        title: '已完成',
        dataIndex: 'finished',
        key: 'finished'
      },{
        title: '运行中',
        dataIndex: 'running',
        key: 'running'
      },{
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text,record)=>(
          <span>
            <a href="javascript:;" onClick={()=>this.handleEdit(record.id)}>编辑</a>
            <Divider type="vertical"/>
            <a href="javascript:;" onClick={()=>this.handDelNode(record.id)}>删除</a>
          </span>
        )
      }
    ]

    return (
      <div className="node-manage-container">
        <div className="func-box" style={{marginBottom: 20}}>
        <InputGroup compact>
            <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} defaultValue={this.state.search_type} onChange={(e)=>this.state.search_type=e}>
              <Option value="node_id">节点ID</Option>
              <Option value="node_name">节点名称</Option>
              <Option value="node_ip">节点IP</Option>
              <Option value="node_port">节点端口</Option>
            </Select>
            <Search style={{width: 200}} onSearch={this.handleSearch}/>
          </InputGroup>
          <Button onClick={this.addNewNode} type="primary">添加</Button>
        </div>
        <div className="table-box">
          <Table
          size="small"
          bordered
          rowKey="id"
          columns={tbaleCol}
          dataSource={this.state.dataList}
          pagination={{current: paginationParams.page, pageSize:paginationParams.pageSize,total:this.state.total}}
          onChange={this.handleTableChange}>

          </Table>
        </div>
        <Modal 

        afterClose={()=>{this.state.edittingId = -1}}
        destroyOnClose={true}
        maskClosable={false}
         visible={this.state.showModal}
         onOk={this.motifyNode}
         onCancel={()=>this.setState({showModal: false})}
         title={this.state.edittingId===-1?'添加节点':'修改节点'}>
          <Form>
            <FormItem
            {...formLayout}
            label="节点名称">
              {
                getFieldDecorator('node_name',{
                  rules: [
                    {required: true, message: '节点名称不能为空'}
                  ],
                  initialvalue: this.state.edittingId === -1?undefined:nodeDetail.node_name,
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem
            {...formLayout}
            label="节点ip">
              {
                getFieldDecorator('node_ip',{
                  rules: [
                    {required: true, message: '节点ip不能为空'}
                  ],
                  initialvalue: this.state.edittingId === -1?undefined:nodeDetail.node_ip,
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem
            {...formLayout}
            label="节点端口">
              {
                getFieldDecorator('node_port',{
                  rules: [
                    {required: true, message: '节点端口不能为空'}
                  ],
                  initialvalue: this.state.edittingId === -1?undefined:nodeDetail.node_port,
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem 
            {...formLayout}
            label="描述">
              {
                getFieldDecorator('node_description',{
                  initialvalue: this.state.edittingId === -1?undefined:nodeDetail.node_description
                })(
                  <Input/>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
NodeManage = Form.create()(NodeManage)