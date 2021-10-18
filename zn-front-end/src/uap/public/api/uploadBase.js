import {
  createPage,
  base,
  ajax,
  page,
  formDownload,
  getMultiLang
} from "nc-lightapp-front";

const getImportConfig = (queryUrl, queryData, call) => {
  let excelimportconfig = {
    name: "file",
    showUploadList: false,
    action: queryUrl || "/nccloud/uapdr/trade/excelimport.do",
    headers: {
      authorization: "authorization-text"
    },
    data: queryData
  };
  console.log(111111111)
  excelimportconfig.NcUploadOnChange = (info, dataParma) => {
    let response = info.file.response;

    if (info.file.status === "done") {
      let receiveData = response.data || response; //或者后面的处理供应链错误信息直接放在error里
      if (receiveData.success) {
        call(receiveData.success, true);
      }
      if (receiveData.error) {
        call(receiveData.error, false);
      }
      console.log(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      console.log(`${info.file.name} file upload failed.`);
    }
  };

  return { ...excelimportconfig };
};

const getErrorList = arr => {
  let lineLogs;
  if (Object.prototype.toString.call(arr).slice(8, -1) === "Array") {
    lineLogs = arr.map(item => {
      return item.linelog;
    });
  } else {
    lineLogs = [arr.message];
  }
  return lineLogs;
};

const uploadBase = (
  params = {
    queryUrl: "",
    queryData: {}
  },
  call
) => {
  let IKnow, expand, tipsHide, importSucc;
  const { queryUrl, queryData } = params;
  //多语获取
  // let callback = (json, status, intl) => {
  //   if (status) {
  //     (IKnow = json["1880000025-000002"]), //我知道
  //       (expand = json["1880000025-000000"]), //展开
  //       (tipsHide = json["1880000025-000001"]), //收起
  //       (importSucc = json["1880000025-000003"]); //导入成功，请刷新界面
  //   }
  // };

  // getMultiLang({ moduleId: "contains_excelImport", callback });

  return getImportConfig(queryUrl, queryData, (resultinfo, isSuccess) => {
    if (
      (Object.prototype.toString.call(resultinfo) === "[object Array]" &&
        resultinfo.length) ||
      Object.prototype.toString.call(resultinfo) === "[object Object]"
    ) {
      const ErrorList = getErrorList(resultinfo);
      if (isSuccess) {
        toast({
          duration: 500,
          groupOperationMsg: ErrorList,
          groupOperation: true,
          TextArr: [expand, tipsHide, IKnow],
          color: "success"
        });
      } else {
        toast({
          duration: 500,
          // content: ErrorList,
          groupOperationMsg: ErrorList,
          groupOperation: true,
          TextArr: [expand, tipsHide, IKnow],
          color: "danger"
        });
      }
    } else if (resultinfo == "success" || resultinfo === true) {
      toast({
        duration: 500,
        content: importSucc,
        color: "success"
      });
    } else if (
      Object.prototype.toString.call(resultinfo) === "[object String]"
    ) {
      toast({
        duration: 500,
        content: resultinfo,
        color: "info"
      });
    }
    //成功操作回调
    if (call && typeof call == "function") {
      call("importDone");
    }
  });
};

export default uploadBase;
