<template>
  <div>
    <!-- 登陆card -->
    <transition name="leftToRight">
      <Card class="form-card" v-show="!isShowRegister">
        <p slot="title"><Icon type="wifi"></Icon> 登陆</p>
        <a href="#" slot="extra" @click.prevent="isShowRegister = true">
            <Icon type="happy-outline"></Icon>
            注册
        </a>
        <Form ref="loginObj" :model="loginObj" :rules="loginRule" :label-width="70">
          <FormItem label="账号/昵称" prop="username">
            <Input type="text" v-model="loginObj.username" />
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input type="password" v-model="loginObj.password" />
          </FormItem>
          <FormItem class="btn-wrap">
            <Button type="primary" @click="login">登陆</Button>
            <Button type="ghost" @click="resetLoginObj">重置</Button>
          </FormItem>
        </Form>
        <Spin size="large" fix v-if="isShowLoginSpin"></Spin>
      </Card>
    </transition>

    <!-- 注册card -->
    <transition name="rightToLeft">
      <Card class="form-card" v-show="isShowRegister">
        <p slot="title"><Icon type="person-add"></Icon> 注册</p>
        <a href="#" slot="extra" @click.prevent="isShowRegister = false">
            <Icon type="ios-undo-outline"></Icon>
            返回登陆
        </a>
        <Form ref="registerObj" :model="registerObj" :rules="registerRule" :label-width="70">
          <FormItem label="昵称" prop="username">
            <Input type="text" v-model="registerObj.username" />
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input type="password" v-model="registerObj.password" />
          </FormItem>
          <FormItem label="确认密码" prop="repassword">
            <Input type="password" v-model="registerObj.repassword" />
          </FormItem>
          <FormItem class="btn-wrap">
            <Button type="primary" @click="register">注册</Button>
            <Button type="ghost" @click="resetRegisterObj">重置</Button>
          </FormItem>
        </Form>
        <Spin size="large" fix v-if="isShowRegisterSpin"></Spin>
      </Card>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "loginAndRegister",
    data() {
      return {
        isShowRegister: false,   //是否显示注册界面
        isShowLoginSpin: false, //是否显示登陆加载模态层
        isShowRegisterSpin: false, //是否显示注册加载模态层

        //登陆对象
        loginObj: {
          username: null,
          password: null
        },
        //登陆信息验证对象
        loginRule: {
          username: [

          ],
          password: [

          ]
        },

        //注册对象
        registerObj: {
          username: null,
          password: null,
          repassword: null
        },
        //注册信息验证对象
        registerRule: {
          username: [

          ],
          password: [

          ],
          repassword: [

          ]
        },
      };
    },
    methods: {
      //登陆
      login() {
        this.isShowLoginSpin = true;
        util.http.post('user/login', this.loginObj).then((res) => {
          console.log(res);
          this.isShowLoginSpin = false;
        })
      },
      //重置登陆对象
      resetLoginObj() {
        this.$refs['loginObj'].resetFields();
      },

      //注册
      register() {
        this.isShowRegisterSpin = true;
        setTimeout(() => {
          this.isShowRegisterSpin = false;
        }, 2000)
      },
      //重置注册对象
      resetRegisterObj() {
        this.$refs['registerObj'].resetFields();
      },
    },
    mounted() {

    }
  };

</script>

<style lang="scss" scoped>
  $formCardWidth : 350px;
  .form-card {
    width: $formCardWidth;
    position: fixed;
    top: 100px;
    left: calc(50% - #{$formCardWidth / 2});
  }
  .btn-wrap button{
    margin-right: 10px;
  }
</style>
