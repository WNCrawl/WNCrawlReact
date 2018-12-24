import React, {Component} from 'react';
import {Form,Modal,message,
  Icon,Button,Input,Select,
  Tooltip,Steps,Tree,Tabs,Table,
  Dropdown,Menu } from 'antd';
import {hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {crawDetailAction} from '../../../actions/crawManage';
import ajax from '../../../../api/crawmanage';
import SplitPane from 'react-split-pane';

import * as monaco from 'monaco-editor';



const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;
const Step = Steps.Step;
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;


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

const mapState = state => ({
  currentTaskDetail: state.buildcrawtask.currentTaskDetail,//创建或者更新task之后返回的任务详情
  showProjectModal: state.buildcrawtask.showProjectModal,//是否展示创建任务窗口
})

const mapDispatch = dispatch => ({
  createProject(params){
    dispatch(crawDetailAction.createProject(params))
  },
  getProjectFileTree(params){
    dispatch(crawDetailAction.getProjectFileTree(params))
  }
})

@connect(mapState,mapDispatch)
export default class ProjectEditor extends Component{
  constructor(props){
    super(props);
    this.state = {
      monacoEditor: Object,
      keyFlag: 0,//为文件树的每个item添加key
      fileTree: [],//目录树
      renderEditorFlag:false,//渲染editor标识，防止二次渲染
      showBuildModal: false,
      defaultSelectFile: [],//默认选择的文件（编辑）
      showAddFileModal: false,//添加文件modal
      blockOnSelect: false,//选择
    }
  }

  handleCreateProject = ()=>{
    const {form,currentTaskDetail} = this.props;
    form.validateFields([
      'name',
      'description'
    ],(err,values)=>{
      if(err) return;
      values.task_id = currentTaskDetail.id;
      this.props.createProject(values);
    })
  }

  componentDidMount(){
    //新任务过来弹出创建任务窗口的操作在reducer里完成
    //新任务调用saveCrawTask action进行保存任务信息，然后直接设置showProjectModal为true
    // if(this.props.id === -1){
    //   //新任务，弹出任务创建框框
    //   this.setState({·
    //     showProjectModal: true,
    //   })
    // }
  }

  componentWillReceiveProps(nextProps){
    //检测接受props更新，如果文件树有值了就处理然后渲染
    if(nextProps.fileTreeData && nextProps.fileTreeData.length>0){
      //处理树并渲染编辑器
      this.state.fileTree = nextProps.fileTreeData;
      // this.processTree();
      this.renderEditor();
    }
  }


  //文件树处理完成后渲染editor
  renderEditor(){
    if(this.state.renderEditorFlag) return;
    this.state.monacoEditor = monaco.editor.create(document.getElementById('editor'),{
      value: "",
      language: "python",

      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: "vs",
      automaticLayout: true,
      formatOnType: true,
    });
    this.state.renderEditorFlag = true;

  }

  //save file content
  saveScript = ()=>{
    
  }

  //format file content
  formatScript = ()=>{

  }

  //目录选择事件
  onSelect = ()=>{

  }

  //目录展开事件
  onExpand = ()=>{
    
  }

  //编辑文件名
  handleFileRightClickEdit = (label,path)=>{
    this.setState({
      showRenameModal: true,
      renameLabel: label,
      renamePath: path
    })
  }

  //清除日志与结果
  cleanResult = ()=>{
    this.setState({
      scriptLogContent: '',
      scriptResultContent: '',
    })
  }

  //删除文件
  handleFileRightClickDel = (label,path)=>{
    this.state.blockOnSelect = true;
    const params = {
      path: path,
      label: label
    }
    ajax.delFile(params).then(res=>{
      if(res.result){
        message.success('删除成功');
        // this.initFileTree();
        this.reloadFileTree();
      }else{
        message.error(res.result_message)
      }
    })
  }

  reloadFileTree = ()=>{
    this.props.getProjectFileTree({
        project_name:this.props.currentTaskDetail.project_name,
        project_id: this.props.currentTaskDetail.project_id
    });
  }



  //切换tab
  handleTabChange = (k)=>{
    if(k.toString()==='2' && this.state.canGetRe){
      // clearInterval(this.state.interval);
      this.setState({
        pauseGetLog: true
      })
      const param = {
        project_name: this.state.newTaskDetail.project_name,
        spider_name: this.state.openingFileSpiderName,
      }
      ajax.getScriptResult(param).then(res=>{
        if(res.result){
          this.setState({
            scriptResultContent: res.data.content
          })
        }else{
          message.error(res.result_message)
        }
      })
    }else{
      this.setState({
        pauseGetLog: false
      })
    }
  }


  renderTreeNodes=(data)=>{
    if(!(data instanceof Array)) return;
    return data.map((item)=>{
      if(item.children && item.children.length>0){
        return (
          <TreeNode dataIsDic={true} dataPath={item.path} dataLabel={item.label}  key={item.key} title={

          <Dropdown overlay={
            <Menu>
              <Menu.Item key={item.key} onClick={()=>this.setState({showAddFileModal:true,addingPath: item.path})}><Icon type="file-add" />添加文件</Menu.Item>
            </Menu>
          } trigger={['contextMenu']}>
          <span style={{ userSelect: 'none' }}>{item.label}</span>
          </Dropdown>
          }>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }else{
        return (
        <TreeNode dataPath={item.path} dataLabel={item.label} key={item.key} title={
          <Dropdown overlay={
            <Menu>
              <Menu.Item key={item.key} onClick={()=>this.handleFileRightClickEdit(item.label,item.path)}><Icon type="edit" />重命名</Menu.Item>
              <Menu.Item key={item.key} onClick={()=>this.handleFileRightClickDel(item.label,item.path)}><Icon type="delete" />删除</Menu.Item>
            </Menu>
          } trigger={['contextMenu']}>
          <span style={{ userSelect: 'none' }}>{item.label}</span>
          </Dropdown>
        } isLeaf={true}/>
        )

      }
    })
  }



  render(){
    const {
      showProjectModal,
      fileTreeData
    } = this.props;
    const {
      getFieldDecorator
    } = this.props.form;

    return(

    <div className="project-editor-container editscript-container">
            <div className="func-box">
              <a className="btn" onClick={this.saveScript}><Icon type="save" />&nbsp;保存</a>
              <a className="btn" onClick={this.formatScript}><Icon type="retweet" />&nbsp;格式化</a>
              <a className="btn" onClick={()=>this.setState({showBuildModal: true})}><Icon type="code-o" />&nbsp;编译工程</a>
              { this.state.openingFileIsSpider && <a className="btn" onClick={this.setScriptArg}><Icon type="code-o" />&nbsp;运行参数编辑</a>}
            </div>
        <div className="editor-box">
            <SplitPane split="vertical" defaultSize="16%">
              <div className="tree-box">
              {
              fileTreeData && <DirectoryTree
                defaultExpandAll={true}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                defaultSelectedKeys={defaultSelectFile}
              >
               {this.renderTreeNodes(fileTreeData)}
              </DirectoryTree>}
              </div>
              <SplitPane className="right-panel" split="vertical" defaultSize={this.state.openingFileIsSpider?"70%":"98%"}>
              <div className="py-code">
                <div id="editor"></div>
              </div>
              { this.state.openingFileIsSpider &&
              <div className="config-box" style={{width: '100%'}}>
                <div className="tab-box" style={{flex: 7,height: '69%',overflow: 'scroll'}}>
                  <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                    <TabPane tab="爬取日志" key="1"><pre>{this.state.scriptLogContent}</pre></TabPane>
                    <TabPane tab="爬取结果" key="2"><pre>{this.state.scriptResultContent}</pre></TabPane>
                  </Tabs>
                </div>
                <div className="form-box">
                  <a href="javascript:;" onClick={this.cleanResult}>清空测试结果</a>
                  <Button type="primary" onClick={this.runScript}>开始测试</Button>
                </div>
              </div>
              }
              </SplitPane>
            </SplitPane>
        </div>

      <Modal
        maskClosable={false}
        destroyOnClose={true}
        visible={showProjectModal}
        onOk={this.handleCreateProject}
        title="爬虫工程信息"
        >
          <Form>
            <FormItem
            {...formLayout}
            label="项目名称">
            {
              getFieldDecorator('name',{
                rules: [
                  {required: true, message:'项目名称不能为空'}
                ]
              })(
                <Input/>
              )
            }
            </FormItem>
            <FormItem
            {...formLayout}
            label="项目描述">
            {
              getFieldDecorator('description')(
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
ProjectEditor = Form.create()(ProjectEditor)