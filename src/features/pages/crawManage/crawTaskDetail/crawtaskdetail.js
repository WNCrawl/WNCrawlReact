import React, {Component} from 'react';
import {Form,Modal,message,
  Icon,Button,Input,Select,
  Tooltip,Steps,Tree,Tabs,Table,
  Dropdown,Menu, InputNumber,DatePicker, Checkbox} from 'antd';
import {hashHistory} from 'react-router';
import moment from 'moment';
import {connect} from 'react-redux';
import {addNewCrawAction} from '../../../actions/crawManage'
import ajax from '../../../../api/crawmanage'
import SplitPane from 'react-split-pane'


import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands.js';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution.js';

// import * as monaco from 'monaco-editor';

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



const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;
const Step = Steps.Step;
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;


const URL = window.location.href.split('#')[0];

let wsParam = {};
 
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
  newCrawInfo: state.newcraw.newCrawInfo,
  openingScriptInfo: state.newcraw.openingScriptInfo,
});

const mapDispatch = dispatch => ({
  saveNewCrawInfo(params){
    dispatch(addNewCrawAction.saveNewCrawInfo(params))
  }
})
@connect(mapState,mapDispatch)
export default class CrawTaskDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      taskDetail: {
        taskName: '',
        taskId: -1,//任务编辑按钮跳转过来的id
        createTime: '',
        taskId: '',
        creator: ''
      },
      steps: [
        '基本属性',
        '编辑脚本',
        // '数据导出'
      ],
      crawWays: [],
      hosts: [],
      dataSources: [],
      currentStep: 0,
      taskName: '',
      crawLog: '',
      crawResult: '',
      proxyIpList: [],
      accountList: [],
      rightPanelHeight: 0,
      fileTree: [],
      monacoEditor: Object,
      renderEditorFlag: false,
      id:-1,
      mode: 1,//从哪里跳转过来的id，1-普通，2-脚本编辑按钮
      defaultSelectFile: [],
      defaultExpandedKeys: ['1','2'],
      dataSourceList: [],
      showProjectModal: false,
      newTaskDetail: {},
      rightClickNodeTreeItem: {},
      processedTreeData: [],
      processTreeFlag: 0,
      showRenameModal: false,
      renameLabel: '',
      renamePath:'',

      openingLabel: '',
      openingPath:'',
      platformList: [],

      expandLabel: '',
      expandPath: '',
      blockOnSelect: false,

      newProjectDetail: {},
      hostList: [],
      scriptArgs: '',
      showArgEditModal: false,

      openingFileScriptName: '',
      openingFileIsSpider: false,
      openingFileSpiderName: '',

      buildDesc:'',
      showAddFileModal: false,
      addingPath: '',
      showBuildModal: false,

      fileDetail: {
        trigger: '',
        args: '',
        hosts: '',
        use_proxy:0,
      },

      scriptId: -1,
      editFlag: false,

      keyFlag: 0,
      interval: Object,
      readLine: 0,

      scriptLogContent: '',
      scriptResultContent: '',

      canGetRe: false,

      scriptParamsList: [],
      confirmLoading: false,

      pauseGetLog: false,

      showRightPanel: false,
    }

  }

  handleAddNewLine = ()=>{
    let d = moment().subtract(1,'days').format('YYYY-MM-DD')
    this.state.scriptParamsList[this.state.scriptParamsList.length] = {
      args: {start_date:d,end_date:d},
      
      dynamic_value: '',
      trigger:{
        day_of_week: '*',
        month: '*',
        hour: '*',
        minute: '*',
        day: '*',
      },
      fix_type: 0,
      fix_date: '',
      index: this.state.scriptParamsList.length,

    }
    this.setState({
      scriptParamsList: this.state.scriptParamsList
    })
  }
  handleAddFile = ()=>{
    const {form} = this.props;
    form.validateFields(['new_file_name'],(err,value)=>{
      if(!err){
        const params = {
          name: value.new_file_name,
          path: this.state.addingPath
        }
        ajax.addNewFile(params).then(res=>{
          if(res.result){
            message.success('添加成功');
            this.setState({
              showAddFileModal: false
            })
            this.initFileTree();
          }else{
            message.error(res.result_message)
          }
        })
      }
    })
  }
  handleArgEdit = (val)=>{
    this.state.scriptArgs = val.target.value;
  }

  componentDidMount(){
    this.state.id = this.props.params.id;
    this.state.mode = this.props.params.mode;
    this.getPlatformList();
    this.getHost();
    // this.openSocket();
    this.props.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave
    )
    this.setState({
      currentStep: this.props.params.mode-1,
    },()=>{
      console.log(this.state.scriptLogContent)
    })
    if(this.state.mode === '2'){
      // this.setState({
      //   scriptId: this.state.id
      // })
      this.state.scriptId = this.state.id;
    }else{
      this.state.taskDetail.id = this.state.id;
    }

    if(this.state.id && this.state.id!==-1 && this.state.mode !== '2'){
      ajax.getTakeDetail(this.state.id).then(res=>{
        if(res.result){
          this.setState({
            taskDetail: res.data,
          })
        }else{
          message.error(res.result_message)
        }
      })
    }

    //从‘爬虫脚本’页面跳转过来
    if(this.state.mode === '2'){
      console.log(this.props)
      console.log(this.props.openingScriptInfo)
      console.log(this.state.scriptId)
      // if(!this.props.openingScriptInfo.path){
      //   this.props.open
      // }
      this.getTaskInfo();
    }


    // console.log(this.state.taskDetail.id + '   ' + this.state.mode)
  }

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
          console.log(res)
          this.setState({
            scriptResultContent: res.data.content
          })
          // let flag_result = res.data.content;
          // for(let i=0;i<flag_result.length;i+=2000){
          //   let j = i;
          //   let self = this;
          //   setTimeout(function a(){
          //     console.log(j);
          //     let g = flag_result.slice(j,j+2000);
          //     // console.log(g)
          //     // console.log(flag_result)
          //     self.setState({
          //       scriptResultContent: self.state.scriptResultContent+g
          //     })
          //   },j/10)
          // }
          console.log(this.state.scriptResultContent)
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
  setSelectedKey(data,id){
    console.log('popp')
    return data.map((item,index)=>{
      if(item.children.length>0){
        this.setSelectedKey(item.children,id);
      }else{
        console.log(item.key + '   ' + item.id + '  ' + id)
        if(item.id && id === item.id.toString()){
          console.log(item.key)
          this.setState({
            defaultSelectFile: [item.key]
          }) 
        }
      }
    })
  }

  handleRenameSubmit = ()=>{
    const {form} = this.props;
    form.validateFields(['newFileName'],(err,value)=>{
      if(!err){
        const params = {
          new: value.newFileName,
          pre: this.state.renameLabel,
          path: this.state.renamePath
        };
        ajax.renameFile(params).then(res=>{
          if(res.result){
            this.setState({
              showRenameModal: false,
            })
            this.initFileTree();
          }else{
            message.error(res.result_message)
          }
        })
      }
    })
  }

  renderEditor(){
    console.log(document.getElementById('editor'))

    if(this.state.currentStep === 1){
      if(this.state.renderEditorFlag){
        return;
      }
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
  }
  initFileTree = ()=>{
    ajax.getProjectTree(this.state.newTaskDetail.project_name).then(res=>{
      if(res.result){
        this.state.fileTree = res.data;
        this.processTree();

        this.setState({
          fileTree: this.state.fileTree,
          rightPanelHeight: document.getElementById('editor').offsetHeight + 48,
          defaultSelectFile: this.state.defaultSelectFile,
        })
        console.log(this.state.fileTree);
        console.log(this.state.defaultSelectFile)
      }else{
        message.error(res.result_message)
      }
      this.renderEditor();
    })
  }

  setOpeningFile(){
    // if(this.state.mode === '2'){
      this.setSelectedKey(this.state.fileTree,this.state.id);
  
      // console.log(defaultSelectFile)
      this.state.monacoEditor.setValue(this.getFileContent())
    // }
  }
  handleCreateProject = ()=>{
    const {form} = this.props;
    form.validateFields(['project_name','project_desc'],(err,values)=>{
      if(!err){
        // this.setState({
        //   showProjectModal: false
        // })
        // this.renderEditor();
        const params = {
          name: values.project_name,
          description: values.project_desc,
          task_id: this.state.newTaskDetail.id
        }

        ajax.createCrawProject(params).then(res=>{
          if(res.result){
            this.state.newTaskDetail.project_name = res.data.name;
            this.state.newTaskDetail.project_id = res.data.id;
            this.setState({
              showProjectModal: false,
              newProjectDetail: res.data,
              
            })
            if(!this.state.id || this.state.id === -1){
              this.initFileTree();
            }
            // this.renderEditor();
          }else{
            message.error(res.result_message)
          }
        })
      }
    })
  }


  saveAndExit = ()=>{
    // cosnoel.log('保存退出')
    const {monacoEditor} = this.state;
    const {form} = this.props;
    if(this.state.currentStep === 0){
      form.validateFields([
        'task_name',
        'description',
        'platform_id',
        'node_ids',
      ],(err,values)=>{
          if(!err){
            this.props.saveNewCrawInfo(values);
            values.task_type= 1;
            let str = values.platform_id;
            values.platform_id = str.split('&')[0]
            values.platform_name = str.split('&')[1]

            if(this.state.id && this.state.id && this.state.id !== -1){
              values.id = this.state.taskDetail.id;
              if(str.indexOf('&') === -1){
                //未改动
                console.log('未改动数据平台')
                values.platform_id = this.state.taskDetail.platform_id
                values.platform_name = this.state.taskDetail.platform_name
              }
              ajax.updateTask(values,values.id).then(res=>{
                if(res.result){
                  hashHistory.push('crawmanage/taskmanage');
                }else{
                  message.error(res.result_message)
                }
              })
            }else{
              ajax.createNewTask(values).then(res=>{
                if(res.result){
                  hashHistory.push('crawmanage/taskmanage');
                  // this.initFileTree();
                }else{
                  message.error(res.result_message)
                }
              })
            }
          }
      })
    }
    console.log(monacoEditor.getValue())
  }

  getHost = ()=>{
    ajax.getHostList({
      size: 9999,
      page: 1
    }).then(res=>{
      if(res){
        this.setState({
          hostList: res.data instanceof Array?res.data:[]
        })
      }
    })
  }
  getAccount = ()=>{
    ajax.getAccountList({
      size: 9999,
      page: 1
    }).then(res=>{
      if(res.result){
        this.setState({
          accountList: res.data
        },()=>{
          console.log(this.state.accountList)
        })
      }
    })
  }

  getTaskInfo = ()=>{
    this.state.editFlag = true;
    ajax.getTaskInfoByScriptId(this.state.scriptId).then(res=>{
      if(res.result){

        this.state.newTaskDetail = res.data;
        this.state.openingLabel = res.data.script_name;
        this.state.openingPath = this.props.openingScriptInfo.path;

        this.initFileTree();
        this.getFileContent();
      }else{
        message.error(res.result_message);
      }
    })
  }

  handleFileRightClickDel = (label,path)=>{
    //del file
    // console.log(id)
    this.state.blockOnSelect = true;
    const params = {
      path: path,
      label: label
    }
    ajax.delFile(params).then(res=>{
      if(res.result){
        message.success('删除成功');
        this.initFileTree();
      }else{
        message.error(res.result_message)
      }
    })
  }

  handleFileRightClickEdit = (label,path)=>{
    //update file name
    // console.log(id)
    this.setState({
      showRenameModal: true,
      renameLabel: label,
      renamePath: path
    })
  }

  cleanResult = ()=>{
    this.setState({
      scriptLogContent: '',
      scriptResultContent: '',
    })
  }

  processTree = ()=>{
    this.state.editFlag = true;
    this.state.fileTree.map((o,index)=>{
      this.traverseTree(o);
    })
    console.log(this.state.defaultSelectFile)
  }

  traverseTree = (node)=>{
    if(node){
      node.key = this.state.keyFlag++;
      if(node.label === this.state.openingLabel && node.path === this.state.openingPath){
        this.state.defaultSelectFile = [node.key.toString()]
      }
    }
    if(node.children && node.children.length >0){
      for(var i=1;i<=node.children.length;i++){
        this.traverseTree(node.children[i-1])
      }
    }
  }
  routerWillLeave = ()=>{
    console.log('我走了');
    clearInterval(this.state.interval)
  }

  //运行脚本
  runScript = ()=>{
    this.setState({
      pauseGetLog: false,
    })
    const {form} = this.props;
    const param = {
      project_name: this.state.newTaskDetail.project_name,
      spider_name: this.state.openingFileSpiderName,
    }
    ajax.runScript(param).then(res=>{
      if(res.result){
        message.success('运行成功')

        this.state.interval = setInterval(()=>{
          this.getScriptLog();
        },2000)
        this.state.canGetRe = true;
      }else{
        message.error(res.result_message)
      }
    })

  }
  getScriptLog = ()=>{
    if(this.state.pauseGetLog)
      return;

    const param = {
      project_name: this.state.newTaskDetail.project_name,
      spider_name: this.state.openingFileSpiderName,
      current_line: parseInt(this.state.readLine) + 1,
    }
    ajax.getScriptLogLine(param).then(res=>{
      if(res.result && res.data.length > 0){
        res.data.map(p=>{
          this.state.scriptLogContent = this.state.scriptLogContent + p.data
        })
        this.setState({
          scriptLogContent: this.state.scriptLogContent,
          readLine: res.data[res.data.length-1]?res.data[res.data.length-1].current_line:'',
        })
      }
    })
  }

  renderTreeNodes=(data)=>{
    if(!(data instanceof Array)) return;
    return data.map((item)=>{
      if(item.children && item.children.length>0){
        return (
          <TreeNode dataIsDic={true} dataPath={item.path} dataLabel={item.label}  key={item.key} title={

          <Dropdown overlay={
            <Menu>
              <Menu.Item key={item.key} onClick={()=>this.setState({showAddFileModal:true,addingPath: `${item.path}/${item.label}`})}><Icon type="file-add" />添加文件</Menu.Item>
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


  length_100 = (rules,value,callback)=>{
    if( value && value.length>100){
      callback('爬虫描述不能超过100个字符')
    }else{
      callback()
    }
  }
  length_40 = (rules,value,callback)=>{
    if(value && value.length>40){
      callback('任务名称不能超过40个字符')
    }else{
      if(/^[0-9a-zA-Z_\u4e00-\u9fa5]{1,}$/.test(value)){
        callback()
      }else if(value){
        callback('任务名称只能包含中文、英文、数字与下划线')
      }
      callback()
    }
  }

  getPlatformList = ()=>{
    ajax.getPlatformList().then(res=>{
      if(res.result){
        this.setState({
          platformList: res.data
        })
      }else{
        message.error(res.result_message)
      }
    })
  }

  handleNextStepClick = ()=>{
    const {form} = this.props;
    console.log('lplp')
    if(this.state.currentStep === 1){
      // this.setState({
      //   currentStep: this.state.currentStep +1
      // })
      hashHistory.push('crawmanage/taskmanage');

    }else if(this.state.currentStep === 0){
      console.log('POPOPO')
      form.validateFields([
        'task_name',
        'description',
        'platform_id',
        'node_ids',
        'spider_concurrency'
      ],(err,values)=>{
          if(!err){
            this.props.saveNewCrawInfo(values);
            values.task_type= 1;
            let str = values.platform_id;
            values.platform_id = str.split('&')[0]
            values.platform_name = str.split('&')[1]

            if(this.state.id && this.state.id && this.state.id !== -1){
              values.id = this.state.taskDetail.id;
              if(str.indexOf('&') === -1){
                //未改动
                console.log('未改动数据平台')
                values.platform_id = this.state.taskDetail.platform_id
                values.platform_name = this.state.taskDetail.platform_name
              }
              ajax.updateTask(values,values.id).then(res=>{
                if(res.result){
                  this.setState({
                    currentStep: this.state.currentStep +1,
                    newTaskDetail: res.data,//主要用到里面的project_name
                  },()=>{
                    this.initFileTree();
                  })
                }else{
                  message.error(res.result_message)
                }
              })
            }else{
              ajax.createNewTask(values).then(res=>{
                if(res.result){
                  this.setState({
                    currentStep: this.state.currentStep +1,
                    showProjectModal: true,
                    newTaskDetail: res.data
                  })
                  // this.initFileTree();
                }else{
                  message.error(res.result_message)
                }
              })
            }
          }
      })
    }else{
      //do save
      // this.
      hashHistory.push('crawmanage/taskmanage');
    }
  }

  saveAndExit = ()=>{
    const {form} = this.props;
    form.validateFields((err,values)=>{
      console.log(values)
      console.log(this.props.newCrawInfo)
    })
  }

  saveScript = ()=>{
    const params = {
      label: this.state.openingLabel,
      path: this.state.openingPath,
      code: this.state.monacoEditor.getValue()
    }
    ajax.updateFileContent(params).then(res=>{
      if(res.result){
        message.success('保存成功')
      }else{
        message.error(res.result_message)
      }
    })
  }
  setScriptArg = ()=>{
    let d = moment().subtract(1,'days').format('YYYY-MM-DD')

    if(this.state.scriptParamsList.length === 0){
      this.state.scriptParamsList[this.state.scriptParamsList.length] = {
          args: {start_date:d,end_date:d},
          trigger: {
            day_of_week: '*',
            month: '*',
            hour: '*',
            minute: '*',
            day: '*',
          },
          fix_type: 0,
          index: this.state.scriptParamsList.length,
      }
      this.setState({
        showArgEditModal: true,
        scriptParamsList: this.state.scriptParamsList
      })
    }else{
      this.state.scriptParamsList.map(o=>{
        if(!o.trigger){
          o.trigger={}
        }
      })
      this.setState({
        showArgEditModal: true
      })
    }
  }
  saveArgsValue = (val,index)=>{
    this.state.scriptParamsList[index].args = val.target.value
  }
  saveTriggerValue_week = (val,record)=>{
    record.trigger.day_of_week = val.target.value;
  }
  saveTriggerValue_day = (val,record)=>{
    // this.state.scriptParamsList[index].trigger = val.target.value
    record.trigger.day = val.target.value;
  }
  saveTriggerValue_month = (val,record)=>{
    // this.state.scriptParamsList[index].trigger = val.target.value
    record.trigger.month = val.target.value;
  }
  saveTriggerValue_hour = (val,record)=>{
    // this.state.scriptParamsList[index].trigger = val.target.value
    record.trigger.hour = val.target.value;
  }
  saveTriggerValue_minute = (val,record)=>{
    // this.state.scriptParamsList[index].trigger = val.target.value
    record.trigger.minute = val.target.value;
  }
  saveArgsDynamicValueInput = (val, record)=>{
    record.dynamic_value = val.target.value;
  }

  saveScriptRunConfig = ()=>{
    this.setState({
      confirmLoading: true
    })
    const {form} = this.props;
    console.log(this.state.openingFileScriptName)
    console.log(this.state.openingFileSpiderName)

    form.validateFields([
      'script.host',
      // 'script.trigger',
      // 'script.account',
      // 'script.proxyIp',
      'script.applyToAll'
    ],(err,values)=>{
      if(!err){
        const params = {
          script_name: this.state.openingFileScriptName,
          spider_name: this.state.openingFileSpiderName,
          name: this.state.newTaskDetail.task_name,
          desc: this.state.newTaskDetail.description,
          // trigger: values.script.trigger,
          hosts: values.script.host,
          // args: this.state.scriptArgs,
          type: 1,
          project_id: this.state.newTaskDetail.id,
          // use_proxy: values.script.proxyIp,
          applyToAll: values.script.applyToAll,
        }
        if(params.script_name.slice(params.script_name.length-3) === '.py')
          params.script_name = 
            params.script_name.slice(0,params.script_name.length-3)

        console.log(params)
        console.log(this.state.scriptArgs)
        params.params = [];
        console.log(this.state.scriptParamsList)
        this.state.scriptParamsList.map((o,i)=>{
          params.params.push({
            args: o.args,
            trigger: {
              // day_of_week: o.trigger.day_of_week,
              // hour: o.trigger.hour,
              // minute: o.trigger.minute,
              // day: o.trigger.day,
            },
            fix_type: o.fix_type,
            fix_date: o.fix_date,
            dynamic_value: o.dynamic_value
          });
          (o.trigger.day_of_week && o.trigger.day_of_week !== '*' )?params.params[i].trigger.day_of_week = o.trigger.day_of_week:'';
          (o.trigger.month && o.trigger.month !== '*' )?params.params[i].trigger.month = o.trigger.month:'';
          (o.trigger.hour && o.trigger.hour !== '*' )?params.params[i].trigger.hour = o.trigger.hour:'';
          (o.trigger.minute && o.trigger.minute !== '*' )?params.params[i].trigger.minute = o.trigger.minute:'';
          (o.trigger.day && o.trigger.day !== '*' )?params.params[i].trigger.day = o.trigger.day:'';

        })
        console.log(params)
        ajax.saveScriptConfig(params).then(res=>{
          if(res.result){
            message.success('保存成功');
            this.setState({
              confirmLoading: false,
              showArgEditModal: false,
            })
            this.getFileContent();
          }else{
            message.error(res.result_message)
            this.setState({
              confirmLoading: false,
            })
          }
        })
      }
    })
  }

  handleCancel = ()=>{
    hashHistory.push('/taskmanage')
  }

  //
  onSelect = (val,info)=>{
    const {form} = this.props;
    if(this.state.blockOnSelect)
      return;
    else
      this.state.blockOnSelect = false;
      
    //清空爬取日志与结果和定时器
    clearInterval(this.state.interval);
    this.setState({
      scriptLogContent: '',
      scriptResultContent: '',
    })

    console.log(val)
    console.log(info.selectedNodes[0].props.dataPath + '  ' + info.selectedNodes[0].props.dataLabel)
    if(info.selectedNodes[0].props.dataIsDic){
      this.state.expandLabel = info.selectedNodes[0].props.dataLabel;
      this.state.expandPath = info.selectedNodes[0].props.dataPath;
      form.resetFields();
      return;
    }
    this.state.openingLabel = info.selectedNodes[0].props.dataLabel;
    this.state.openingPath = info.selectedNodes[0].props.dataPath;
    
    this.getFileContent();
  }
  buildProject = ()=>{
    const params = {
      description:this.state.buildDesc
    }
    ajax.buildProject(params,this.state.newTaskDetail.project_name).then(res=>{
      if(res.result){
        message.success('编译成功')
        this.setState({
          showBuildModal: false,
        })
      }else{
        message.error(res.result_message)
      }
    })
  }
  formatScript = ()=>{
    this.state.monacoEditor.getAction('editor.action.formatDocument').run();
  }
  handleBuildDescChange = (e)=>{
    this.setState({
      buildDesc: e.target.value
    })
  }
  getFileContent = ()=>{
    const params = {
      label: this.state.openingLabel,
      path: this.state.openingPath,
      project_id: this.state.newTaskDetail.project_id,
      project_name: this.state.newTaskDetail.project_name,
    }
    // console.log(params)
    // console.log(this.state.newProjectDetail.id)
    // console.log(this.state.newProjectDetail)
    try{
      ajax.getFileContent(params).then(res=>{
        if(!res.result){
          message.error(res.result_message);
          return;
        }
        this.state.monacoEditor.setValue(res.data.content);
        // this.state.fileDetail.trigger = res.data.trigger;
        // this.state.fileDetail.args = res.data.args;
        this.state.fileDetail.use_proxy = res.data.use_proxy;
        this.state.fileDetail.hosts = res.data.hosts !== null && res.data.hosts !== ''?JSON.parse(res.data.hosts.replace(/\'/g,'"')):[];
        // console.log(res.data.params.replace(/\'/g,'"').replace(/\"{/,'{').replace(/\"}/,'}'))

        this.state.scriptParamsList = res.data.params !== null && res.data.params !== ''?JSON.parse(res.data.params.replace(/\""""/g,'""').replace(/\"{/g,'{').replace(/\}"/g,'}').replace(/\\n/g,'')):[];

        this.state.scriptParamsList.map((o,i)=>{
          // o.args = JSON.stringify(o.args);
          o.index = i
        })
        // if(this.state.scriptParamsList.length === 0){
          
        //   this.state.scriptParamsList[this.state.scriptParamsList.length] = {
        //     args: {start_date:d,end_date:d},
        //     trigger:{
        //       hour: '*',
        //       minute: '*',
        //       day: '*',
        //     },
        //     fix_type: 0,
        //     fix_date: '',
        //     index: this.state.scriptParamsList.length,

        //   }
        // }

        console.log(this.state.scriptParamsList)

        this.setState({
          openingFileIsSpider: res.data.is_spider===1,
          openingFileScriptName: res.data.name,
          openingFileSpiderName: res.data.spider_name,
          fileDetail: this.state.fileDetail,
          canGetRe: false,
          scriptParamsList: this.state.scriptParamsList
          // scriptLogContent: '',
          // scriptResultContent: '',
        },()=>{
          if(this.state.openingFileIsSpider){
            this.getAccount();
          }
          console.log(this.state.openingFileScriptName)
          console.log(this.state.openingFileSpiderName)
      
        })
      })
    }catch(error){
      console.log(error)
      message.error('读取文件失败')
    }
  }

  onExpand = (val)=>{
    console.log(val)
    
  }
  handleFileClick = (path,label)=>{
    console.log(path,label)
  }

  deployProject = ()=>{
    const params = {};
    ajax.deployProject(params,this.state.newTaskDetail.project_name).then(res=>{
      if(res.result){
        message.success('发布成功')
      }else{
        message.error(res.result_message)
      }
    })
  }
  saveTriggerValue_suppdata = (val,index)=>{
    console.log(val,index)
    this.state.scriptParamsList[index].fix_type = val
  }

  saveTriggerValue_suppdata_fix_date = (val,str,index)=>{
    console.log(val);
    console.log(str)
    this.state.scriptParamsList[index].fix_date = str;
  }
  removeArgsItem = (record)=>{
    this.state.scriptParamsList.splice(this.state.scriptParamsList.indexOf(record),1);
    this.setState({
      scriptParamsList: this.state.scriptParamsList
    })
  }
  render(){
    console.log(this.state.id)
    const {getFieldDecorator} = this.props.form;
    const {taskDetail,
      crawWays,
      hosts,
      dataSources,
      currentStep,
      steps,
      taskName,
      crawLog,
      crawResult,
      proxyIpList,
      accountList,
      hostList,
      rightPanelHeight,
      fileTree,
      defaultSelectFile,
      defaultExpandedKeys,
      dataSourceList,
      showProjectModal}
       = this.state;

    const tableCol = [
      {
        title: '参数',
        dataIndex: 'args',
        width: '40%',
        key: 'args',
        render: (text,record)=>{
          return (<span>
            <TextArea rows={5} onChange={(e)=>this.saveArgsValue(e,record.index)} defaultValue={JSON.stringify(text)} ></TextArea>
            <p style={{color: '#999', fontSize: 12, marginTop: 2, marginBottom: 2}}>任务切割动态参数:</p>
            <span className="args-box-left">
            {/* <Input onChange={(e) => this.saveArgsDynamicKeyInput(e,record)} defaultValue={record.dynamic_key} style={{width: 120, marginRight: 5}}/> */}
            <TextArea onChange={(e) => this.saveArgsDynamicValueInput(e,record)} defaultValue={record.dynamic_value}/>
            </span>
            </span>)
        }
      },{
        title: '调度周期',
        dataIndex: 'action',
        key: 'action',
        width: '25%',
        render: (text,record)=>{
          return (
            <span className="args-box">
              <span className="input-span">月：<Input placeholder="输入月数" className="args-input" onChange={(e)=>this.saveTriggerValue_month(e,record)} defaultValue={record.trigger && record.trigger.month}/></span>
              <span className="input-span">周：<Input placeholder="输入周" className="args-input" onChange={(e)=>this.saveTriggerValue_week(e,record)} defaultValue={record.trigger && record.trigger.day_of_week}/></span>
              <span className="input-span">天：<Input placeholder="输入天数" className="args-input" onChange={(e)=>this.saveTriggerValue_day(e,record)} defaultValue={record.trigger && record.trigger.day}/></span>
              <span className="input-span">时：<Input placeholder="输入小时" className="args-input-m" onChange={(e)=>this.saveTriggerValue_hour(e,record)} defaultValue={record.trigger && record.trigger.hour}/></span>
              <span className="input-span">分：<Input placeholder="输入分钟" className="args-input" onChange={(e)=>this.saveTriggerValue_minute(e,record)} defaultValue={record.trigger && record.trigger.minute}/></span>
              {/* <TimePicker style={{fontSize: 12}} placeholder="选择时间" className="args-tp"  onChange={(e,str)=>this.saveTriggerValue_time(e,str,record.index)}  defaultValue={(record.hour && record.minute)?moment(record.hour + ':' + record.minute, "HH:mm"):undefined} format={"HH:mm"} /> */}
            </span>
          )
          // return <Input onChange={(e)=>this.saveTriggerValue(e,record.index)} defaultValue={text}/>
        }
      },{
        title: '补数据设置',
        dataIndex: 'suppdata',
        key: 'suppdata',
        width: '30%',
        render: (text,record)=>(
          <span className="args-box">
            <Select  getPopupContainer={triggerNode => triggerNode.parentNode} placeholder="选择补数据粒度" style={{width: '100%',marginTop: 5}}  className="args-select" onChange={(e)=>this.saveTriggerValue_suppdata(e,record.index)} defaultValue={record.fix_type}>
                <Option key={0} value={0}>不补数据</Option>
                <Option key={1} value={1}>按天补数据</Option>
                <Option key={2} value={2}>按周补数据</Option>
                <Option key={3} value={3}>按月补数据</Option>
            </Select>
            {/* <Input style={{marginTop: 5}} onChange={(e)=>this.saveTriggerValue_suppdata_fix_date(e,record.index)} defaultValue={record.fix_date}/> */}
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{marginTop: 5}} defaultValue={record.fix_date?moment(record.fix_date,'YYYY-MM-DD HH:mm:ss'):undefined} onChange={(e,s)=>this.saveTriggerValue_suppdata_fix_date(e,s,record.index)}/>
          </span>
        )
      },{
        title: '操作',
        dataIndex: 'action',
        render: (text,record)=>(
          <a href="javascript:;" onClick={()=>this.removeArgsItem(record)}>删除</a>
        )
      }
    ]

    return (
      <div className="new-craw-task-container">
        <div className="top-panel">
          <Steps current={currentStep} size="small">
            {steps.map(item => <Step key={item} title={item} />)}
          </Steps>
          <div className="btn-box">

            {/* { currentStep !== 2 && <Button onClick={this.saveAndExit}> */}
              {/* 保存并退出
            </Button>}
            <Button href={URL + "#/crawmanage/taskmanage"}>
              取消
            </Button> */}
            <Button type="primary" onClick={this.handleNextStepClick}>
              {currentStep !== 1?'下一步':'完成'}
            </Button>
          </div>
        </div>
        <div className="form-panel">
          {
            currentStep === 0 && 
            <div style={{width: 500,margin: '0 auto'}}>
            <Form>
              {this.state.taskDetail.id && 
              <FormItem
               {...formLayout}
               label="任务ID">
               <p>{taskDetail.id}</p>
              </FormItem>}
              <FormItem
               {...formLayout}
               label="任务名称">
               {
                 getFieldDecorator('task_name',{
                   rules: [
                     {required: true, message: '任务名称不能为空'},
                     {validator: this.length_40}
                   ],
                   initialValue: this.state.id && this.state.id !== -1? taskDetail.task_name:undefined
                 })(
                  <Input disabled={this.state.taskDetail.id && this.state.taskDetail.id !== -1?true:false} value={taskDetail.taskName}/>
                 )
               }
              </FormItem>

              <FormItem
               {...formLayout}
               label="爬虫描述">
               {
                 getFieldDecorator('description',{
                   rules: [
                    //  {retuqires: true, message: '爬虫描述不可为空'},
                     {validator: this.length_100}
                   ],
                   initialValue: this.state.id && this.state.id !== -1? taskDetail.description:undefined
                 })(
                    <Input placeholder="不超过100个字符"/>
                 )
               }
              </FormItem>
              <FormItem
               {...formLayout}
               label="数据平台">
               {
                 getFieldDecorator('platform_id',{
                   rules: [
                     {required: true, message: '数据平台不可为空'},
                    //  {validator: this.length_100}
                   ],
                   initialValue: this.state.id && this.state.id !== -1? `${taskDetail.platform_id}&${taskDetail.platform_name}`:undefined
                 })(
                    <Select  getPopupContainer={triggerNode => triggerNode.parentNode}>
                      {
                        this.state.platformList.map(o=>(
                          <Option key={o.platform_id} value={o.platform_id + '&' + o.platform_name}>{o.platform_name}</Option>
                        ))
                      }
                    </Select>
                 )
               }
              </FormItem>

              <FormItem
               {...formLayout}
               label="并发数量">
               {
                 getFieldDecorator('spider_concurrency',{
                   rules: [
                    //  {required: true, message: '数据平台不可为空'},
                    //  {validator: this.length_100}
                   ],
                   initialValue: this.state.id && this.state.id !== -1? taskDetail.spider_concurrency:undefined
                 })(
                    <Input placeholder="填写平台并发数量"/>
                 )
               }
              </FormItem>

              <FormItem
               {...formLayout}
               label="任务运行主机">
               {
                 getFieldDecorator('node_ids',{
                   rules: [
                     {required: true, message: '运行主机不可为空'},
                   ],
                   initialValue: this.state.id && this.state.id !== -1? taskDetail.node_ids:undefined

                 })(
                    <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} mode="multiple">
                      {hostList.map(i=>{
                        return <Option key={i.id} value={parseInt(i.id)}>{i.node_name+':'+i.node_port}</Option>
                      })}
                    </Select>
                 )
               }
              </FormItem>
              {this.state.taskDetail.id && 
              <div>
                <FormItem
                {...formLayout}
                label="创建时间">
                <p>{taskDetail.created_at}</p>
                </FormItem>
                <FormItem
                {...formLayout}
                label="创建人">
                <p>{taskDetail.creator}</p>
                </FormItem>
                </div>
              }
            </Form>
            </div>
            || currentStep === 1 && 
              <div className="editscript-container">

            <div className="func-box">
              <a className="btn" onClick={this.saveScript}><Icon type="save" />&nbsp;保存</a>
              {/* <a className="btn" onClick={this.formatScript}><Icon type="retweet" />&nbsp;格式化</a> */}
              { this.state.openingFileIsSpider && <a className="btn" onClick={this.setScriptArg}><Icon type="code-o" />&nbsp;参数设置</a>}

              <a className="btn" onClick={()=>this.setState({showBuildModal: true})}><Icon type="code-o" />&nbsp;编译工程</a>
              <a className="btn" onClick={this.deployProject}><Icon theme="outlined" type="play-circle-o" theme="outlined" />&nbsp;发布</a>
            </div>
        <div className="editor-box">
          {
            this.state.openingFileIsSpider &&
            <div className="rightPanelStatusBtn" onClick={()=>this.setState({showRightPanel: !this.state.showRightPanel})} title={this.state.showRightPanel? '收起面板' : '展开面板'}>
              <Icon type={this.state.showRightPanel?'right':'left'} />
            </div>
          }
            <SplitPane split="vertical" defaultSize="16%">
              <div className="tree-box">
              {
              this.state.fileTree.length>0 && <DirectoryTree
                // multiple
                // autoExpandParent={true}
                defaultExpandAll={true}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                defaultSelectedKeys={defaultSelectFile}
                // selectedKeys={defaultSelectFile}
                // expandedKeys={defaultExpandedKeys}
              >
               {this.renderTreeNodes(fileTree)}
              </DirectoryTree>}
              </div>
              <SplitPane className="right-panel" split="vertical" defaultSize={this.state.showRightPanel?this.state.openingFileIsSpider?"70%":"98%":"98%"}>
              <div className="py-code">
                <div id="editor"></div>
              </div>
              
              { this.state.openingFileIsSpider && this.state.showRightPanel && 
              <div className="config-box" style={{width: '100%'}}>
                <div className="tab-box" style={{flex: 7,height: '69%',overflow: 'scroll'}}>
                  <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                    <TabPane tab="爬取日志" key="1"><pre>{this.state.scriptLogContent}</pre></TabPane>
                    <TabPane tab="爬取结果" key="2"><pre>{this.state.scriptResultContent}</pre></TabPane>
                  </Tabs>
                </div>
                <div className="form-box">
                  {/* <Button className="btn" type="primary" onClick={this.setScriptArg}>运行参数编辑</Button> */}

                  <a href="javascript:;" onClick={this.cleanResult}>清空测试结果</a>
                  <Button type="primary" onClick={this.runScript}>开始测试</Button>
                </div>
              </div>
              }
              </SplitPane>
            </SplitPane>
        </div>
      </div> 
            || currentStep === 2 && 
            <div style={{width: 500,margin: '0 auto'}}>
              <Form>
                <FormItem
                {...formLayout}
                label="数据源">
                {
                  getFieldDecorator('dataSource',{
                    rules: [
                      // {required: true, message: '数据源不可为空'},
                      //  {validator: this.length_100}
                    ]
                  })(
                      <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} disabled>
                        {
                          dataSourceList.map(o=>(
                            <Option key={o.value} value={o.value}>{o.name}</Option>
                          ))
                        }
                      </Select>
                  )
                }
                </FormItem>
                <FormItem
                {...formLayout}
                label={<Tooltip title='默认按照"oss前缀_时间动态参数“（待确定）的格式生成在数据表所在的文件路径下，也支持用户自定义。'>文件路径 <Icon type="question-circle-o" /></Tooltip>}>
                {
                  getFieldDecorator('filePath',{
                    rules: [
                      // {retuqires: true, message: '数据源不可为空'},
                      //  {validator: this.length_100}
                    ]
                  })(
                      <Input disabled={true}/>
                  )
                }
                </FormItem>
              </Form>
            </div>
          }
        </div>
        <Modal maskClosable={false} destroyOnClose={true}
        destroyOnClose={true}
        visible={showProjectModal}
        onOk={this.handleCreateProject}
        onCancel={()=>this.setState({showProjectModal:false})}
        title="爬虫项目工程信息"
        >
          <Form>
            <FormItem
            {...formLayout}
            label="项目名称">
            {
              getFieldDecorator('project_name')(
                <Input/>
              )
            }
            </FormItem>
            <FormItem
            {...formLayout}
            label="项目描述">
            {
              getFieldDecorator('project_desc')(
                <Input/>
              )
            }
            </FormItem>
          </Form>
        </Modal>
        <Modal maskClosable={false} destroyOnClose={true}
        destroyOnClose={true}
        visible={this.state.showRenameModal}
        title="输入新的文件名"
        onOk={this.handleRenameSubmit}
        onCancel={()=>this.setState({showRenameModal:false})}>
          <Form>
            <FormItem
            {...formLayout}
            label="输入新文件名">
              {
                getFieldDecorator('newFileName',{
                  rules:[
                    {required: true,message:'新名称不能为空'}
                  ],
                  initialValue: this.state.renameLabel
                })(
                  <Input/>
                )
              }
            </FormItem>
          </Form>
        </Modal>
        <Modal maskClosable={false} destroyOnClose={true}
        width={680}
        visible={this.state.showArgEditModal}
        onOk={this.saveScriptRunConfig}
        title="参数编辑"
        confirmLoading={this.state.confirmLoading}
        onCancel={()=>this.setState({showArgEditModal:false})}>
              {/* <Form>
                <FormItem
            {...formLayout} label="参数编辑">
                  <TextArea defaultValue={this.state.fileDetail.args} onChange={this.handleArgEdit} autosize={{ minRows: 5, maxRows: 10 }} />
                </FormItem>
              </Form> */}
              <div style={{marginBottom: 20}}>

                <Form>
                  {/* <FormItem
                  {...formLayout}
                  label="是否使用代理IP">
                    {
                      getFieldDecorator('script.proxyIp',{
                        initialValue: this.state.fileDetail.use_proxy
                      })(
                        <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}}  placeholder="不使用代理IP">
                          <Option value={1}>使用</Option>
                          <Option value={0}>不使用</Option>
                        </Select>
                      )
                    }
                  </FormItem> */}
                  {/* <FormItem
                  {...formLayout}
                  label="选择登录账号">
                    {
                      getFieldDecorator('script.account',{})(
                        <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} placeholder="选择登录账号">
                          {
                            accountList.map(o=>{
                              return <Option value={o.account_name}>{o.account_name}</Option>
                            })
                          }
                        </Select>
                      )
                    }
                  </FormItem> */}
                  <FormItem
                  {...formLayout}
                  label="选择运行主机">
                    {
                      getFieldDecorator('script.host',{
                        initialValue: this.state.fileDetail.hosts || []
                      })(
                        <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} mode="multiple" placeholder="选择运行主机">
                          {
                            hostList.map(o=>{
                              return <Option key={o.node_ip} value={o.node_ip+':'+o.node_port}>{o.node_name+':'+o.node_port}</Option>
                            })
                          }
                        </Select>
                      )
                    }
                  </FormItem>
                  <FormItem
                  {...formLayout}
                  label=" "
                  colon={false}>
                    {
                      getFieldDecorator('script.applyToAll',{
                        initialValue: this.state.fileDetail.applyToAll || false
                      })(
                        <Checkbox defaultChecked={false}>将此参数应用于项目下所有脚本</Checkbox>
                      )
                    }
                  </FormItem>
                </Form>
              </div>
              <div>
                <div style={{display:'flex',justifyContent: 'flex-end'}}>
                <Button style={{marginBottom: 20}} onClick={this.handleAddNewLine}>新增行</Button>
                </div>
                <Table
                bordered
                size="small"
                rowKey="index"
                pagination={false}
                dataSource={this.state.scriptParamsList}
                columns={tableCol}
                >

                </Table>
                {/* <Button onClick={this.saveArgsToAllScript}>将此参数应用于项目下所有脚本</Button> */}
                
              </div>
        </Modal>

        <Modal maskClosable={false} destroyOnClose={true}
        visible={this.state.showBuildModal}
        onOk={this.buildProject}
        title="编译工程"
        onCancel={()=>this.setState({showBuildModal:false})}>
              <Form>
                <FormItem
            {...formLayout}
                label="打包描述">
                  <TextArea onChange={this.handleBuildDescChange} autosize={{ minRows: 5, maxRows: 10 }} ></TextArea>
                </FormItem>
              </Form>
        </Modal>
        <Modal maskClosable={false} destroyOnClose={true}
        visible={this.state.showAddFileModal}
        title="添加文件"
        onOk={this.handleAddFile}
        onCancel={()=>this.setState({showAddFileModal: false})}>
            <Form>
              <FormItem
            {...formLayout}
              label="文件名称">
                {
                  getFieldDecorator('new_file_name',{
                    rules: [
                      {required: true,message:'文件名不能为空'}
                    ]
                  })(
                    <Input />
                  )
                }
              </FormItem>
            </Form>
        </Modal>
      </div>
    )
  }

}
CrawTaskDetail = Form.create()(CrawTaskDetail);

