/* ------------------------------------------websocket工具类------------------------------------------ */
const websocket = {
  //发送ws信息
  send(wsList, msgType, param){
    let sendObj = {
      msgType: msgType,
      ...param
    }
    //如果是数组(群发)
    if(wsList.length){
      wsList.forEach((item, index) => {
        item.send(JSON.stringify(sendObj));
      })
    }else{
      wsList.send(JSON.stringify(sendObj));
    }
  },
  //处理ws信息(处理列表，发送过来的信息)
  handlerMsg(handlerMsgObj, msg){
    let msgObj = JSON.parse(msg);
    console.log(msgObj);
    if(handlerMsgObj[msgObj.msgType]){
      handlerMsgObj[msgObj.msgType](msgObj);
    }
  }
}

export default websocket