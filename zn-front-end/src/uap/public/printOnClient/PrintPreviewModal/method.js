import {getStorage, setStorage} from './storageMethod';
import {deepClone} from "nc-lightapp-front";
//打印机列表
const generatePrintNameList = (data) => {
  let arr= [];
  if(!data.nccloudPrinterList.length) {
    return arr;
  }
  data.nccloudPrinterList.forEach( (item) => {
    arr.push({
      display: item.printerName,
      value: item.printerId
    })
  })
  return arr;
}

//空数组校验
const isEmptyArr = (arr = []) => {
  if(Object.prototype.toString.call(arr).slice(8, -1) !== "Array") {
    return true;
  }
  return !arr.length
}

//查找当前打印机对应的list中当前打印机信息
function findCurrListPrintByName(data,currPrinter) {
  let obj = {};
  if(isEmptyArr(data.nccloudPrinterList)) {
    return obj;
  }
  obj = data.nccloudPrinterList.find( (item) => {
    return item.printerName == currPrinter.printerName
  });
  return obj;
}

//查找当前打印机对象
function findCurrPrinterNameObjById(data, printerId) {
  let currPrinterNameObj = {};
  if((!printerId && !data.currentNCCloudPrinter) || (!printerId && !data.currentNCCloudPrinter.printerName)) {
    currPrinterNameObj = data.nccloudPrinterList[0];
  }else if(!printerId && data.currentNCCloudPrinter) {
    currPrinterNameObj = findCurrListPrintByName(data, data.currentNCCloudPrinter);
  }else if(printerId){
    currPrinterNameObj = data.nccloudPrinterList.find( (item) => {
      return printerId === item.printerId
    });
  }
  return currPrinterNameObj;
}

//当前打印机详情信息
function generateCurrentPrintMachine(data, printerId) {
  let obj = {};
  const currPaperNameObj = findCurrPrinterNameObjById(data, printerId);
  obj = {
    printerStatus: currPaperNameObj.printerStatus,
    twoSide: currPaperNameObj.twoSide,
    printerName: currPaperNameObj.printerName,
    printerId: currPaperNameObj.printerId,
    paperSourceId: !isEmptyArr(currPaperNameObj.nccloudPaperResourceList) ? currPaperNameObj.nccloudPaperResourceList[0].paperSourceId : "",
    paperSourceName: !isEmptyArr(currPaperNameObj.nccloudPaperResourceList) ? currPaperNameObj.nccloudPaperResourceList[0].paperSourceName : ""
  }
  return obj;
}

//当前纸张来源对象
function generateCurrPaperResource(data, paperSourceId) {
  let printerId = this.state.currentNCCloudPrinter.printerId;
  const currPaperNameObj = findCurrPrinterNameObjById(data, printerId);
  let obj = currPaperNameObj.nccloudPaperResourceList.find( (item) => {
    return paperSourceId === item.paperSourceId;
  })
  return obj;
}

//纸张来源列表
function generatePaperResourceList(data, printerId) {
  let arr = [];
  const currPaperNameObj = findCurrPrinterNameObjById(data, printerId);
  if(!currPaperNameObj.nccloudPaperResourceList || !currPaperNameObj.nccloudPaperResourceList.length){
    return arr;
  }
  currPaperNameObj.nccloudPaperResourceList.forEach( (item) => {
    arr.push({
      display: item.paperSourceName,
      value: item.paperSourceId
    })
  })
  
  return arr;
}

//纸张尺寸列表
function generatePaperList(data, printerId="") {
  let arr = [];
  const currPaperNameObj = findCurrPrinterNameObjById(data, printerId);
  if(!currPaperNameObj.paperList || !currPaperNameObj.paperList.length) {
    return arr;
  }
  currPaperNameObj.paperList.forEach( (item) => {
    arr.push({
      display: item.paperName,
      value: item.paperId
    })
  })
  return arr;
}

//纸张设置：当前纸张信息
function generateCurrPaperStyle(data, printerId="", paperId= "") {
  let obj = {};
  const currPaperNameObj = findCurrPrinterNameObjById(data, printerId);
  let initPaperObj = {}
  if(data && data.currentNccloudPaper && !paperId) {
    initPaperObj = data.currentNccloudPaper;
    (isDefinePaper(currPaperNameObj.paperList, initPaperObj)) && (initPaperObj = Object.assign({},initPaperObj, {paperName: "自定义纸张"}));
  }else if(!paperId) {
    initPaperObj = currPaperNameObj.paperList.find( (item) => {
      return "A4 " === item.paperName
    })
  }else {
    initPaperObj = currPaperNameObj.paperList.find( (item) => {
      return paperId === item.paperId
    })
  }
   
  obj = {
    paperHeight: initPaperObj.paperHeight,
    paperId: initPaperObj.paperId,
    paperName: initPaperObj.paperName,
    paperWidth: initPaperObj.paperWidth
  }

  this.setState({
    printSetting: obj
  })

  return obj;
}

