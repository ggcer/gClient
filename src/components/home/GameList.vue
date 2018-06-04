<template>
  <div class="wrap">
    <Breadcrumb separator=">" class="content-breadcrumb">
      <BreadcrumbItem><Icon type="home"></Icon> 游戏大厅</BreadcrumbItem>
    </Breadcrumb>
    <Card class="content-card" :dis-hover="true">
      <div class="common-item" :key="index" v-for="(item, index) in gameList" @click="goToRoomList(item)">
        <img :src="item.bgImg" class="common-item-img">
        <p class="common-item-desc">{{item.name}}</p>
        <p class="common-item-add-desc">{{item.desc}}</p>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'gameList',
  data () {
    return {
      gameList: code.GAME_LIST, //游戏列表
    }
  },
  methods: {
    //去对应游戏的房间列表
    goToRoomList(item){
      this.$Loading.start();
      this.goWithQuery('/home/roomList', {
        gameCode: item.code
      });
    }
  },
  mounted() {
    this.$Loading.start();
    setTimeout(() => {
      this.$Loading.finish();
    }, 300)
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

/*--------------card开始--------------*/
.common-item-img{
  width: calc(100% + 0.5px);
  height: 100px;
  border-radius: 6px 6px 0 0;
}
.common-item-tip{
  position: absolute;
  left: 0;
  top: 80px;
  width: calc(100% + 0.5px);
  height: 20px;
  line-height: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 12px;
  text-align: right;
  padding-right: 8px;
}
.common-item-tip-icon{
  width: 13px;
  height: 13px;
  vertical-align: middle;
}
.common-item-desc{
  padding: 0 10px;
  letter-spacing: 1px;
  font-size: 14px;
  line-height: 30px;
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: $base-black;
}
.common-item-add-desc{
  padding: 0 10px 5px;
  font-size: 13px;
  line-height: 20px;
  color: $base-gray;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  overflow: hidden;
}
/*--------------card结束--------------*/
</style>
