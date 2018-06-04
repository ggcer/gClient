import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'

import user from './user'
import home from './home'
import game from './game'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/test',
      name: 'test',
      component: (resovle) => { 
		  	require.ensure([], () => resovle(require('@/components/Test.vue')), 'test')
      },
      meta: {
        login: false,
      },
    },
    //分模块配置[等于一个XXX模块的路由分开配置在XXX.js文件中]
    ...user,
    ...home,
    ...game
  ]
})

//记录当前是前进还是后退
sessionStorage.setItem('storePath', '');
//页面切换前
router.beforeEach((to, from, next) => {
  //需要登陆的页面进行登陆校验，未登陆进行提示并跳转到首页
  if (to.meta.login != false && !util.cache.get("user")) {
    //清除用户缓存
    util.cache.removeItem('user');
    next('/user/loginAndRegister')
    return
  }
  let toPathName = to.name;
	let fromPathName = from.name;
	let storePath = sessionStorage.getItem('storePath');
	console.log('path before: ' + storePath);
	let toPathNameIndex = storePath.indexOf(toPathName);
	let fromPathNameIndex = storePath.indexOf(fromPathName);
	//为返回操作
	if(fromPathNameIndex != -1 && toPathNameIndex != -1){
		store.commit('UPDATE_DIRECTION', {direction: 'back'})
		storePath = storePath.substr(0, fromPathNameIndex - 1);
	}else{
		store.commit('UPDATE_DIRECTION', {direction: 'forward'})
		storePath = storePath + '/' + toPathName;
	}
	sessionStorage.setItem('storePath', storePath);
  console.log('path after: ' + storePath);
	next()
})
//页面切换后
router.afterEach(route => {
});

export default router