const isDefinePaper = (list, obj) => {
  let status = list.some( (item) => {
    return item.paperName === obj.paperName
  })
  return !status;
}

//打印模板option
const generateTemInfoList = (data) => {
  let list = [];
  if(isEmptyArr(data.nccloudTemplateInfoList)) return list;
  data.nccloudTemplateInfoList.forEach( (item) => {
    list.push({
      display: item.templateName,
      value: item.templateId
    })
  })
  return list;
}

//当前打印模板
function generateCurrTemInfo(data) {
  let printTemplateID = "";
  if(this.state.changeTem) {
    printTemplateID = this.state.currPrintTemplateID
  }else if(getStorage(this.state.asid) && !this.state.currPrintTemplateID){
    printTemplateID = JSON.parse(getStorage(this.state.asid)).toEndInfo.printTemplateID;
  }else {
    printTemplateID = this.state.currPrintTemplateID
  }
  let templateInfo = {};
  if(isEmptyArr(data.nccloudTemplateInfoList)) {
    return templateInfo;
  }
  templateInfo = data.nccloudTemplateInfoList[0];
  if(this.state.changeTem || (!this.state.changeTem && getStorage(this.state.asid))) {
    templateInfo = data.nccloudTemplateInfoList.find( (item) => {
      return item.templateId == printTemplateID;
    })
  }else if(printTemplateID) {
    templateInfo = data.nccloudTemplateInfoList.find( (item) => {
      return item.templateId == printTemplateID;
    })
    return templateInfo;
  }else if(data.currentNCCloudTemplateInfo && Object.keys(data.currentNCCloudTemplateInfo).length) {
    return data.currentNCCloudTemplateInfo;
  }else if(!data.nccloudTemplateInfoList.length) {
    return false;
  }
  return templateInfo;
}

//模板类型赋值
function modifyMeta(data, printerId = "") {
  let meta = this.props.meta.getMeta();
  const printNameList = generatePrintNameList(data);
  const paperResourceList = generatePaperResourceList(data, printerId);
  const paperList = generatePaperList(data, printerId);
  const templateList = generateTemInfoList(data);
  meta["printTemplate"].items.map( (item) => {
    if("templateInfoList" === item.attrcode) {
      item.options = templateList;
    }
  })

  meta['printMachine'].items.map( (item) => {
    if('PrinterList' === item.attrcode) {
      item.options = printNameList;
    }
    if('paperResourceList' === item.attrcode) {
      item.options = paperResourceList;
    }
  })
  meta['printStyle'].items.map( (item) => {
    if('paperList' === item.attrcode) {
      item.options = paperList;
    }
  })
  this.props.meta.setMeta(meta);
}

