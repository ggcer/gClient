import Vue from 'vue'
import App from './App'
import router from './router'
//iView UI
import iView from 'iview';
import 'iview/dist/styles/iview.css';
//全局工具类
import util from './util'

Vue.use(iView);
//将工具类挂在到window下
window.util = util;

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
        return util.common.isEmptyObj(this.$route.query) ? this.$route.params : this.$route.query;
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
  components: {
    App
  },
  template: '<App/>'
})
