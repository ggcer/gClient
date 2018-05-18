import Vue from 'vue'
import Router from 'vue-router'

import user from './user'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: (resovle) => { 
		  	require.ensure([], () => resovle(require('@/components/Home.vue')), 'home')
		  }
    },
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
  ]
})

//页面切换前
router.beforeEach((to, from, next) => {
  //需要登陆的页面进行登陆校验，未登陆进行提示并跳转到首页
  if (to.meta.login != false && !util.cache.get("userId")) {
    next('/user/loginAndRegister')
    next()
  } else {
    next()
  }
  next();
})

export default router