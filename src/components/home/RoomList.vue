<template>
  <div class="wrap">
    <Breadcrumb separator=">" class="content-breadcrumb">
      <BreadcrumbItem to="/home/gameList"><Icon type="home"></Icon> 游戏大厅</BreadcrumbItem>
      <BreadcrumbItem><Icon :type="game.icon"></Icon> <span v-html="game.name"></span></BreadcrumbItem>
    </Breadcrumb>
    <Card class="content-card" :dis-hover="true">
      <div class="common-item" :key="index" v-for="(item, index) in roomList" @click="goToRoom(item)">
        <h4>
          <label>房号</label>
          <span>{{item.roomId}}</span>
        </h4>
        <p>
          <label>描述</label>
          <span>{{item.roomInfo}}</span>
        </p>
        <div class="user-avatar-wrap">
          <img :src="avatar(user)" class="user-avatar" v-if="userIndex < 4" :key="userIndex" v-for="(user, userIndex) in item.userList"/>
          <div class="user-count">
            <img src="../../assets/img/icon/wanjia.png" class="wanjia-icon"> 
            <span>{{item.userList.length}}</span>
          </div>
        </div>
        <img src="../../assets/img/icon/tuding.png" class="tuding-icon">
      </div>

      <div class="btn-bar">
        <Button type="primary" icon="android-add" size="small" @click="isShowAddRoomModal = true">创建房间</Button>
      </div>
    </Card>

    <!-- 创建房间模态层 -->
    <Modal v-model="isShowAddRoomModal" width="300px" :styles="{top: '100px'}">
      <p slot="header" class="modal-header center">
        <Icon type="ios-game-controller-b"></Icon>
        <span>创建房间</span>
      </p>
      <div>
        <Form ref="roomObj" :model="roomObj" :label-width="80">
          <Input v-model="roomObj.roomInfo" icon="chatbubble-working" placeholder="输入房间描述..." />
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="createRoom">创建</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'roomList',
  data () {
    return {
      ws: null,
      user: {},
      game: {}, //当前房间列表的对应游戏对象
      roomList: [], //当前的房间列表
      isShowAddRoomModal: false,  //是否显示添加房间模态层
      roomObj: {  //当前创建房间对象
        roomGameCode: null, //当前房间游戏编号
        roomInfo: null,  //房间描述
        roomCreaterId: null //当前房间创建者ID
      }
    }
  },
  methods: {
    //创建房间
    createRoom(){
      this.roomObj.roomGameCode = this.game.code;
      this.roomObj.roomInfo = this.roomObj.roomInfo ? this.roomObj.roomInfo : `快来和我一起玩${this.game.name}吧~`;
      this.roomObj.roomCreaterId = this.user.userId;
      //发送创建房间请求
      util.websocket.send(this.ws, 'createRoom', this.roomObj);
      this.isShowAddRoomModal = false;
    },
    //进入房间
    goToRoom(item){
      //获取当前房间的gameCode
      let roomGameCode = item.roomGameCode;
      //根据game码表找到game对应的页面路径进行相应的页面跳转
      code.GAME_LIST.forEach((codeItem, index) => {
        if(codeItem.code == roomGameCode){
          this.goWithQuery(codeItem.path, {
            roomId: item.roomId
          })
        }
      })
    },
    //用户头像
    avatar(user) {
      let avatar = '';
      if(user.avatarType == code.AVATAR_TYPE_SUG){  //推荐头像
        code.SUG_AVATAR_LIST.forEach((item, index) => {
          if(item.code == user.avatar){
            avatar = item.desc;
          }
        })
      }else{  //自定义头像avatar直接为base64
        avatar = user.avatar;
      }
      return avatar;
    },

    // -----------ws相关----------- //
    //ws准备就绪
    wsOpenSuccess(msgObj){
      //请求房间数据
      util.websocket.send(this.ws, 'getRoomList');
    },
    //有用户进入房间，更新对应的房间对象
    wsUserEnterRoom(msgObj){
      this.roomList.forEach((item, index) => {
        if(item.roomId == msgObj.roomId){
          item.userList.push(msgObj.user);
        }
      })
    },
    //有用户离开房间，更新对应的房间对象
    wsUserLeaveRoom(msgObj){
      this.roomList.forEach((item, index) => {
        //找到用户离开的房间
        if(item.roomId == msgObj.roomId){
          //获取用户列表
          let userList = item.userList;
          for(let i = 0; i < userList.length; i++){
            //找到离开的用户并删除
            if(userList[i].userId == msgObj.userId){
              userList.splice(i, 1);
              return;
            }
          }
        }
      })
    },
    //房间关闭
    wsRoomClose(msgObj){
      //找到对应的房间并删除
      for(let i = 0; i < this.roomList.length; i++){
        let item = this.roomList[i];
        if(item.roomId == msgObj.roomId){
          this.roomList.splice(i, 1);
          return;
        }
      }
    },
    //获取房间列表ws消息
    wsGetRoomList(msgObj){
      this.roomList = msgObj.roomList;
    },
    //创建房间ws消息
    wsCreateRoom(msgObj){
      let createRoom = msgObj.room;
      this.roomList.push(createRoom);
      if(createRoom.roomCreaterId == this.user.userId){
        this.goToRoom(createRoom);
      }
    },
    //初始化websocket
    initWs(roomGameCode) {
      this.ws = new WebSocket(`${globalConfig.wssRootUrl}?userId=${this.user.userId}&path=roomList&roomGameCode=${roomGameCode}`);
      this.ws.onopen = (e) => {
        console.log("websocket 连接开启");
      }
      this.ws.onmessage = (e) => {
        let handlerMsgObj = {
          openSuccess: this.wsOpenSuccess,
          userEnterRoom: this.wsUserEnterRoom,
          userLeaveRoom: this.wsUserLeaveRoom,
          roomClose: this.wsRoomClose,
          getRoomList: this.wsGetRoomList,
          createRoom: this.wsCreateRoom,
        }
        util.websocket.handlerMsg(handlerMsgObj, e.data);
      }
      this.ws.onclose = (e) => {
        console.log(e);
        console.log("websocket 连接关闭");
      }
      this.ws.onerror = () => {
        console.log("websocket 连接出错");
      }
    }
  },
  mounted() {
    this.$Loading.start();
    setTimeout(() => {
      this.$Loading.finish();
    }, 300)
    //从gameList中找到对应的游戏给game对象赋值
    let gameCode = this.getRouterDataObj().gameCode;
    code.GAME_LIST.forEach((item, index) => {
      if(item.code == gameCode){
        this.game = item;
      }
    })
    //初始化user
    this.user = util.cache.get('user');
    //初始化wS
    this.initWs(gameCode);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/vars.scss";
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
//按钮组
.btn-bar{
  position: absolute;
  right: 0;
  top: -30px;
}

/*--------------添加房间模态层开始--------------*/
.modal-header{
  color: $base-black;
}
/*--------------添加房间模态层结束--------------*/

/*--------------common-item开始--------------*/
.common-item{
  background: linear-gradient(#7AB2FF, #A1C8FF);
  padding: 10px;
  color: white;
}
.common-item h4{
  font-size: 15px;
  height: 25px;
  line-height: 25px;
  font-weight: normal;
}
.common-item p{
  font-size: 13px;
  line-height: 20px;
  height: 20px;
}
.common-item label {
  display: block;
  cursor: pointer;
  float: left;
  width: 30%;
}
.common-item span {
  float: left;
  width: 60%;
}
.common-item p span{
  line-height: 20px;
  height: 40px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
}
//用户头像列表
.user-avatar-wrap{
  clear: both;
  height: 30px;
}
.user-avatar-wrap .user-avatar{
  float: left;
  margin-top: 2.5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: -8px;
}
.user-count{
  float: right;
  width: 30px;
  height: 30px;
  line-height: 30px;
}
.user-count .wanjia-icon{
  float: left;
  width: 13px;
  height: 13px;
  margin: 8.5px 5px 0 0;
}
.user-count span{
  float: left;
  width: 10px;
  text-align: center;
  font-size: 13px;
}
.tuding-icon{
  position: absolute;
  top: -10px;
  left: -7px;
  width: 20px;
  height: 20px;
}
/*--------------common-item结束--------------*/
</style>
