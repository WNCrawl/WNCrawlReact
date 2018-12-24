1，less版本控制在2.7 =》 3.0版本不支持inline js与antd冲突
2，打包三方资源提示undefind...listen..，将react-router置为3.0.4，redux置为3.7.2
3，编辑scss（_global.scss）文件不自动重新编译=》
4, CheckboxGroup使用getFieldDecorator生成报了t.indexOf is not a function错误=》检查生成的字段是否有重名的