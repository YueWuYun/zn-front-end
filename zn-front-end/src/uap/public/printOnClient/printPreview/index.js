import React from "react";
import ReactDOM from "react-dom";
import formPreviewPrint from "./formPreviewPrint";
import {ajax,toast,getMultiLang} from "nc-lightapp-front";
import { getStorage } from "../PrintPreviewModal/storageMethod";
export default function(newProps, queryUrl, queryData, searchTemplate = true, call) {
  let callback = (json, status) => {
    if (status) {
      printInFunc(newProps, queryUrl, queryData, searchTemplate, call, json);
    } else {
      console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
    }
    
  };
  getMultiLang({ 'moduleId': 'contains_printOnClient', callback });
}

const printInFunc = (newProps, queryUrl, queryData, searchTemplate, call, json) => {
  let {ncclouPrintSetting} = queryData;
  if(ncclouPrintSetting && ncclouPrintSetting.printTemplateID) {
    formPreview(newProps, queryUrl, {
      ...queryData,
      printTemplateID: searchTemplate ? ncclouPrintSetting.printTemplateID : queryData.printTemplateID,
      printSetting: JSON.stringify(ncclouPrintSetting)
    }, call, json)
  }else if(searchTemplate) {
    queryTemplate(newProps, queryUrl, queryData, call, json);
  }else {
    formPreview(newProps, queryUrl, queryData, call, json);
  } 
}


function queryTemplate(newProps, queryUrl, queryData, call, json) {
  let printTemplateID = null;
  ajax({
    method: "post",
    url: "/nccloud/platform/print/queryTemplates.do",
    data: queryData,
    // mode: "normal",
    // print: true,
    success: res => {
      const {success, data} = res;

      // if (gzip) {
      //   list = gziptools.unzip(list);
      // }
      if(success) {
        if(!data || !data.length){
          return toast({
            color: "warning",
            content: json["index_048"]
          });
        }else {
          printTemplateID = data[0]["m_ctemplateid"]
            ? data[0]["m_ctemplateid"]
            : null;
          formPreview(newProps, queryUrl, {
            ...queryData,
            printTemplateID: printTemplateID
          }, call, json)
        }
      }

    },
    // error: res => {
    //   toast({ color: "danger", content: res.message });
    // }
  });
}

function formPreview(newProps, queryUrl, queryData, call, json) {
  formPreviewPrint({
    newProps: newProps,
    params: {...queryData, 
      realData: queryData.realData || false,
      download: "preview"
    },
    url: queryUrl,
    enctype: 2
  },call, json)
}