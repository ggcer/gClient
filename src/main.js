import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
//iView UI
import iView from 'iview';
import 'iview/dist/styles/iview.css';
//croppa
import Croppa from 'vue-croppa';
import 'vue-croppa/dist/vue-croppa.css';
//全局配置
import globalConfig from './assets/lib/globalConfig'
//全局工具类
import util from './util'
//全局码表
import code from './assets/lib/code'

Vue.use(iView);
Vue.use(Croppa);

//将全局配置挂载到window下
window.globalConfig = globalConfig;
//将工具类挂载到window下
window.util = util;
//将code挂载到window下
window.code = code;

//Vue全局扩展
Vue.mixin({
  data() {
    return {
      /*-----------------------------------注入路由相关-----------------------------------*/
      //指定path跳转(不带参数)
      go: (path) => {
        this.$router.push(path)
      },
      //指定path跳转，带query参数(在url地址栏显示)
      goWithQuery: (path, dataObj) => {
        this.$router.push({
          path: path,
          query: dataObj
        });
      },
      //指定路由名字跳转，带params参数(不在url地址栏显示)
      goWithParams: (name, dataObj) => {
        this.$router.push({
          name: name,
          params: dataObj
        });
      },
      //获取路由跳转的参数对象
      getRouterDataObj: () => {
        return util.object.isEmptyObj(this.$route.query) ? this.$route.params : this.$route.query;
      },
      //回到上一个页面
      back: () => {
        router.back();
      },
    }
  }
})

//实例化vue
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
