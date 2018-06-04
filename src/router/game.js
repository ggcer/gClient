export default [{
  name: 'youDrawIGuess',
  path: '/game/youDrawIGuess',
  component: (resovle) => { 
  	require.ensure([], () => resovle(require('@/components/game/YouDrawIGuess')), 'youDrawIGuess')
  }
}]