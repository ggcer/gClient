export default [{
  name: 'home',
  path: '/home',
  redirect: '/home/gameList',
  component: (resovle) => { 
  	require.ensure([], () => resovle(require('@/components/home/Home')), 'home')
  },
  children: [
    {
      name: 'gameList',
      path: '/home/gameList',
      component: (resovle) => { 
        require.ensure([], () => resovle(require('@/components/home/gameList')), 'gameList')
      },
    },
    {
      name: 'roomList',
      path: '/home/roomList',
      component: (resovle) => { 
        require.ensure([], () => resovle(require('@/components/home/roomList')), 'roomList')
      },
    },
  ]
}]