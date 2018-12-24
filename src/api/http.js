import 'whatwg-fetch';
import { message } from 'antd';
import ProgressBar from '../features/components/progress-bar';

class Http {
/* eslint-disable */
    get(url, params) { // GET请求
        const newUrl = params ? this.build(url, params) : url
        return this.request(newUrl, {
            method: 'GET',
            headers: this.defaultHeader()
        })
    }

    post(url, body) { // POST请求
        let options = { method: 'POST' }
        if (body) options.body = JSON.stringify(body)
        options.headers = this.defaultHeader()
        return this.request(url, options)
    }

    postAsFormData(url, params) {
        let options = { method: 'POST' }
        if (params) options.body = this.buildFormData(params)
        return this.request(url, options)
    }

    postForm(url, form) {
        let options = { method: 'POST' }
        if (form) options.body = new FormData(form)
        return this.request(url, options)
    }

    request(url, options) {
        ProgressBar.show()
        options.credentials = 'same-origin'
        return fetch(url, options)
        .then(res => {
          // 未登录
          if(res.status === 410) {
            message.error('您尚未登录或登陆已过期');
            const url = '/wncrawl.html#/login'
            window.location.href = url;
          }else if(res.status === 500){
            message.error('服务不可用，[code: ' + res.status + ']')
            return res;
          }else if(res.status === 404){
            message.error('服务未找到，[code: ' + res.status + ']')
            return res;
          }else{
            return res
          }
        })
        .then(response => {
            ProgressBar.hide()
                return response.json()
        })
        .then(resData => {
          // 无权限
          if(resData.result_code == 3) {
            // if(window != top){
            //   top.location.href = '/easylog.html#/noauth';
            // }
            // else{
            //   window.location.href = '/easylog.html#/noauth';
            // }
          }
          else {
            return resData
          }
        })
        .catch( err => {
            message.destroy();
            message.error(`请求错误`);
        })
    }

    defaultHeader() { // 默认头
        const header = {
            'Accept': '*/*',
            'Content-Type': 'application/json;charset=UTF-8',
        };
        return header
    }

    build(url, params) { // URL构建方法
        const ps = []
        if (params) {
            for (let p in params) {
                if (p) {
                    ps.push(p + '=' + encodeURIComponent(params[p]));
                }
            }
        }
        return url + '?' + ps.join('&')
    }

    buildFormData(params) {
        if (params) {
            const data = new FormData()
            for (let p in params) {
                if (p) {
                    data.append(p, params[p])
                }
            }
            return data;
        }
    }
}
/* eslint-disable */
export default new Http()
