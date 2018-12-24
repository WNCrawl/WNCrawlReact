import React, {Component} from 'react';
import {Card,Form,Modal,Input} from 'antd';

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

export default class CreateTaskIndex extends Component{
  constructor(props){
    super(props);
    this.state = {
      showCrawCreateModal: false,
    }
  }

  handleBtnClick = ()=>{
    this.setState({
      showCrawCreateModal: true
    })
  }

  handleCreateCraw=()=>{
    const {form} = this.props;
    form.validateFields((err,values)=>{
      if(!err){
      }
    })
  }


  validNameInput(rules,value,callback){
    if(value){
      if(value.length > 40){
        callback('任务名称不能超过40个字符')
      }else
        callback()
    }else{
      callback()
    }
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const {showCrawCreateModal} = this.state;
    return (
      <div className="create-task-index-container">
        <Card onClick={this.handleBtnClick} style={{width: 200,height: 100,cursor: 'pointer'}}>
          <p>创建爬虫任务</p>
        </Card>
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
CreateTaskIndex = Form.create()(CreateTaskIndex)