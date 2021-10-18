import {toast} from "nc-lightapp-front";
export default function(newProps, queryUrl, queryData, json) {
  let websocket= null;
  return new Promise( (resolve, reject) => {
    if (websocket != null && websocket.readyState == 1) {
      toast({ color: "warning", content: json["index_043"] });
    } else {
      if("WebSocket" in window) {
        websocket = null;
        //客户端ip地址
        let ws = new WebSocket(`ws://${queryData.socketIp || '127.0.0.1'}:9999/websocket`);
  
        //连接成功的方法.
        ws.onopen = function(event) {
          console.log("连接成功");
        };
  
        //连接关闭.
        ws.onclose = function(event) {
          console.log("关闭连接");
        };
  
        //连接异常.
        ws.onerror = function(event) {
          // 客户端未安装
          newProps.openTo("/uap/printExeDown/ExeDownload/main/index.html?pk_message=dd", { 
            appcode: queryData.appcode, pagecode: queryData.pagecode,actionUrl:queryUrl});
          return resolve("error");
        };
  
        ws.onmessage = (msg) => {//ws接口数据真实可用的只有打印机列表字段
          console.log("msg",JSON.parse(msg.data))
          let obj = {};
          if(msg && (Object.keys(msg).length || msg.data)) {
            ws.close();
            obj.nccloudPrinterList = JSON.parse(msg.data).nccloudPrinterList;
            return resolve(obj);
          }
        };
        let data = {};
        let timer = setInterval(function() {
          if(ws.readyState == WebSocket.OPEN) {
            clearInterval(timer);
            data = Object.assign({}, queryData, {
              compalteAddress: queryUrl,
              type: "2",
              nccloudsessionid: queryData.nccloudsessionid
            });
            let infoStr= JSON.stringify(data);
            ws.send(infoStr);
          }
        }, 1000) 
      }else {
        toast({ color: "warning", content: json["index_046"] });
      }
    }
  })
  
}