import React, {Component} from 'react';
import {Table,Input,DatePicker,message} from 'antd';
import ajax from '../../../../api/datasync'

const {Search} = Input;
const URL = window.location.href.split('#')[0];
const RangePicker = DatePicker.RangePicker;


export default class SuppData extends Component{
  constructor(props){
    super(props);
    this.state={
      dataList: [],
      tableLoading: false,
      biz_start_date: '',
      biz_end_date: '',
      nameInput: '',
      pagiParams: {
        page: 1,
        pageSize: 15,
      },
      total: 0,
    }
  }
  componentDidMount(){
    this.getTableList();
  }
  handleTableChange = (pagination,filters,sorter)=>{
    this.state.pagiParams.page = pagination.current;
    this.getTableList();
  }
  killAllInstance = (id)=>{
    ajax.killAllInstance(id).then(res=>{
      if(res.result){
        message.success('操作成功')
      }else{
        message.error(res.result_message)
      }
    })
  }
  searchByInput = (inp) => {
    this.state.nameInput = inp;
    this.state.pagiParams.page = 1;
    this.getTableList();
  }
  searchByDate = (date,dateString)=>{
    this.state.biz_start_date = dateString[0];
    this.state.biz_end_date = dateString[1];
    this.state.pagiParams.page = 1;
    this.getTableList();
  }

  getTableList(){
    const params = {
      page: this.state.pagiParams.page,
      pageSize: this.state.pagiParams.pageSize,
      keyword: this.state.nameInput,
      biz_start_date: this.state.biz_start_date,
      biz_end_date: this.state.biz_end_date,
    };
    ajax.allSuppData(params).then(res=>{
      if(res.result){
        this.setState({
          dataList: res.data.results,
          total: res.data.total_elements,
        })
      }else{
        message.error(res.result_message)
      }
    })
  }
  render(){
    const {dataList,tableLoading,pagiParams} = this.state;
    const tablCol = [
      {
        title: '补数据名称',
        key: 'instance_name',
        dataIndex: 'instance_name',
        render: (text,record)=>(
          <a href={URL + '#/datasync/suppdatadetail/' + record.id}>{text}</a>
        )
      },
      {
        title: '业务日期',
        key: 'biz_start_date',
        dataIndex: 'biz_start_date',
      },
      {
        title: '实例生成时间',
        key: 'biz_end_date',
        dataIndex: 'biz_end_date',
      },
      {
        title: '操作人',
        key: 'modifier',
        dataIndex: 'modifier'
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        render: (text,record)=>(
          <a href="javascript:;" onClick={()=>this.killAllInstance(record.id)}>杀死所有实例</a>
        )
      }
    ]
    return(
      <div className="suppData-container">
        <div className="func-box">
          <Search placeholder="任务名称" onSearch={this.searchByInput} style={{width: 160}}/>
          <span className="date-box">业务日期 <RangePicker onChange={this.searchByDate} format="YYYY-MM-DD"></RangePicker></span>
        </div>
        <div className="table-box">
          <Table
            bordered
            pagination= {{current:pagiParams.page,pageSize:pagiParams.pageSize,total:this.state.total}}
            columns={tablCol}
            onChange={this.handleTableChange}
            dataSource={dataList}
            size="small"
            loading={tableLoading}>
            
          </Table>
        </div>
      </div>
    )
  }
}