//初始form显示值
function initFormVal(data, printerId="", printTemplateID="") {
  //打印范围需要走前台缓存
  let hashMap = {};
  if(!!this.state.asid && getStorage(this.state.asid)) {
    hashMap = JSON.parse(getStorage(this.state.asid)).info;
  }
  const isEmpty = (obj) =>{
    return !obj || !Object.keys(obj).length;
  }
  let doublesideDisplay = null;
  let doublesideVal = null;
  if(isEmpty(hashMap) || hashMap.doubleside.value === true || hashMap.doubleside.value === 0) {
    doublesideDisplay = this.state.json["index_027"];//"关闭";
    doublesideVal = 0;
  }else if(!hashMap.isDuplex.value) {
    doublesideDisplay = this.state.json["index_028"];//"向左翻页";
    doublesideVal = 1;
  }else if(hashMap.isDuplex.value) {
    doublesideDisplay = this.state.json["index_029"];//"向上翻页";
    doublesideVal = 2;
  }
  const printRangeVal = {
    rows: [{
      values: {
        pageRangeType: {//'所有页面'
          display: isEmpty(hashMap) ? this.state.json["index_000"] : hashMap.pageRangeType.display,
          value: isEmpty(hashMap) ? 0 : hashMap.pageRangeType.value
        },
        pageFrom: {
          value: isEmpty(hashMap) ? 1 : hashMap.pageFrom.value
        },
        pageTo: {
          value: isEmpty(hashMap) ? 1 : hashMap.pageTo.value
        },
        pageWholeType: {//'全部页面'
          display: isEmpty(hashMap) ? this.state.json["index_020"] : hashMap.pageWholeType.display,
          value: isEmpty(hashMap) ? 0 : hashMap.pageWholeType.value
        },
        copies: {
          value: isEmpty(hashMap) ? 1 : hashMap.copies.value
        },
        collated: {
          value: isEmpty(hashMap) ? false : hashMap.collated.value
        },
        doubleside: {
          display: doublesideDisplay,
          value: doublesideVal
        },
      }
    }]
  }

  //初始修改左上翻页的状态
  if(!isEmpty(hashMap) && hashMap.doubleside.value) {
    this.props.form.setFormItemsDisabled("printRange", {isDuplex: false});
  }

  const currentPrintMachine = generateCurrentPrintMachine.call(this,data, printerId);
  initCurrPrinter.call(this, currentPrintMachine);
  initCurrPaperResourc.call(this, currentPrintMachine);
  const currTemInfo = generateCurrTemInfo.call(this, data, printTemplateID);
  const printTemVal = {
    rows: [{
      values: {
        templateInfoList: {
          display: currTemInfo ? currTemInfo.templateName : "",
          value: currTemInfo ? currTemInfo.templateId : ""
        }
      }
    }]
  }

  const printMachineVal = {
    rows: [{
      values: {
        currentNCCloudPrinter: {
          display: '',
          value: 0
        },
        PrinterList: {
          display: currentPrintMachine.printerName,
          value: currentPrintMachine.printerId,
        },
        printerStatus: {
          value: currentPrintMachine.printerStatus
        },
        twoSide: {
          value: currentPrintMachine.twoSide
        },
        paperResourceList: {
          display: currentPrintMachine.paperSourceName,
          value: currentPrintMachine.paperSourceId
        }
      }
    }]
  }

  const paperCurrStyle = generateCurrPaperStyle.call(this, data, printerId);
  const printStyleVal = {
    rows: [{
      values: {
        paperList: {
          display: paperCurrStyle.paperName,
          value: paperCurrStyle.paperId
        },
        paperWidth: {
          value: paperCurrStyle.paperWidth
        },
        paperHeight: {
          value: paperCurrStyle.paperHeight
        },
        nccloudPaperDirect: {//"纵向" : "横向",
          display: data.nccloudPaperDirect ? this.state.json["index_039"] : this.state.json["index_038"],
          value: data.nccloudPaperDirect
        },
        printMode: {
          value: data.printMode == 0 ? false : true
        }
      }
    }]
  }
  //自定义纸张默认放开编辑性
  this.props.form.setFormItemsDisabled("printStyle", {//"自定义纸张"
    paperWidth: this.state.json["index_015"] === paperCurrStyle.paperName ? false : true,
    paperHeight: this.state.json["index_015"] === paperCurrStyle.paperName ? false : true,
  })

  this.props.form.setAllFormValue({printTemplate: printTemVal});
  this.props.form.setAllFormValue({printRange: printRangeVal});
  this.props.form.setAllFormValue({printMachine: printMachineVal});
  this.props.form.setAllFormValue({printStyle: printStyleVal});
}

//初始化打印机信息
function initCurrPrinter(data) {
  let currPrinter = {
    printerId: data.printerId,
    printerName: data.printerName,
    printerStatus: data.printerStatus,
    twoSide: data.twoSide
  }
  this.setState({
    currentNCCloudPrinter: currPrinter
  })
}

//初始化纸张来源信息
function initCurrPaperResourc(data) {
  let currPaperResourc = {
    paperSourceId: data.paperSourceId,
    paperSourceName: data.paperSourceName
  }
  this.setState({
    currentNCCloudPaperResource: currPaperResourc
  })
}

function initToEndInfo(data) {
  let toEndInfo = deepClone(data);
  delete toEndInfo.nccloudPrinterList;
  toEndInfo.changeType = 2;
  this.setState({
    toEndInfo
  })
}

function modifyToEndInfo(data) {
  this.setState({
    toEndInfo: data
  })
}

function isWindowSystem(){
  return navigator.userAgent.toLowerCase().includes("windows");
};

export {
  generatePrintNameList,
  generatePaperResourceList,
  generateCurrentPrintMachine,
  generatePaperList, 
  generateCurrPaperStyle,
  modifyMeta,
  initFormVal,
  initToEndInfo,
  modifyToEndInfo,
  findCurrPrinterNameObjById,
  generateCurrPaperResource,
  isWindowSystem
}