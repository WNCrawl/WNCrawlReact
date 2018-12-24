import React, { Component } from "react";
import {
  Table,
  Input,
  Button,
  Icon,
  Tooltip,
  DatePicker,
  Modal,
  message,
  Divider
} from "antd";
import ajax from "../../../../api/crawmanage";
const { Search } = Input;
const confirm = Modal.confirm;

export default class Cycle extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        instanceData: {
          total: 0,
          success: 0,
          running: 0,
          waitCommit: 0,
          failed: 0
        },
        paginationParam: {
          page: 1,
          pageSize: 15
        },
        total: 0,
        tableList: [],
        tableLoading: false,
        selectedItem: [],
        taskId: -1,
        instanceDetail: {
          name: "dsds_kol_OL"
        },
        filter: {
          task_name: "",
          script_name: "",
          date: ""
        }
      });
  }
  componentDidMount() {

    // this.state.taskId = this.props.params.taskId || -1
    if (this.props.params.taskname) {
      this.state.filter.task_name = this.props.params.taskname;
    }

    if (this.props.params.scriptname) {
      this.state.filter.script_name = this.props.params.scriptname;
    }
    this.getDataList();
  }
  searchByTaskName = e => {
    this.state.filter.task_name = e.target.value;
  };
  handleFileter = e => {
    this.state.paginationParam.page = 1;
    this.getDataList();
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.state.paginationParam.page = pagination.current;
    this.state.filter.status = filters.status;
    this.getDataList();
  };
  searchByDate = value => {
    this.state.filter.date = value.format("YYYY-MM-DD");
    this.getDataList();
  };
  searchByScriptName = e => {
    this.state.filter.script_name = e.target.value;
  };

  getDataList = () => {
    const params = {
      keyword: this.state.filter.task_name,
      script_name: this.state.filter.script_name,
      date: this.state.filter.date,
      page: this.state.paginationParam.page,
      size: this.state.paginationParam.pageSize,
      status: this.state.filter.status
    };

    //发送请求

    ajax.getCrawSche(params).then(res => {
      if (res.result) {
        if (res.data.extra !== null) {
          this.state.instanceData = {
            success: res.data.extra.success_cnt,
            running: res.data.extra.running_cnt,
            waitCommit: res.data.extra.wait_cnt,
            failed: res.data.extra.fail_cnt,
            total: res.data.total_elements
          };
        }
        this.setState({
          tableList: res.data.results,
          total: res.data.total_elements,
          instanceData: this.state.instanceData
        });
      } else {
        message.error(res.result_message);
      }
      this.setState({
        tableLoading: false
      });
    });
  };

  showLog = val => {
    Modal.error({
      title: "错误日志",
      content: val
    });
  };
  handleRetry = e => {
    let params = {
      id: e.script_id || null,
      args: [e.arg] || null
    };
    ajax.startScript([params]).then(res => {
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

  render() {
    const {
      instanceData,
      paginationParam,
      tableList,
      tableLoading,
      instanceDetail
    } = this.state;
    const tableCol = [
      {
        title: "运行节点",
        key: "node",
        dataIndex: "node"
      },
      {
        title: "工程名称",
        key: "task_name",
        dataIndex: "task_name"
      },
      {
        title: "脚本名称",
        key: "script_name",
        dataIndex: "script_name"
      },
      {
        title: "运行参数",
        key: "arg",
        dataIndex: "arg"
      },
      {
        title: "状态",
        key: "status",
        dataIndex: "status",
        filters: [
          { text: "成功", value: 2 },
          { text: "失败", value: -1 },
          { text: "运行中", value: 1 }
        ],
        render: (text, record) => {
          return text === -1 ? (
            <div>
              <a
                href="javascript:;"
                onClick={() => this.showLog(record.msg)}
                title="点击显示日志"
                style={{ cursor: "pointer" }}
              >
                失败
              </a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.handleRetry(record)}>
                重试
              </a>
            </div>
          ) : text === 2 ? (
            "成功"
          ) : text === 0 ? (
            "等待运行"
          ) : text === 1 ? (
            "运行中"
          ) : (
            ""
          );
        }
      },
      {
        title: "开始时间",
        key: "start_time",
        dataIndex: "start_time"
      },
      {
        title: "结束时间",
        key: "end_time",
        dataIndex: "end_time"
      },
      {
        title: "运行时长",
        key: "run_time",
        dataIndex: "run_time"
      },
      {
        title: "爬取量",
        key: "get_cnt",
        dataIndex: "get_cnt"
      },
      {
        title: "请求量",
        key: "request_cnt",
        dataIndex: "request_cnt"
      }
      // {
      //   title: '存储地址',
      //   key: 'oss_url',
      //   dataIndex: 'oss_url',
      //   render: (text,record)=>(
      //     <a className="save-path" target="_blank" title={text} href={text}>点击访问</a>
      //   )
      // }
    ];
    return (
      <div className="cycle-container">
        <div className="stauts-box">
          {/* <span className="total">昨日爬取量：{instanceData.total}</span> */}
          <span>
            <a className="success">成功：{instanceData.success}</a>{" "}
            <a className="running">爬取中：{instanceData.running}</a>{" "}
            <a className="failed">失败：{instanceData.failed}</a>{" "}
          </span>
        </div>
        <div className="func-box">
          <span className="co">
            <Search
              style={{ width: 160 }}
              defaultValue={this.state.filter.task_name}
              onChange={this.searchByTaskName}
              onSearch={this.handleFileter}
              placeholder="工程名称"
            />
          </span>
          <span className="co">
            <Search
              style={{ width: 180 }}
              defaultValue={this.state.filter.script_name}
              onChange={this.searchByScriptName}
              onSearch={this.handleFileter}
              placeholder="脚本名称"
            />
          </span>
          <span className="co">
            爬取日期{" "}
            <DatePicker onChange={this.searchByDate} format="YYYY-MM-DD" />
          </span>
        </div>
        <div className="table-box">
          <Table
            bordered
            scroll={{ x: true }}
            columns={tableCol}
            dataSource={tableList}
            onChange={this.handleTableChange}
            pagination={{
              current: paginationParam.page,
              pageSize: paginationParam.pageSize,
              total: this.state.total
            }}
            loading={tableLoading}
            size="small"
          />
        </div>
      </div>
    );
  }
}
