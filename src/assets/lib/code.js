/* ------------------------------------------码表------------------------------------------ */
const code = {
  //用户头像类别
  AVATAR_TYPE_SUG: 1, //系统推荐
  AVATAR_TYPE_SELF: 2, //用户自定义

  //用户推荐头像列表
  SUG_AVATAR_LIST: [
    {
      code: 'avatar-1',
      desc: require('@/assets/img/sug-avatar/avatar-1.png')
    },
    {
      code: 'avatar-2',
      desc: require('@/assets/img/sug-avatar/avatar-2.png')
    },
    {
      code: 'avatar-3',
      desc: require('@/assets/img/sug-avatar/avatar-3.png')
    },
    {
      code: 'avatar-4',
      desc: require('@/assets/img/sug-avatar/avatar-4.png')
    },
    {
      code: 'avatar-5',
      desc: require('@/assets/img/sug-avatar/avatar-5.png')
    },
    {
      code: 'avatar-6',
      desc: require('@/assets/img/sug-avatar/avatar-6.png')
    },
    {
      code: 'avatar-7',
      desc: require('@/assets/img/sug-avatar/avatar-7.png')
    },
    {
      code: 'avatar-8',
      desc: require('@/assets/img/sug-avatar/avatar-8.png')
    },
    {
      code: 'avatar-9',
      desc: require('@/assets/img/sug-avatar/avatar-9.png')
    }
  ],

  //游戏列表
  GAME_LIST: [
    {
      code: 'NHWC',
      name: '你画我猜',
      icon: 'paintbrush',
      desc: '是神笔马良还是毕加索，和小伙伴一起验证下吧，看好你哟~',
      bgImg: require('@/assets/img/game-bg/nhwc.png'),
      path: '/game/youDrawIGuess'
    }
  ]
}

export default code;