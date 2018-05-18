export default [{
  name: 'loginAndRegister',
  path: '/user/loginAndRegister',
  meta: {
    login: false,
  },
  component: (resovle) => { 
  	require.ensure([], () => resovle(require('@/components/user/LoginAndRegister')), 'loginAndRegister')
  }
}]