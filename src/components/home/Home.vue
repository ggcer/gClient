<template>
  <div class="wrap" :style="{backgroundImage: 'url(' + bgImgSrc + ')'}">
    <Layout class="main-layout">
      <Sider ref="sider" collapsible hide-trigger :collapsed-width="80" v-model="isCollapsed">
        <Menu active-name="1-1" theme="dark" width="auto" :class="menuitemClasses">
          <menu-item name="1-1">
            <Icon type="ios-game-controller-a"></Icon>
            <span>游戏大厅</span>
          </menu-item>
          <menu-item name="1-2">
            <Icon type="search"></Icon>
            <span>好友</span>
          </menu-item>
          <menu-item name="1-3">
            <Icon type="settings"></Icon>
            <span>关于我们</span>
          </menu-item>
        </Menu>
      </Sider>
      <Layout class="layout">
        <Header class="layout-header">
          <Icon @click.native="switchSider" :class="rotateIcon" class="pointer" type="navicon-round" size="24"></Icon>
          <div class="user-intro">
            <span @click="showUserAvatarModal">
              <Avatar class="avatar pointer" :src="avatar"/>
            </span>
            <Poptip v-model="isShowUserPoptip" content="content" placement="bottom-end">
              <span class="username pointer">{{user.username}}</span>
              <div class="user-intro-detail" slot="content">
                <Button type="primary" long @click="loginOut">退出登陆</Button>
              </div>
            </Poptip>
          </div>
        </Header>
        <Content class="layout-content" id="layout-content">
          <!-- 页面子路由 -->
          <router-view />
        </Content>
      </Layout>
    </Layout>

    <!-- 用户头像模态框 -->
    <Modal v-model="isShowUserAvatarModal" width="478px" :styles="{top: '100px'}">
      <p slot="header" class="modal-header center">
        <Icon type="image"></Icon>
        <span>更换头像</span>
      </p>
      <div>
        <Tabs :value="userAvatarActiveTabPaneName" @on-click="handleUserAvatarTabClick">
          <TabPane name="sug" label="推荐头像" icon="heart">
            <div class="sug-avatar-wrap">
              <img :src="item.desc" :key="index" v-for="(item, index) in sugAvatarList" :class="{'active-sug-avatar': item.code == sugPreviewAvatar.code}" class="sug-avatar" @click="sugPreviewAvatar = item"/>
            </div>
            <div class="avatar-preview">
              <img :src="sugPreviewAvatar.desc" class="preview-avatar"/>
              <p class="preview-tips center">头像预览</p>
            </div>
          </TabPane>
          <TabPane name="self" label="个性头像" icon="ios-color-wand">
            <div class="croppa-wrap">
              <croppa v-model="croppaImg"
                :width="240"
                :height="240"
                placeholder="选择或拖入一张图片"
                :placeholder-font-size="15"
                :show-remove-button="true"
                :show-loading="true"
                :prevent-white-space="true"
                :initial-image="initialImg"
                @file-type-mismatch="handleCroppaFileTypeMismatch"> 
              </croppa > 
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <Button type="primary" long :loading="isShowChangeAvatarLoading" @click="changeAvatar">更换</Button>
      </div>
    </Modal>

    <!-- alert -->
    <Alert v-show="isShowAlert" show-icon class="alert">
        <Icon :type="alertObj.icon" slot="icon"></Icon>
        <template slot="desc">
          <h4 v-text="alertObj.desc"></h4>
          <div>
            <Button type="text" size="small" @click="alertObj.confirmCb ? alertObj.confirmCb() : isShowAlert = false" v-html="alertObj.confirmDesc"></Button>
            <Button type="text" size="small" @click="alertObj.cancelCb ? alertObj.cancelCb() : isShowAlert = false" v-html="alertObj.cancelDesc"></Button>
          </div>
        </template>
    </Alert>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        user: {}, //当前的登陆用户对象
        userSet: {}, //当前的用户设置
        code: code, //码表
        isCollapsed: false, //侧边栏是否折叠
        nowBreadcrumbIndex: 0,  //当前显示的面包屑的下标

        // -----------game相关----------- //
        gameList: code.GAME_LIST, //游戏列表

        // -----------alert相关----------- //
        isShowAlert: false, //是否显示alert框
        alertObj: { //alert对象
          icon: 'ios-lightbulb-outline',
          desc: null,
          confirmDesc: '确定',
          cancelDesc: '取消',
          confirmCb: null,
          cancelCb: null
        },

        isShowUserPoptip: false,

        // -----------用户头像模态层相关----------- //
        isShowUserAvatarModal: false, //是否显示用户头像模态层
        isShowChangeAvatarLoading: false, //是否显示更改头像加载层
        userAvatarActiveTabPaneName: 'sug',  //当前的用户头像模态层的tab页name
        sugAvatarList: code.SUG_AVATAR_LIST,  //推荐头像列表
        sugPreviewAvatar: {}, //当前预览的推荐头像
        croppaImg: null,  //当前个性头像croppa对象
        initialImg: null, //初始化个性头像对象

        bgImgSrc: require("@/assets/img/bg/home-bg.png"), //背景图片
      };
    },
    methods: {
      //侧边栏折叠或展开
      switchSider() {
        this.$refs['sider'].toggleCollapse();
        this.userSet.isSiderCollapsed = !this.$refs['sider'].value;
        util.cache.set('userSet', this.userSet);
      },
      //显示用户头像模态层
      showUserAvatarModal(){
        //根据当前用户的头像初始化预览头像(系统头像预览与个性头像预览)
        this.initPreviewAvatar();
        this.isShowUserAvatarModal = true;
      },
      //根据当前用户的头像重置预览头像
      initPreviewAvatar() {
        //如果是当前用户的头像是系统推荐头像
        if(this.user.avatarType == code.AVATAR_TYPE_SUG){
          //切换tabs至系统推荐头像tab
          this.userAvatarActiveTabPaneName = 'sug';
          //不是个性头像利用initialImg将croppaImg清空
          this.initialImg = null;
          //刷新个性头像croppa
          this.croppaImg.refresh();
          code.SUG_AVATAR_LIST.forEach((item, index) => {
            if(item.code == this.user.avatar){
              //回显系统推荐头像
              this.sugPreviewAvatar = item;
            }
          })
        }else{
          //切换tabs至个性头像tab
          this.userAvatarActiveTabPaneName = 'self';
          //不是系统推荐头像则将sugPreviewAvatar设为默认的第一个
          this.sugPreviewAvatar = code.SUG_AVATAR_LIST[0];
          //利用initialImg设置croppaImg对象
          let avatar = new Image();
          avatar.src = this.user.avatar;
          avatar.setAttribute('crossorigin', 'anonymous');
          this.initialImg = avatar;
          //刷新回显个性头像
          this.croppaImg.refresh();
        }
      },
      //更换头像
      changeAvatar() {
        let avatarType = null;
        let avatar = null;
        if(this.userAvatarActiveTabPaneName == 'sug'){
          avatarType = code.AVATAR_TYPE_SUG;
          avatar = this.sugPreviewAvatar.code;
        }else if(this.userAvatarActiveTabPaneName == 'self'){
          avatarType = code.AVATAR_TYPE_SELF;
          //通过croppa对象转出图片base64
          avatar = this.croppaImg.generateDataUrl('image/png', 1);
          //如果转出的base64为空证明没有选择图片
          if(!avatar){
            this.$Message.warning("请先选择图片");
            return;
          }
        }
        let reqObj = {
          userId: this.user.userId,
          avatarType: avatarType,
          avatar: avatar
        }
        console.log(reqObj);
        //请求更新用户信息
        this.isShowChangeAvatarLoading = true;
        util.http.post('user/update', reqObj).then((res) => {
          this.isShowChangeAvatarLoading = false;
          console.log(res.data);
          if(res.data.result){
            this.isShowUserAvatarModal = false;
            this.$Message.success("更换头像成功");
            //更新user
            util.object.copyFieldValue(this.user, reqObj);
            util.cache.set('user', this.user);
          }else{
            this.$Message.warning("更换头像失败");
          }
        })
      },

      //退出登陆
      loginOut(){
        this.alertObj.icon = 'sad-outline';
        this.alertObj.desc = '确定要离开吗？';
        this.alertObj.confirmDesc = '我意已决';
        this.alertObj.cancelDesc = '等等吧';
        this.alertObj.confirmCb = () => {
          //清除用户缓存
          util.cache.removeItem('user');
          this.go('/user/loginAndRegister');
        };
        this.isShowUserPoptip = false;
        this.isShowAlert = true;
      },
      // -----------handler----------- //
      //用户头像tabs点击事件
      handleUserAvatarTabClick(name){
        this.userAvatarActiveTabPaneName = name
      },
      //拖入非图片
      handleCroppaFileTypeMismatch(){
        this.$Message.warning("拖入图片以外的东西是不合法的哦");
      }
    },
    computed: {
      //旋转图标
      rotateIcon() {
        return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
      },
      //折叠classes
      menuitemClasses() {
        return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
      },
      //用户头像
      avatar() {
        let avatar = '';
        if(this.user.avatarType == code.AVATAR_TYPE_SUG){  //推荐头像
          code.SUG_AVATAR_LIST.forEach((item, index) => {
            if(item.code == this.user.avatar){
              avatar = item.desc;
            }
          })
        }else{  //自定义头像avatar直接为base64
          avatar = this.user.avatar;
        }
        return avatar;
      },
    },
    mounted() {
      if (util.cache.get("user")) {
        this.user = util.cache.get("user");
        this.userSet = util.cache.get("userSet");
        //根据用户设置还原页面
        //sider折叠情况还原
        if(this.userSet.isSiderCollapsed){
          this.$refs['sider'].toggleCollapse();
        }
      } else {
        //没有登陆信息缓存跳转到登陆页面
        this.go("/user/loginAndRegister");
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/css/vars.scss";
  $mainLayoutWidth: 95%;
  $mainLayoutHeight: 90%;
  .main-layout {
    width: $mainLayoutWidth;
    height: $mainLayoutHeight;
    min-width: 1100px;
    min-height: 400px;
    position: fixed;
    top: 5%;
    left: calc(50% - #{$mainLayoutWidth / 2});
    opacity: $base-opacity;
  }

  /*--------------slide开始--------------*/
  .menu-icon {
    transition: all .3s;
  }
  .rotate-icon {
    transform: rotate(-90deg);
  }
  //slider展开形态
  .menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  //slider折叠形态
  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
  .collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
  }
  /*--------------slide结束--------------*/

  /*--------------layout开始--------------*/
  .layout{
  }
  //layout头部
  .layout-header {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }
  //layout内容
  .layout-content {
    height: 100%;
    position: relative;
    padding: 10px;
  }
  //面包屑
  .content-breadcrumb{
    height: 20px;
    line-height: 20px;
    font-size: 13px;
  }
  //主内容card
  .content-card{
    width: 100%; 
    height: calc(100% - 30px); 
    margin-top: 10px;
  }
  /*--------------layout结束--------------*/

  /*--------------用户简介开始--------------*/
  .user-intro{
    float: right;
  }
  .user-intro .username{
    margin-left: 5px;
    font-size: 13px;
  }
  .user-intro .username:hover{
    color: $base-blue;
  }
  .user-intro-detail{
    width: 200px;
  }
  /*--------------用户简介结束--------------*/

  /*--------------用户头像模态层开始--------------*/
  .modal-header{
    color: $base-black;
  }
  .sug-avatar-wrap{
    width: 240px;
    height: 240px;
    float: left;
  }
  .sug-avatar{
    display: block;
    float: left;
    width: 70px;
    height: 70px;
    margin: 5px;
    border-radius: 3px;
  }
  .sug-avatar:hover {
    cursor: pointer;
    box-shadow: 0px 0px 10px 1.5px $base-blue;
  }
  .active-sug-avatar{
    box-shadow: 0px 0px 10px 1.5px $base-blue;
  }

  .avatar-preview{
    float: left;
    position: relative;
    width: 200px;
    height: 240px;
  }
  .avatar-preview img{
    margin: 20px 25px 0;
    width: 150px;
    height: 150px;
    border-radius: 5px;
  }
  .preview-tips{
    color: $base-black;
    letter-spacing: 1px;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
  }
  .croppa-wrap{
    width: 240px;
    height: 240px;
    margin: 0 auto;
    display: flex;
  }
  /*--------------用户头像模态层结束--------------*/

  .alert{
    width: 30%;
    min-width: 200px;
    margin: 200px auto;
  }
</style>
