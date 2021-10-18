import React from "react";
import ReactDOM from "react-dom";
import {ajax,toast,Cipher,print,getMultiLang} from "nc-lightapp-front";
import {getStorage} from "../PrintPreviewModal/storageMethod";
import printerPreview from "../printPreview";
import { isWindowSystem } from "../PrintPreviewModal/method";
const {opaqueDecrypt} = Cipher;
export default function(newProps, queryUrl, queryData, searchTemplate = true) {
  if (!isWindowSystem()) {
    //临时方案，mac电脑使用浏览器自带的打印
    print(
      "pdf", //支持两类: 'html'为模板打印, 'pdf'为pdf打印
      queryUrl, //后台服务url
      {
        ...queryData,
        // funcode: queryData.funcode,
        // appcode: queryData.appcode, //小应用编码
        // nodekey: queryData.nodekey, //模板节点标识
        // oids: queryData.oids, // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
        sysType: isWindowSystem() ? "1" : "2"
      },
      searchTemplate
    );
    return;
  } else {
    let callback= (json, status) =>{
    
      if (status) {
        getSessionId(newProps, queryUrl, queryData, searchTemplate, json);
      } else {
        console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
      }
    }
    getMultiLang({ 'moduleId': 'contains_printOnClient', callback });
  }
}

const getSessionId = (newProps, queryUrl, queryData, searchTemplate, json) => {
  ajax({
    url: "/nccloud/riart/printtool/sessionid.do",
    data: {
      printTemplateID: queryData.printTemplateID,
      nodekey: queryData.nodekey,
      appcode: queryData.appcode,
      num: "1"
    },
    success: res => {
      const {success,data} = res;
      if(!success) {
        toast({color: "error", content: json["index_047"]});//"数据查询失败"
        return ;
      }
      let ncclouPrintSetting = null;
      if(data.asid && getStorage(data.asid)) {
        ncclouPrintSetting = JSON.parse(getStorage(data.asid)).toEndInfo;
      }
      const transData = {
        ...queryData,
        nccloudsessionid: data.sessionid,
        ncclouPrintSetting,
        asid: data.asid,
        isPrinterView: false,//是否是打印，默认true
        searchTemplate,
        authority: data.authority
      };
      previewPrint(newProps, queryUrl, transData, searchTemplate, json);
    },
    error: res => {
      console.error(res.message);
    }
  });
};

//预览点击确定并打印
const previewPrint = (newProps, queryUrl, queryData, searchTemplate, json) => {
  printerPreview(newProps, queryUrl, queryData, searchTemplate, (info) => {
    let ncclouPrintSetting = queryData.ncclouPrintSetting;
    if(queryData.asid && getStorage(queryData.asid)) {
      ncclouPrintSetting = JSON.parse(getStorage(queryData.asid)).toEndInfo ;
    }
    if(!queryData.authority) {
      toast({color: "warning", content: json["index_051"]});//"训练盘无权打印"
      return ;
    }
    printClient(newProps, queryUrl, {
      ...queryData,
      ...info,
      ncclouPrintSetting,
      type: "1"
    },
    json)
  }) 
}

let newWin = null;

