import React, { Component } from "react";
import { hashHistory } from "react-router";
import { connect } from "react-redux";
import {
  Select,
  Input,
  Button,
  Table,
  message,
  Modal,
  Form,
  Divider,
  Checkbox,
  DatePicker,
  TreeSelect
} from "antd";
import ajax from "../../../../api/crawmanage";
import { addNewCrawAction } from "../../../actions/crawManage";
import moment from "moment";

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;
const URL = window.location.href.split("#")[0];

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 }
  }
};

const mapState = state => ({});

const mapDispatch = dispatch => ({
  saveOpeningInfo(param) {
    dispatch(addNewCrawAction.saveOpeningInfo(param));
  }
});

const treeData = [
  {
    title: "Node1",
    value: "0-0",
    key: "0-0",
    children: [
      {
        title: "Child Node1",
        value: "0-0-0",
        key: "0-0-0"
      }
    ]
  },
  {
    title: "Node2",
    value: "0-1",
    key: "0-1",
    children: [
      {
        title: "Child Node3",
        value: "0-1-0",
        key: "0-1-0"
      },
      {
        title: "Child Node4",
        value: "0-1-1",
        key: "0-1-1"
      },
      {
        title: "Child Node5",
        value: "0-1-2",
        key: "0-1-2"
      }
    ]
  }
];
@connect(
  mapState,
  mapDispatch
)
export default class ScriptDetail extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      scriptId: -1,
      TableData: [],
      searchType: "",
      keyword: "",
      total: 0,
      search_task_name: "",
      search_script_name: "",
      selectedItem: [],
      taskId: -1,
      showStartModal: false,

      edittingArgRecord: {},

      confirmLoading: false,
      showArgEditModal: false,
      startItemArgs: [],
      startItemId: -1,
      hostList: [],
      spiderTree: [],
      keyFlag: 0,
      editFlag: false,

      applyToAll: false,
      scriptParamsList: [],
      fileDetail: {
        otherSpider: ["0-1-0", "0-1-2"]
      }, //爬虫详情

      paginationParam: {
        page: 1,
        pageSize: 15
      }
    };
  }

  getScriptList = () => {
    const { form } = this.props;

    const params = {
      project_id: this.state.scriptId,
      size: this.state.paginationParam.pageSize,
      page: this.state.paginationParam.page,
      task_name: this.state.search_task_name,
      script_name: this.state.search_script_name,
      task_id: this.state.taskId
      // keyword: this.state.key,
      // search_type: this.state.searchType,
    };
    ajax.getScriptList(params).then(res => {
      if (res.result) {
        this.setState({
          TableData: res.data.results,
          total: res.data.total_elements
        });
      } else {
        message.error(res.data.result_message);
      }
    });
  };

  componentWillMount() {
    this.state.scriptId = this.props.params.scriptId || null;
    this.state.taskId = this.props.params.taskId || null;
    console.log(this.state.scriptId);
  }

  handleSearchTaskNameChange = e => {
    this.state.search_task_name = e.target.value;
  };
  handleSearchScriptNameChange = e => {
    this.state.search_script_name = e.target.value;
  };
  componentDidMount() {
    this.getScriptList();
  }

  handleSearch = e => {
    this.state.paginationParam.page = 1;

    this.getScriptList();
  };
  handleStopHostAllScript = id => {
    console.log(id);
  };

  renderExpandedTable = dataList => {};

  handleSelectChange = e => {
    this.state.searchType = e;
  };
  haneldTableChange = (pagination, filters, sorter) => {
    this.state.paginationParam.page = pagination.current;

    this.getScriptList();
  };

  handleEnableScript = (id, single) => {
    console.log(id, single);
    const params = [];
    if (single) {
      params.push(id);
    } else {
      if (this.state.selectedItem.length === 0) {
        message.error("至少选择一个脚本");
        return;
      }

      this.state.selectedItem.map(o => {
        params.push(o.id);
        // params.push({
        //   id: o.id,
        //   task_name: o.task_name
        // })
      });
    }
    ajax.enableScripts({ ids: params }).then(res => {
      if (res.result) {
        message.success("启用成功");
        this.getScriptList();
      } else {
        message.error(res.result_message);
      }
    });
  };

  handleDisableScript = (id, single) => {
    const params = [];
    if (single) {
      params.push(id);
    } else {
      if (this.state.selectedItem.length === 0) {
        message.error("至少选择一个脚本");
        return;
      }

      this.state.selectedItem.map(o => {
        params.push(o.id);
      });
    }
    ajax.disableScripts({ ids: params }).then(res => {
      if (res.result) {
        message.success("停用成功");
        this.getScriptList();
      } else {
        message.error(res.result_message);
      }
    });
  };

  getSpiderByProject = name => {
    ajax.getProjectTree(name).then(res => {
      if (res.result) {
        this.state.spiderTree = res.data;
        this.processTree();

        this.setState({
          spiderTree: this.state.spiderTree
        });
      } else {
        message.error(res.result_message);
      }
    });
  };

  processTree = () => {
    this.state.spiderTree.map((o, index) => {
      this.traverseTree(o);
    });
    console.log(this.state.spiderTree);
  };

  traverseTree = node => {
    if (node) {
      node.key = this.state.keyFlag;
      node.title = node.label;
      node.value = node.path + "?" + this.state.keyFlag++;
      delete node.label;
      delete node.path;
    }
    if (node.children && node.children.length > 0) {
      for (var i = 1; i <= node.children.length; i++) {
        this.traverseTree(node.children[i - 1]);
      }
    }
  };

  handleStopScriptSingle = (id, name) => {
    ajax.stopScript([{ id: id, task_name: name }]).then(res => {
      if (res.result) {
        message.success("停止成功");
        this.getScriptList();
      } else {
        message.error(res.result_message);
      }
    });
  };

  handleStartScriptSingle = (id, record) => {
    console.log(record);
    
    if (record.args !== null && record.args !== "") {
      try {
        if (typeof record.args === "string") {
          let argsParam  =
            record.args !== null && record.args !== ""
              ? JSON.parse(
                  record.args
                    .replace(/\""""/g, '""')
                    .replace(/\"{/g, "{")
                    .replace(/\}"/g, "}")
                )
              : [];
              console.log(argsParam)
          if (
            argsParam.length > 1 ||
            (argsParam.length === 1 && argsParam[0].args !== "")
          ) {
            //choose args
            let d = [];

            argsParam.map((o, index) => {
              let flag = o;
              if(o.dynamic_value && o.dynamic_value !== ''){
                flag.args.dynamic_value = o.dynamic_value;
              }
              d.push({
                label: JSON.stringify(flag.args),
                value: JSON.stringify(flag.args)
              });
            });
            this.setState(
              {
                showStartModal: true,
                startItemArgs: d,
                startItemId: id
              }
            );
            return;
          }
        } else {
          message.error("脚本参数非字符串，请检查");
          console.log(record.args)
          return;
        }
      } catch (error) {
        message.error("解析脚本运行参数错误");

        console.log(record.args)
        return;
      }
    }
    const params = [
      {
        id: id,
        args: null
      }
    ];

    ajax.startScript(params).then(res => {
      if (res.result) {
        message.success("启动成功");
        this.getScriptList();
        this.setState({
          showStartModal: false
        });
      } else {
        message.error(res.result_message);
      }
    });
  };

  startScript = () => {
    const { form } = this.props;
    form.validateFields(["start_args"], (err, value) => {
      console.log(value);
      if (!value.start_args || value.start_args.length === 0) {
        message.error("请选择运行参数");
        return;
      }
      if (!err) {
        const params = [
          {
            id: this.state.startItemId,
            args: value.start_args
          }
        ];
        console.log(params);
        this.setState({
          showStartModal: false
        });

        ajax.startScript(params).then(res => {
          if (res.result) {
            message.success("启动成功");
            this.getScriptList();
          } else {
            message.error(res.result_message);
          }
          // 这里帮你把值清空了
          form.setFieldsValue({
            start_args: []
          });
        });
      }
    });
  };
  handleEdit = record => {
    let id = record.id;
    let path = record.path;
    let label = record.label;

    this.props.saveOpeningInfo({ path, label });
    window.location.href = `${URL}#/crawmanage/crawtaskdetail/2/${record.id}`;
  };

  /**
   * 参数弹窗表格方法
   */
  saveArgsValue = (val, index) => {
    this.state.scriptParamsList[index].args = val.target.value;
  };
  saveTriggerValue_week = (val, record) => {
    record.trigger.day_of_week = val.target.value;
  };
  saveTriggerValue_day = (val, record) => {
    // this.state.scriptParamsList[index].trigger = val.target.value
    record.trigger.day = val.target.value;
  };
  saveTriggerValue_month = (val, record) => {
    // this.state.scriptParamsList[index].trigger = val.target.value
    record.trigger.month = val.target.value;
  };
  saveTriggerValue_hour = (val, record) => {
    // this.state.scriptParamsList[index].trigger = val.target.value
    record.trigger.hour = val.target.value;
  };
  saveTriggerValue_minute = (val, record) => {
    // this.state.scriptParamsList[index].trigger = val.target.value
    record.trigger.minute = val.target.value;
  };
  saveTriggerValue_suppdata = (val, index) => {
    console.log(val, index);
    this.state.scriptParamsList[index].fix_type = val;
  };

  saveTriggerValue_suppdata_fix_date = (val, str, index) => {
    console.log(val);
    console.log(str);
    this.state.scriptParamsList[index].fix_date = str;
  };
  removeArgsItem = record => {
    this.state.scriptParamsList.splice(
      this.state.scriptParamsList.indexOf(record),
      1
    );

    this.setState({
      scriptParamsList: this.state.scriptParamsList
    });
  };
  editArgs = e => {
    this.getSpiderByProject(e.project_name);
    this.setState({
      edittingArgRecord: e,
      showArgEditModal: true
    });
  };
  handleAddNewLine = () => {
    let d = moment()
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    this.state.scriptParamsList[this.state.scriptParamsList.length] = {
      args: { start_date: d, end_date: d },
      trigger: {
        day_of_week: "*",
        month: "*",
        hour: "*",
        minute: "*",
        day: "*"
      },
      fix_type: 0,
      fix_date: "",
      index: this.state.scriptParamsList.length
    };
    this.setState({
      scriptParamsList: this.state.scriptParamsList
    });
  };

  saveScriptRunConfig = () => {
    this.setState({
      confirmLoading: true
    });
    const { form } = this.props;
    console.log(this.state.openingFileScriptName);
    console.log(this.state.openingFileSpiderName);

    form.validateFields(
      ["script.host", "script.proxyIp", "script.otherSpider"],
      (err, values) => {
        if (!err) {
          const params = {
            script_name: this.state.edittingArgRecord.script_file,
            spider_name: this.state.edittingArgRecord.name,
            hosts: values.script.host,
            type: 1,
            use_proxy: values.script.proxyIp,
            scripts: values.script.otherSpider
          };
          params.params = [];
          this.state.scriptParamsList.map((o, i) => {
            params.params.push({
              args: o.args,
              trigger: {
                // day_of_week: o.trigger.day_of_week,
                // hour: o.trigger.hour,
                // minute: o.trigger.minute,
                // day: o.trigger.day,
              },
              fix_type: o.fix_type,
              fix_date: o.fix_date
            });
            o.trigger.day_of_week && o.trigger.day_of_week !== "*"
              ? (params.params[i].trigger.day_of_week = o.trigger.day_of_week)
              : "";
            o.trigger.month && o.trigger.month !== "*"
              ? (params.params[i].trigger.month = o.trigger.month)
              : "";
            o.trigger.hour && o.trigger.hour !== "*"
              ? (params.params[i].trigger.hour = o.trigger.hour)
              : "";
            o.trigger.minute && o.trigger.minute !== "*"
              ? (params.params[i].trigger.minute = o.trigger.minute)
              : "";
            o.trigger.day && o.trigger.day !== "*"
              ? (params.params[i].trigger.day = o.trigger.day)
              : "";
          });
          console.log(params);
          // ajax.saveScriptConfig(params).then(res=>{
          //   if(res.result){
          //     message.success('保存成功');
          //     this.setState({
          //       confirmLoading: false,
          //       showArgEditModal: false,
          //     })
          //     this.getFileContent();
          //   }else{
          //     message.error(res.result_message)
          //     this.setState({
          //       confirmLoading: false,
          //     })
          //   }
          // })
        }
      }
    );
  };
  handleRemoveItem = e => {
    console.log(e);
    const param = {
      id: e.id
    };
    ajax.removeScriptDetailItem(param).then(res => {
      if (res.result) {
        message.success("删除成功");
        this.getScriptList();
      } else {
        message.error(res.result_message);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { TableData, paginationParam, total } = this.state;

    const tableCol = [
      {
        title: "参数",
        dataIndex: "args",
        width: "35%",
        key: "args",
        render: (text, record) => {
          return (
            <TextArea
              rows={5}
              onChange={e => this.saveArgsValue(e, record.index)}
              defaultValue={JSON.stringify(text)}
            />
          );
        }
      },
      {
        title: "调度周期",
        dataIndex: "action",
        key: "action",
        width: "25%",
        render: (text, record) => {
          return (
            <span className="args-box">
              <span className="input-span">
                月：
                <Input
                  placeholder="输入月数"
                  className="args-input"
                  onChange={e => this.saveTriggerValue_month(e, record)}
                  defaultValue={record.trigger && record.trigger.month}
                />
              </span>
              <span className="input-span">
                周：
                <Input
                  placeholder="输入周"
                  className="args-input"
                  onChange={e => this.saveTriggerValue_week(e, record)}
                  defaultValue={record.trigger && record.trigger.day_of_week}
                />
              </span>
              <span className="input-span">
                天：
                <Input
                  placeholder="输入天数"
                  className="args-input"
                  onChange={e => this.saveTriggerValue_day(e, record)}
                  defaultValue={record.trigger && record.trigger.day}
                />
              </span>
              <span className="input-span">
                时：
                <Input
                  placeholder="输入小时"
                  className="args-input-m"
                  onChange={e => this.saveTriggerValue_hour(e, record)}
                  defaultValue={record.trigger && record.trigger.hour}
                />
              </span>
              <span className="input-span">
                分：
                <Input
                  placeholder="输入分钟"
                  className="args-input"
                  onChange={e => this.saveTriggerValue_minute(e, record)}
                  defaultValue={record.trigger && record.trigger.minute}
                />
              </span>
              {/* <TimePicker style={{fontSize: 12}} placeholder="选择时间" className="args-tp"  onChange={(e,str)=>this.saveTriggerValue_time(e,str,record.index)}  defaultValue={(record.hour && record.minute)?moment(record.hour + ':' + record.minute, "HH:mm"):undefined} format={"HH:mm"} /> */}
            </span>
          );
          // return <Input onChange={(e)=>this.saveTriggerValue(e,record.index)} defaultValue={text}/>
        }
      },
      {
        title: "补数据设置",
        dataIndex: "suppdata",
        key: "suppdata",
        width: "30%",
        render: (text, record) => (
          <span className="args-box">
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder="选择补数据粒度"
              style={{ width: "100%", marginTop: 5 }}
              className="args-select"
              onChange={e => this.saveTriggerValue_suppdata(e, record.index)}
              defaultValue={record.fix_type}
            >
              <Option value={0}>不补数据</Option>
              <Option value={1}>按天补数据</Option>
              <Option value={2}>按周补数据</Option>
              <Option value={3}>按月补数据</Option>
            </Select>
            {/* <Input style={{marginTop: 5}} onChange={(e)=>this.saveTriggerValue_suppdata_fix_date(e,record.index)} defaultValue={record.fix_date}/> */}
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%", marginTop: 5 }}
              defaultValue={
                record.fix_date
                  ? moment(record.fix_date, "YYYY-MM-DD HH:mm:ss")
                  : undefined
              }
              onChange={(e, s) =>
                this.saveTriggerValue_suppdata_fix_date(e, s, record.index)
              }
            />
          </span>
        )
      },
      {
        title: "操作",
        dataIndex: "actionm",
        render: (text, record) => (
          <a href="javascript:;" onClick={() => this.removeArgsItem(record)}>
            删除
          </a>
        )
      }
    ];

    const columns = [
      {
        title: "工程名称",
        dataIndex: "task_name",
        key: "task_name"
      },
      {
        title: "运行节点",
        dataIndex: "hosts",
        key: "hosts"
        // render: (text,record)=>(
        //   <span>{JSON.parse(text && text.replace(/\'/g,'"'))}</span>
        // )
      },
      {
        title: "脚本名称",
        dataIndex: "name",
        key: "name",
        render: (text, record) => text
        // <span>
        //   <a href="javascript:;" onClick={()=>this.editArgs(record)}>{text}</a>
        // </span>
      },
      {
        title: "创建时间",
        dataIndex: "created_at",
        key: "created_at"
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        render: (text, record) => (
          <span>
            <a
              href="javascript:;"
              onClick={() => this.handleEdit(record)}
              href="javascript:;"
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              href="javascript:;"
              onClick={() => this.handleStartScriptSingle(record.id, record)}
            >
              启动
            </a>
            <Divider type="vertical" />

            <a
              href="javascript:;"
              onClick={() =>
                this.handleStopScriptSingle(record.id, record.task_name)
              }
            >
              停止
            </a>

            <Divider type="vertical" />
            <a href={URL + "#/crawmanage/crawsche/" + record.task_name}>
              查看脚本进度
            </a>
            {record.job_id && (
              <span>
                <Divider type="vertical" />
                <a
                  href={URL + "#/crawmanage/showcrawlog/" + record.id}
                  target="_blank"
                >
                  查看最近一次日志
                </a>
              </span>
            )}
            <Divider type="vertical" />

            {record.is_disable === 0 && (
              <a
                href="javascript:;"
                onClick={() => this.handleDisableScript(record.id, true)}
              >
                停用
              </a>
            )}
            {record.is_disable === 1 && (
              <a
                href="javascript:;"
                onClick={() => this.handleEnableScript(record.id, true)}
              >
                启用
              </a>
            )}
            <Divider type="vertical" />
            <a
              href="javascript:;"
              onClick={() => this.handleRemoveItem(record)}
            >
              删除
            </a>
          </span>
        )
      }
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRows);
        console.log(selectedRowKeys);
        this.state.selectedItem = selectedRows;
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User',
      //   name: record.name,
      // }),
    };

    return (
      <div className="script-detail-container">
        <div className="func-box">
          {/* <InputGroup compact>
          <Select  getPopupContainer={triggerNode => triggerNode.parentNode}  dropdownStyle={{fontSize: 12}} defaultValue="script_name" onChange={this.handleSelectChange}>
            <Option value="script_name">脚本名称</Option>
            <Option value="task_name">工程名称</Option>
          </Select>
          <Search style={{width: 200}} placeholder="输入关键词" onSearch={this.handleSearch}></Search>
        </InputGroup> */}
          <Search
            style={{ width: 180, marginRight: 20 }}
            onChange={this.handleSearchTaskNameChange}
            placeholder="输入工程名称"
            onSearch={() => this.handleSearch(0)}
          />

          <Search
            style={{ width: 180 }}
            onChange={this.handleSearchScriptNameChange}
            placeholder="输入脚本名称"
            onSearch={() => this.handleSearch(1)}
          />
        </div>
        <div className="table-box">
          <Table
            size="small"
            bordered
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{
              current: paginationParam.page,
              pageSize: paginationParam.pageSize,
              total: total
            }}
            columns={columns}
            dataSource={TableData}
            onChange={this.haneldTableChange}
          />
        </div>
        <div>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={this.handleDisableScript}
          >
            批量停用脚本
          </Button>
          <Button type="primary" onClick={this.handleEnableScript}>
            批量启用脚本
          </Button>
        </div>

        <Modal
          title="选择运行参数"
          visible={this.state.showStartModal}
          destroyOnClose={true}
          onOk={this.startScript}
          onCancel={() => {
            this.setState({ showStartModal: false });
          }}
        >
          <Form>
            <FormItem>
              {getFieldDecorator("start_args")(
                <CheckboxGroup options={this.state.startItemArgs} />
              )}
            </FormItem>
          </Form>
        </Modal>

        <Modal
          maskClosable={false}
          destroyOnClose={true}
          width={750}
          visible={this.state.showArgEditModal}
          onOk={this.saveScriptRunConfig}
          title="参数编辑"
          confirmLoading={this.state.confirmLoading}
          onCancel={() => this.setState({ showArgEditModal: false })}
        >
          {/* <Form>
                <FormItem
            {...formLayout} label="参数编辑">
                  <TextArea defaultValue={this.state.fileDetail.args} onChange={this.handleArgEdit} autosize={{ minRows: 5, maxRows: 10 }} />
                </FormItem>
              </Form> */}
          <div style={{ marginBottom: 20 }}>
            <Form>
              <FormItem {...formLayout} label="是否使用代理IP">
                {getFieldDecorator("script.proxyIp", {
                  initialValue: this.state.fileDetail.use_proxy
                })(
                  <Select
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    dropdownStyle={{ fontSize: 12 }}
                    placeholder="不使用代理IP"
                  >
                    <Option value={1}>使用</Option>
                    <Option value={0}>不使用</Option>
                  </Select>
                )}
              </FormItem>
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
              <FormItem {...formLayout} label="选择运行主机">
                {getFieldDecorator("script.host", {
                  initialValue: this.state.fileDetail.hosts || []
                })(
                  <Select
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    dropdownStyle={{ fontSize: 12 }}
                    mode="multiple"
                    placeholder="选择运行主机"
                  >
                    {this.state.hostList.map(o => {
                      return (
                        <Option value={o.node_ip + ":" + o.node_port}>
                          {o.node_name + ":" + o.node_port}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formLayout} label="将此参数应用到其他脚本">
                {getFieldDecorator("script.otherSpider", {
                  initialValue: this.state.fileDetail.otherSpider
                })(
                  <TreeSelect
                    treeData={this.state.spiderTree}
                    treeCheckable={true}
                    showCheckedStrategy={"SHOW_ALL"}
                    allowClear
                  />
                )}
              </FormItem>
            </Form>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                style={{ marginBottom: 20 }}
                onClick={this.handleAddNewLine}
              >
                新增行
              </Button>
            </div>
            <Table
              bordered
              size="small"
              rowKey="index"
              pagination={false}
              dataSource={this.state.scriptParamsList}
              columns={tableCol}
            />
            {/* <Button onClick={this.saveArgsToAllScript}>将此参数应用于项目下所有脚本</Button> */}
          </div>
        </Modal>
      </div>
    );
  }
}
ScriptDetail = Form.create()(ScriptDetail);
