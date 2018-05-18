import axios from 'axios'
import routers from '../router'
import globalConfig from '../assets/lib/globalConfig'

let instance = axios.create({
  //服务请求超时毫秒数
  timeout: globalConfig.timeout,
  //标志为跨域请求
  withCredentials: true,
});

//请求拦截器
instance.interceptors.request.use(config => {
  // 判断当前用户是否登陆，未登陆进行提示并强制其重新登陆(除不需要登陆的页面外)
  if(routers.history.current.meta.login != false && !util.cache.get('user')){
    //跳转回登陆界面
    routers.push({name: 'loginAndRegister'});
    //取消请求
    let source = axios.CancelToken.source();
    config.cancelToken = source.token;
    source.cancel('用户未登录');
  }
  return config
}, error => {
  showError();
  return Promise.reject({
    errorMessage: "发出请求时出错"
  })
});
//返回拦截器
instance.interceptors.response.use(response => {
  return response
}, error => {
  //当前请求如果是被手动取消则不提示，非手动取消进行提示
  if(!axios.isCancel(error)){
    showError();
    return Promise.reject({
      errorMessage: "返回请求时出错"
    })
  }
})

//当请求异常，网络异常,返回异常时候进行提示
function showError() {
  console.log('请求错误');
};

export default {
  axios: axios,
  post(service, params) {
    return instance.post(globalConfig.serverRootUrl + service, params)
  },
  delete(service, params) {
    return instance.delete(globalConfig.serverRootUrl + service, params)
  },
  put(service, params) {
    return instance.put(globalConfig.serverRootUrl + service, params)
  },
  get(service, params) {
    return instance.get(globalConfig.serverRootUrl + service, params)
  }
}