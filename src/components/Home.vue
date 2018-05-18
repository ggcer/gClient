<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
    }
  },
  methods: {

  },
  mounted() {
    if(util.cache.get('userId')){

    }else{
      //没有登陆信息缓存跳转到登陆页面
      this.go('/user/loginAndRegister');
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
