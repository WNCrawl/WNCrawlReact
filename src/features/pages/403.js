import React from 'react'
export default class Forbidden extends React.Component{
  render(){
    return (
      <div className="status-404">
        <h1>服务暂不可用(403 Forbidden)</h1>
      </div>
    )
  }
}