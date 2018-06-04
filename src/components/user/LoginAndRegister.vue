<template>
  <div class="wrap" :style="{backgroundImage: 'url(' + bgImgSrc + ')'}">
    <!-- 登陆card -->
    <transition name="leftToRight">
      <Card class="form-card" v-show="!isShowRegister">
        <p slot="title"><Icon type="ios-paperplane"></Icon> 登陆</p>
        <a href="#" slot="extra" @click.prevent="isShowRegister = true">
            <Icon type="happy-outline"></Icon>
            注册
        </a>
        <Form ref="loginObj" :model="loginObj" :rules="loginRule" :label-width="80">
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
        <Form ref="registerObj" :model="registerObj" :rules="registerRule" :label-width="80">
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
            { required: true, message: '请输入账号/昵称' }
          ],
          password: [
            { required: true, message: '请输入密码' },
            {
              min: 6,
              message: "密码不能少于6个字符",
            },
            {
              max: 18,
              message: "密码不能大于18个字符",
            },
            {
              pattern: /^[A-Za-z0-9]+$/gi,
              message: "密码只能由大小写字母及数字组成"
            }
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
            { required: true, message: '请输入昵称'},
            {
              min: 2,
              message: "昵称不能少于2个字符",
            },
            {
              max: 10,
              message: "昵称不能大于10个字符",
            },
            {
              pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/gi,
              message: "昵称不能含有特殊字符或空格"
            }
          ],
          password: [
            { required: true, message: '请输入密码' },
            {
              min: 6,
              message: "密码不能少于6个字符",
            },
            {
              max: 18,
              message: "密码不能大于18个字符",
            },
            {
              pattern: /^[A-Za-z0-9]+$/gi,
              message: "密码只能由大小写字母及数字组成"
            }
          ],
          repassword: [
            { required: true, message: '请输入确认密码' },
            {
              min: 6,
              message: "确认密码不能少于6个字符",
            },
            {
              max: 18,
              message: "确认密码不能大于18个字符",
            },
            {
              pattern: /^[A-Za-z0-9]+$/gi,
              message: "确认密码只能由大小写字母及数字组成"
            },
            { validator: this.repasswordValidator }
          ],
        },

        bgImgSrc: require('../../assets/img/bg/login-register-bg.png'), //背景图片
      };
    },
    methods: {
      //登陆
      login() {
        this.$refs["loginObj"].validate(valid => {
          if(valid){
            this.isShowLoginSpin = true;
            util.http.post('user/login', this.loginObj).then((res) => {
              this.isShowLoginSpin = false;
              console.log(res.data);
              if(res.data.result){
                this.$Message.success(res.data.desc);
                //将登陆用户数据存入缓存中
                util.cache.set('user', res.data.obj.user);
                //新建用户设置缓存
                util.cache.set('userSet', {});
                //跳转到home页
                this.go('/home');
              }else{
                this.$Message.warning(res.data.desc);
              }
            })
          }
        })
      },
      //重置登陆对象
      resetLoginObj() {
        this.$refs['loginObj'].resetFields();
      },

      //注册
      register() {
        this.$refs["registerObj"].validate(valid => {
          if(valid){
            let reqObj = util.object.copy(this.registerObj);
            delete reqObj.repassword;
            
            this.isShowRegisterSpin = true;
            //请求注册
            util.http.post('user/register', reqObj).then((res) => {
              this.isShowRegisterSpin = false;
              console.log(res.data);
              if(res.data.result){
                this.$Message.success(res.data.desc);
                //给登陆对象赋值
                util.object.copyFieldValue(this.loginObj, this.registerObj);
                //清空registerObj
                this.resetRegisterObj();
                //切换到登陆界面
                this.isShowRegister = false;
              }else{
                this.$Message.warning(res.data.desc);
              }
            })
          }
        })
      },
      //重置注册对象
      resetRegisterObj() {
        this.$refs['registerObj'].resetFields();
      },

      //enter键监听
      enterKeyHandler(){
        //如果当前在注册界面则进行注册，如果在登陆页面则进行登陆
        if(this.isShowRegister){
          this.register();
        }else{
          this.login();
        }
      },

      // -----------自定义Validator相关----------- //
      //确认密码
      repasswordValidator(rule, value, callback){
        let password = this.registerObj.password;
        if(password){
          if(value != password){
            callback(new Error("两次输入的密码不一致"));
          }
        }
        return callback();
      }
    },
    mounted() {
      document.onkeydown = (e) => {
        if (e && e.keyCode == 13) { //回车键的键值为13
          this.enterKeyHandler();
        }
      };
    },
    destroyed() {
      document.onkeydown = null;
    }
  };

</script>

<style lang="scss" scoped>
@import '@/assets/css/vars.scss';
$formCardWidth : 350px;
.form-card {
  width: $formCardWidth;
  position: fixed;
  top: 100px;
  left: calc(50% - #{$formCardWidth / 2});
  opacity: $base-opacity;
}
.btn-wrap button{
  margin-right: 10px;
}
</style>
