<template>
  <div>
    {{room.roomId}}
  </div>
</template>

<script>
export default {
  name: 'youDrawIGuess',
  data () {
    return {
      ws: null,
      user: {},
      room: {}
    }
  },
  methods: {
    // -----------ws相关----------- //
    //ws准备就绪
    wsOpenSuccess(msgObj){
      // 请求房间数据
      util.websocket.send(this.ws, 'getRoomDetail');
    },
    //获取房间详情ws消息
    wsGetRoomDetail(msgObj){
      console.log(msgObj);
      if(msgObj.room){
        this.room = msgObj.room;
      }else{
        this.$Message.warning("当前房间不存在");
        this.back();
      }
    },
    //初始化websocket
    initWs(roomId) {
      this.ws = new WebSocket(`${globalConfig.wssRootUrl}?userId=${this.user.userId}&path=room&roomId=${roomId}`);
      this.ws.onopen = (e) => {
        console.log("websocket 连接开启");
       
      }
      this.ws.onmessage = (e) => {
        let handlerMsgObj = {
          openSuccess: this.wsOpenSuccess,
          getRoomDetail: this.wsGetRoomDetail
        }
        util.websocket.handlerMsg(handlerMsgObj, e.data);
      }
      this.ws.onclose = (e) => {
        console.log("websocket 连接关闭");
      }
      this.ws.onerror = () => {
        console.log("websocket 连接出错");
      }
    }
  },
  mounted() {
    //初始化user
    this.user = util.cache.get('user');
    //从路由中获取roomId
    let roomId = this.getRouterDataObj().roomId;
    //初始化wS
    this.initWs(roomId);
  }
}
</script>

<style lang="scss" scoped>
</style>
