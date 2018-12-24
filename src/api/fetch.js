import axios from 'axios';
import {message} from 'antd';

axios.interceptors.request.use((config)=>{
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config
})

axios.interceptors.response.use(
  response => {
    return response.data;
  },

  error => {
    switch (error.response.status){
      case 403:
        message.error(error.response.data.result_message);
        window.location.href = '/wncrawl.html#/login';
        break;
      case 500:
        message.error('网络错误，状态码：500');
        break;
    }
  }
)
export const getData = (url,param)=>{
  return axios.get(`${url}`,{params:param})
}

export const postData = (url,param)=>{
  return axios.post(`${url}`,param)
}