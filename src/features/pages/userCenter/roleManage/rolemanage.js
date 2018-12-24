import React, {Component} from 'react';
import {Table,Button,Modal,Tree,Form,Input,message} from 'antd';
import ajax from '../../../../api/usercenter'

const TreeNode = Tree.TreeNode;
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

export default class RoleManage extends Component{
  constructor(props){
    super(props);
    this.state = {
      tableLoading: false,
      dataList: [],
      showDetailModal: false,
      paginationParams: {
        page: 1,
        pageSize: 15,
      },
      total: 0,

      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      edittingId: -1,
      roleDetail:{},
      edittinngName: '',
    }
  }

  componentDidMount(){
    this.getPermissionTree();
    this.getDataList();
  }

  getPermissionTree(){
    ajax.getPermissions().then(res=>{
      if(res.result){
        this.setState({
          treeData: res.data instanceof Array?res.data:[]
        })
      }else{
        message.error(res.result_message)
      }
    })
  }
  onExpand = (expandedKeys)=>{
    this.setState({
      expandedKeys
    })
  }
  onSelect = (selectedKeys, info)=>{
    this.setState({
      selectedKeys
    })
  }
  onCheck = (checkedKeys)=>{
    const {form} = this.props;
    form.setFieldsValue({
      permission_ids: checkedKeys
    });
    this.setState({
      checkedKeys
    })
  }
  handleEditClick = (name,id)=>{
    this.setState({
      edittinngName: name,
      edittingId: id,
      showDetailModal: true,

    },()=>{
      this.getRoleDetail();
    })
  }
  getRoleDetail(){
    ajax.getRoleDetail(this.state.edittingId).then(res=>{
      if(res.result){
        this.setState({
          checkedKeys: res.data.permissions,
        },()=>{
        })
      }else{
        message.error(res.data.result_message)
      }
    })
  }
  getDataList(){
    const params = {
      page: this.state.paginationParams.page,
      size: this.state.paginationParams.pageSize,
    }
    ajax.getRoleList(params).then(res=>{
      if(res.result){
        this.setState({
          dataList: res.data instanceof Array?res.data:[]
        })
      }else{
        message.error(res.result_message)
      }
    })
  }
  handleTableChange = (pagination,filets,sorter)=>{
    this.state.paginationParams.page = pagination.current;
    this.getDataList();
  }
  length_20 = (rules,value,callback)=>{
    if(!value)
      callback();
    if(!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/g.test(value)){
      callback('角色名称仅支持英文、数字以及中文')
    }
    if(value && value.length>20){
      callback('角色名称不能超过20个字符')
    }else{
      callback();
    }
  }

  
  showDetailModal = ()=>{
    this.setState({
      showDetailModal: true,
      edittingId: -1,
      checkedKeys:[]
    })
  }

  //渲染树
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.permission_name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  processPermission = (list,p)=>{
    list.map((o,index)=>{
      if(p.indexOf(o.id.toString()) !== -1){
        o.checked = true;
      }else{
        o.checked = false;
      }
      if(o.children.length > 0){
        this.processPermission(o.children,p)
      }
    })
  }

  addNewRole = ()=>{
    const {form} = this.props;
    form.validateFields((err,value)=>{

      this.processPermission(this.state.treeData,value.permission_ids);
      if(!err){
        if(this.state.edittingId === -1){
          const param = {
            role_name: value.newRoleName,
            permission_ids: value.permission_ids,
            permission_tree: this.state.treeData,
          }
          ajax.createRole(param).then(res=>{
            if(res.result){
              message.success('创建成功')
              this.state.paginationParams.page = 1;
              this.getDataList();
              this.setState({
                showDetailModal: false
              })
            }else{
              message.error(res.result_message)
            }
          })
        }else{
          const param = {
            permission_ids: value.permission_ids,
          }
          ajax.updateRoleInfo(param,this.state.edittingId).then(res=>{
            if(res.result){
              message.success('修改成功')
              this.state.paginationParams.page = 1;
              this.getDataList();
              this.setState({
                showDetailModal: false
              })
            }else{
              message.error(res.result_message)
            }
            this.state.editt = -1;
          })
        }
      }
    })
  }
  render(){
    const {tableLoading,total,dataList,showDetailModal,paginationParams,expandedKeys,autoExpandParent,checkedKeys,selectedKeys,treeData} = this.state;
    const {getFieldDecorator} = this.props.form;
    const tableCol = [
      {
        title: '角色名称',
        key: 'role_name',
        dataIndex: 'role_name',
        width: '15%'
      },{
        title: '权限分配',
        key: 'permission',
        dataIndex: 'permission',
        width: '75%',
        render: (text,record)=>(
          text.toString()
        )
      },{
        title: '操作',
        key: 'action',
        render: (Text,record)=>(
          <a href="javascript:;" onClick={()=>this.handleEditClick(record.role_name,record.id)}>编辑</a>
        )
      }
    ];
    
    return(
      <div className="rolemanage-container" >
        <div className="top-box">
          <Button type="primary" onClick={this.showDetailModal}>新增角色</Button>
        </div>
        <div className="table-box">
          <Table
            loading={tableLoading}
            columns={tableCol}
            onChange={this.handleTableChange}
            pagination={{current: paginationParams.page,pageSize: paginationParams.pageSize,total:total}}
            dataSource={dataList}
            size="small"
            rowKey="id"
            bordered>
          </Table>
        </div>
        <Modal maskClosable={false} destroyOnClose={true}
          visible={showDetailModal}
          title="新增角色"
          onOk={this.addNewRole}
          onCancel={()=>this.setState({showDetailModal:false})}
          destroyOnClose={true}>
          <Form>
            <FormItem
              {...formLayout}
              label="角色名称">
              {
                getFieldDecorator('newRoleName',{
                  rules: [
                    {required: true,message: '角色名称不能为空'},
                    {validator: this.length_20},
                  ],
                  initialValue: this.state.edittingId===-1?undefined:this.state.edittinngName
                })(
                  <Input disabled={this.state.edittingId!==-1} placeholder="不能超过20个字符"/>
                )
              }
            </FormItem>

            <FormItem
              {...formLayout}
              label="权限分配">
              {
                getFieldDecorator('permission_ids',{
                  rules: [
                    {required: true, message: '角色权限不能为空'}
                  ],
                  initialValue: this.state.edittingId !== -1?checkedKeys:undefined
                })(
                  <Tree
                  selectable={false}
                  checkable
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={this.onCheck}
                  checkedKeys={checkedKeys}
                  onSelect={this.onSelect}>
                     {this.renderTreeNodes(treeData)}
                  </Tree>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
RoleManage = Form.create()(RoleManage)