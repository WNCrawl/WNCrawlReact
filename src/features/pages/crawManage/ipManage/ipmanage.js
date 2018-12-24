import React, {Component} from 'react';
import {Table, Input,message} from 'antd';
import ajax from '../../../../api/crawmanage'

const Search = Input.Search;

export default class IpManage extends Component{
  constructor(props){
    super(props),
    this.state={
      ipType: [
        {
          text: '长效IP',value: '2'
        },
        {
          text: '短效IP', value: '1'
        }
      ],
      status: [
        {
          text: '使用中', value: '1'
        },
        {
          text: '已停用', value: '2'
        }
      ],
      tableLoading: false,
      paginationParams: {
        page: 1,
        pageSize: 15
      },
      total: 0,
      dataList: [],
      filter: {
        keyword: '',
        status: [],
        ip_type: [],
      }
    }
  }

  componentDidMount(){
    this.getDataList();
  }
  handleSearch = (val)=>{
    this.state.filter.keyword = val;
    this.getDataList();
  }

  // componentDidMount(){
  //   this.setState({
  //     dataList:[
  //       {
  //         ipfrom: ''
  //       }
  //     ]
  //   })
  // }

  
  handleTableChange = (pagination,filters,sorter)=>{
    this.state.filter.status = filters.status;
    this.state.filter.ip_type = filters.ip_type;
    this.state.paginationParams.page = pagination.current;

    this.getDataList();
  }

  getDataList(){
    const param = {
      size: this.state.paginationParams.pageSize,
      page: this.state.paginationParams.page,
      keyword: this.state.filter.keyword,
      status: this.state.filter.status,
      type: this.state.filter.type,
    }
    ajax.getAllPIP(param).then(res=>{
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

  render(){
    const {dataList,ipType,status,paginationParams,tableLoading,} = this.state;
    const tableCol = [
      {
        title: 'IP来源',
        key: 'source',
        dataIndex: 'source'
      },
      {
        title: 'IP地址',
        key: 'ip',
        dataIndex: 'ip'
      },
      {
        title: '端口',
        key: 'port',
        dataIndex: 'port'
      },
      {
        title: 'IP类型',
        key: 'ip_type',
        dataIndex: 'ip_type',
        // filters: ipType,
        render: (text,record)=>(
          text!==1?'长效IP':'短效IP'
        )
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        // filters: status,
        render: (text,render)=>(
          text===1?'使用中':'已停用'
        )
      },
      {
        title: '创建时间',
        key: 'created_at',
        dataIndex: 'created_at',
      },
      {
        title: '上一次活跃时间',
        key: 'updated_at',
        dataIndex: 'updated_at',
      }
    ];

    return (
      <div className="ip-container">
        <div className="func-box" >
          <Search style={{width: 200,marginBottom: 20,marginTop: 20}} onSearch={this.handleSearch} placeholder="输入IP地址"></Search>
        </div>
        <div className="table-box">
          <Table
            bordered
            columns={tableCol}
            dataSource={dataList}
            loading={tableLoading}
            pagination={{current: paginationParams.page, pageSize:paginationParams.pageSize,total:this.state.total}}
            onChange={this.handleTableChange}
            size="small">
          </Table>
        </div>
      </div>
    )
  }
}