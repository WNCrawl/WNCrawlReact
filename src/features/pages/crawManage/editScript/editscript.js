import React, {Component} from 'react';
import {Button,Select,Tabs,Form,Tree} from 'antd';
import {hashHistory} from 'react-router';
import {connect} from 'react-redux';
import * as monaco from 'monaco-editor';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;


self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.bundle.js';
		}
		if (label === 'css') {
			return './css.worker.bundle.js';
		}
		if (label === 'html') {
			return './html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js';
		}
		return './editor.worker.bundle.js';
	}
}

const mapState = state => ({
  newCrawInfo: state.newcraw.newCrawInfo
});
const mapDispatch = dispatch => ({
  
})
@connect(mapState,mapDispatch)
export default class EditScript extends Component{
  constructor(props){
    super(props)
    this.state={
      taskName: '',
      taskId: -1,
      crawLog: '',
      crawResult: '',
      proxyIpList: [],
      accountList: [],
      rightPanelHeight: 0,
      fileTree: [],
      monacoEditor: Object,
    }
  }

  componentDidMount(){
    this.state.taskId = this.props.params.taskId || -1;
    console.log('!!!!!!!!!!!!!!===')
    console.log(this.props.newCrawInfo)
    if(this.state.taskId === -1){
      hashHistory.push('/crawmanage/createcrawindex')
    }

    this.state.monacoEditor = monaco.editor.create(document.getElementById('editor'),{
      value: "print 'h'",
      language: "python",

      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: "vs-dark",
    })

    this.setState({
      rightPanelHeight: document.getElementById('editor').offsetHeight + 48,
      fileTree: [
        {
          title: 'src',
          key: '0',
          children: [
            {
              title: 'components',
              key: '0_0',
              children: [
                {
                  title: 'pages',
                  key: '0_0_0',
                  children: []
                },
                {
                  title: 'a',
                  key: '0_0_1',
                  children: []
                },
                {
                  title: 'b',
                  key: '0_0_2',
                  children: []
                }
              ]
            },{
              title: 'index.js',
              key: '0_1',
              children: [],
            },{
              title: 'assets',
              key: '0_2',
              children: [
                {
                  title: 'img',
                  key: '0_2_0',
                  children: []
                },
                {
                  title: 'fonts',
                  key: '0_2_1',
                  children: [],
                }
              ]
            }
          ]
        },
        {
          title: 'dist',
          key: '1',
          children: [
            {
              title: 'index.js',
              key: '1-0',
              children:[]
            },{
              title: 'app.bundle.js',
              key: '1-1',
              children: [],
            },{
              title: 'banner.jpg',
              key: '1-2',
              children: []
            }
          ]
        }
      ]
    })
  }

  componentWillReceiveProps(nextProp){
  }
  saveAndExit = ()=>{
    // cosnoel.log('保存退出')
    const {monacoEditor} = this.state;
    console.log(monacoEditor.getValue())
  }

  lastStep = ()=>{
    console.log('上一步')
    hashHistory.push('basesetting/' + this.taskId);
  }

  submit = ()=>{
    console.log('发布')
    const {monacoEditor} = this.state;
    monacoEditor.setValue('print "Hello,world"')
  }
  saveScript = ()=>{
    //保存文本
  }
  formatScript = ()=>{
    //格式化文本（？）
  }
  cleanResult = ()=>{
    this.setState({
      crawResult: ''
    })
  }
  //运行脚本
  runScript = ()=>{
    const {form} = this.props;
    form.validateFirlds((err,values)=>{
      if(!err){
        console.log(values)
      }
    })
  }

  onSelect = (val)=>{
    console.log(val)
  }

  onExpand = (val)=>{
    cosnoel.log(val)
  }
  renderTreeNodes=(data)=>{
    if(!(data instanceof Array)) return;
    return data.map((item)=>{
      if(item.children.length>0){
        return (
          <TreeNode key={item.key} title={item.title}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }else{
        console.log('render leaf node')
        return <TreeNode key={item.key} title={item.title} isLeaf={true}/>
      }
    })
  }

  render(){
    const {taskName,crawLog,crawResult,proxyIpList,accountList,rightPanelHeight,fileTree} = this.state;
    const {getFieldDecorator} = this.props.form;
    console.log('=====================');
    console.log(fileTree)

    console.log('&&&&&^^^^^^')
    const {newCrawInfo} = this.props;
    console.log(newCrawInfo)
    return(
      <div className="editscript-container">
        <div className="func-box">
          <span>
            {taskName}
          </span>
          <span>
            <Button className="btn" onClick={this.saveAndExit}>
              保存并退出
            </Button>
            <Button className="btn" onClick={this.lastStep}>
              上一步
            </Button>
            <Button type="primary" className="btn" onClick={this.submit}>
              发布
            </Button>
          </span>
        </div>
        <div className="editor-box">
          <div className="left-panel">
            <div className="left-func-box">
              <a className="btn" onClick={this.saveScript}>保存</a>
              <a className="btn" onClick={this.formatScript}>格式化</a>
            </div>
            <div className="py-code">
              <div className="tree">
              <DirectoryTree
                multiple
                defaultExpandAll
                onSelect={this.onSelect}
                onExpand={this.onExpand}
              >
               {this.renderTreeNodes(fileTree)}
              </DirectoryTree>
              </div>
              <div id="editor"></div>
            </div>
          </div>
          <div className="right-panel" style={{height: rightPanelHeight}}>
            <div className="tab-box">
            <Tabs defaultActiveKey="1" onChange={()=>console.log(0)}>
              <TabPane tab="爬取日志" key="1">{crawLog}</TabPane>
              <TabPane tab="爬取结果" key="2">{crawResult}</TabPane>
            </Tabs>
            </div>
            <div className="form-box">
              <div className="top-func">
                <div>
                <Form layout="inline">
                  <FormItem>
                    {
                      getFieldDecorator('proxyIp',{})(
                        <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} style={{width: 120}} placeholder="不使用代理IP">
                          {
                            proxyIpList.map(o=>{
                              <Option key={o.value}>{o.name}</Option>
                            })
                          }
                        </Select>
                      )
                    }
                  </FormItem>
                  <FormItem>
                    {
                      getFieldDecorator('account',{})(
                        <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} style={{width: 120}} placeholder="选择登录账号">
                          {
                            accountList.map(o=>{
                              <Option key={o.value}>{o.name}</Option>
                            })
                          }
                        </Select>
                      )
                    }
                  </FormItem>
                </Form>
                </div>
                <a href="javascript:;" onClick={this.cleanResult}>清空测试结果</a>
              </div>
              <Button type="primary" onClick={this.runScript}>开始测试</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
EditScript = Form.create()(EditScript)