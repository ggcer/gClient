<template>
  <div class="wrap" :style="{backgroundImage: 'url(' + bgImgSrc + ')'}">
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      bgImgSrc: require('../assets/img/bg/home-bg.png'), //背景图片
    }
  },
  methods: {

  },
  mounted() {
    if(util.cache.get('user')){
    }else{
      //没有登陆信息缓存跳转到登陆页面
      this.go('/user/loginAndRegister');
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-position: center;
}
</style>
