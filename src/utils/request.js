import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { aesDecrypt, aesEncrypt } from '@/utils/encryption/utils'

// create an axios instance
const service = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(

  config => {
    if (store.getters.aes_key) {
      config.headers['key'] = store.getters.en_key
      config.headers['Content-Type'] = 'text/plain'
    }
    if (!config.data) {
      config.data = {}
    }
    config.data['time'] = new Date().getTime()
    // 将请求内容字符串化，进行AES加密
    // 将请求内容替换成加密后的字符串，如果你的请求内容是键值对类型，这里会出错的
    config['data'] = aesEncrypt(JSON.stringify(config['data']), store.getters.aes_key)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const code = parseInt(res.code)
    if (code) {
      // 如果有code，说明返回的是明文，这种请求也就是在初始化获取RSA公匙的那一次才会有
      return res
    } else {
      // AES解密
      const content = aesDecrypt(res, store.getters.aes_key)
      // 明文json化，返回
      return JSON.parse(content)
    }

    // return res
    // // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
