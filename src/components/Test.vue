<template>
  <div>
    <Button type="info" @click="send">Info</Button>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      ws: null,
    }
  },
  methods: {
    send(){
      this.ws.send(JSON.stringify({
        msgType: 'getRoomList',
        desc: '666'
      }));
    }
  },
  mounted() {
    this.ws = new WebSocket('ws://127.0.0.1:8889/?userId=qwd92&path=roomList');
    this.ws.onopen = (e) => {
      this.$Message.success({
        content: '成功加入房间'
      });
    }
    this.ws.onclose = (e) => {
      console.log("websocket 服务器关闭");
    }
    this.ws.onerror = () => {
      console.log("websocket 连接出错");
    }
    this.ws.onmessage = (e) => {
      console.log("收到服务器的消息：", e.data);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