//已有模板直接打印
const printClient = (newProps, queryUrl, queryData, json) => {
  let websocket = null;
  let beginUrl = queryData.beginUrl || `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  let aeskey = opaqueDecrypt(localStorage.getItem("cowboy"));
  let rockin = localStorage.getItem("rockin") || false;
  if (websocket != null && websocket.readyState == 1) {
    toast({ color: "warning", content: json["index_043"] });//"不能重复连接"
  } else {
    if ("WebSocket" in window) {
      websocket = null;
      //客户端ip地址
      let ws = new WebSocket(`ws://${queryData.socketIp || '127.0.0.1'}:9999/websocket`);

      //连接成功的方法.
      ws.onopen = function(event) {
        console.log("连接成功");
        newWin = window.open("");
        newWin.document.title = json["index_049"];//"打印状态反馈"
        let onStr = `<div><h2 style='border-bottom: 1px solid #ddd;padding: 10px 0'>${json["index_050"]}</h2>
          <div style="width: 560px; margin: 0 auto; position: relative;">
            <div style="display:inline-block; text-align:center;">
              <p><img style="width: 34px; height: 34px;" src="https://images.gitee.com/uploads/images/2019/0314/110540_e2d0849a_919028.png"/></p>
              <span>${json["index_058"]}</span>
            </div>
            <p style="width:180px; border-bottom: 1px solid #ddd;position: absolute; top: 23px; left: 48px;"></p>
            <div style="display:inline-block; text-align:center; margin-left: 150px;">
              <p><img style="width: 40px; height: 40px;" src="https://images.gitee.com/uploads/images/2019/0314/110508_a5f9c80c_919028.png"/></p>
              <span>${json["index_059"]}</span>
            </div>
            <p style="width:180px; border-bottom: 1px solid #ddd;position: absolute; top: 23px; left: 286px;"></p>
            <div style="display:inline-block; text-align:center; margin-left: 150px;"">
              <p><img style="width: 34px; height: 34px;" src="https://images.gitee.com/uploads/images/2019/0314/110518_e60c0d16_919028.png"/></p>
              <span>...</span>
            </div>
          </div>
        </div>    
        `;
        newWin.document.body.innerHTML = onStr;
         
      };

      //连接关闭.
      ws.onclose = function(event) {
        console.log("关闭连接");
      };

      //连接异常.
      ws.onerror = function(event) {
        // 客户端未安装
        newProps.openTo(
          "/uap/printExeDown/ExeDownload/main/index.html?pk_message=dd",
          {
            appcode: queryData.appcode,
            pagecode: queryData.pagecode,
            actionUrl: queryUrl
          }
        );
      };

      ws.onmessage = msg => {
        let sucessStr = `<div><h2 style='border-bottom: 1px solid #ddd;padding: 10px 0'>${json["index_050"]}</h2>
          <div style="width: 560px; margin: 0 auto; position: relative;">
            <div style="display:inline-block; text-align:center;">
              <p><img style="width: 34px; height: 34px;" src="https://images.gitee.com/uploads/images/2019/0314/110540_e2d0849a_919028.png"/></p>
              <span>${json["index_058"]}</span>
            </div>
            <p style="width:180px; border-bottom: 1px solid #ddd;position: absolute; top: 23px; left: 48px;"></p>
            <div style="display:inline-block; text-align:center; margin-left: 150px;">
              <p><img style="width: 40px; height: 40px;" src="https://images.gitee.com/uploads/images/2019/0314/110508_a5f9c80c_919028.png"/></p>
              <span>${json["index_059"]}</span>
            </div>
            <p style="width:180px; border-bottom: 1px solid #ddd;position: absolute; top: 23px; left: 286px;"></p>
            <div style="display:inline-block; text-align:center; margin-left: 102px;"">
              <p><img style="width: 34px; height: 34px;" src="https://images.gitee.com/uploads/images/2019/0314/110533_f85d3142_919028.png"/></p>
              <span>${json["index_061"]}</span>
            </div>
          </div>
        </div>    
        `;
        let errorStr = `<div><h2 style='border-bottom: 1px solid #ddd;padding: 10px 0'>${json["index_050"]}</h2>
          <div style="width: 560px; margin: 0 auto; position: relative;">
            <div style="display:inline-block; text-align:center;">
              <p><img style="width: 34px; height: 34px;" src="https://images.gitee.com/uploads/images/2019/0314/110540_e2d0849a_919028.png"/></p>
              <span>${json["index_058"]}</span>
            </div>
            <p style="width:180px; border-bottom: 1px solid #ddd;position: absolute; top: 23px; left: 48px;"></p>
            <div style="display:inline-block; text-align:center; margin-left: 150px;">
              <p><img style="width: 40px; height: 40px;" src="https://images.gitee.com/uploads/images/2019/0314/110508_a5f9c80c_919028.png"/></p>
              <span>${json["index_059"]}</span>
            </div>
            <p style="width:180px; border-bottom: 1px solid #ddd;position: absolute; top: 23px; left: 286px;"></p>
            <div style="display:inline-block; text-align:center; margin-left: 96px;"">
              <p><img style="width: 30px; height: 30px;" src="https://images.gitee.com/uploads/images/2019/0314/110526_3b417874_919028.png"/></p>
              <span>${json["index_060"]}</span>
            </div>
          </div>
        </div>    
        `;
        if (msg && (Object.keys(msg).length || msg.data)) {
          ws.close();//打印状态
          newWin.document.body.innerHTML = msg.data.includes(json["index_056"]) ? sucessStr : errorStr;
        }
      };
      let data = {};
      let timer = setInterval(function() {
        if (ws.readyState == WebSocket.OPEN) {
          clearInterval(timer);
          data = Object.assign({}, queryData, {
            compalteAddress: queryUrl,
            type: queryData.type,
            nccloudsessionid: queryData.nccloudsessionid,
            download: null,
            beginUrl,
            aeskey,
            rockin,
          });
          if (localStorage.getItem(queryData.printTemplateID)) {
            data.ncclouPrintSetting = JSON.parse(
              localStorage.getItem(data.printTemplateID)
            ).toEndInfo;
          }
          let infoStr = JSON.stringify(data); //可以将js
          ws.send(infoStr);
        }
      }, 1000);
    } else {
      toast({ color: "warning", content: `${json["index_057"]}websocket`});
    }
  }
};
