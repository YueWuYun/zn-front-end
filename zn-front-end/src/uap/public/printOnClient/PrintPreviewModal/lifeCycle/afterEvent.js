
import {generateCurrPaperStyle, modifyToEndInfo, findCurrPrinterNameObjById, 
  modifyMeta, initFormVal, generateCurrPaperResource} from '../method';
import {deepClone} from "nc-lightapp-front";
export default function afterEvent(props, moduleId, key, value, oldValue) {
  //自定义纸张
  let selectedValue = !!value.value.key ? value.value.key : value.value;
  if(['pageRangeType','pageFrom','pageTo','pageWholeType','copies','collated',
    'doubleside'].includes(key)) {
      changeSaveInfo.call(this, key, value);
  }
  if('PrinterList' === key) {
    changePaper.call(this, props, moduleId, key, selectedValue)
  }
  if('nccloudPaperDirect' === key) {
    changePaperDirect.call(this, selectedValue);
  }
  if(['paperList'].includes(key) && value !== oldValue) {
    let currPaper = generateCurrPaperStyle.call(this, this.state.resInfo, this.state.currentNCCloudPrinter.printerId, selectedValue);
    pageSizeChange.call(this, currPaper);
    changePaperSize.call(this, props, moduleId, key, selectedValue);

    //放开编辑权限
    this.props.form.setFormItemsDisabled(moduleId, {
      paperWidth: this.state.json["index_015"] === value.display ? false : true,
      paperHeight: this.state.json["index_015"] === value.display ? false : true,
    })
  }
  if(["templateInfoList"].includes(key)) {
    changeTemplateInfo.call(this, selectedValue);
  }
  if("printMode" == key) {
    selectedValue = selectedValue ? 1 : 0;
  }
  if(["paperWidth", "paperHeight"].includes(key)) {//自定义纸张大小变更
    changeSelfDefineWH.call(this, key, selectedValue);
  }
  changeToEndInfo.call(this, moduleId, key, selectedValue);
}

//纸张大小更新
function pageSizeChange(currPaper) {
  let resInfo = deepClone(this.state.resInfo);
  delete resInfo.nccloudPrinterList;
  resInfo.changeType= 2;
  resInfo.currentNccloudPaper=currPaper;
  this.resetPageSize(resInfo);
}

//纸张方向变更
function changePaperDirect(value) {
  let resInfo = deepClone(this.state.resInfo);
  delete resInfo.nccloudPrinterList;
  resInfo.changeType= 2;
  let currentNccloudPaper = this.state.printSetting;
  currentNccloudPaper.nccloudPaperDirect = value;
  if(this.state.json["index_015"] !== currentNccloudPaper.paperName) {//自定义纸张不切换宽高
    let reWidth = currentNccloudPaper.paperHeight;
    let reHeight = currentNccloudPaper.paperWidth;
    currentNccloudPaper.paperWidth = reWidth;
    currentNccloudPaper.paperHeight = reHeight;
  }
  resInfo.currentNccloudPaper = currentNccloudPaper;
  this.resetPageSize(resInfo);
  this.resetPageWH(resInfo);
  //存在state异步问题，放在此处
  let toEndInfo = this.state.toEndInfo;
  toEndInfo.currentNCCloudPrinter = currentNccloudPaper;
  modifyToEndInfo.call(this, toEndInfo);
}

//打印机变更
function changePaper(props, moduleId, key, value) {
  modifyMeta.call(this, this.state.resInfo, value);
  initFormVal.call(this, this.state.resInfo, value);
}

function changeSaveInfo(key, value) {
  let info = this.state.info;
  info[key] = value;
  this.setState({
    info
  })
}

//变更纸张-修改尺寸
function changePaperSize(props, moduleId, key, value) {
  let currPaper = generateCurrPaperStyle.call(this, this.state.resInfo, this.state.currentNCCloudPrinter.printerId, value);
  this.setState({
    printSetting: currPaper
  })
  this.props.form.setFormItemsValue(moduleId, {
    paperWidth: {value: currPaper.paperWidth},
    paperHeight: {value: currPaper.paperHeight},
    nccloudPaperDirect: {value: false}
  })
}

//传递后台数据-本地缓存修改
function changeToEndInfo(moduleId, key, value) {
  //字段不一致变更
  let toEndInfo = this.state.toEndInfo;
  let printSetting = this.state.printSetting;
  switch (key) {
    case 'paperList':
      let currPaper = generateCurrPaperStyle.call(this, this.state.resInfo, this.state.currentNCCloudPrinter.printerId, value);
      toEndInfo.currentNccloudPaper = currPaper;
      toEndInfo.changetype = 2;
      toEndInfo.nccloudPaperDirect = false;
      break;
    case 'PrinterList':
      let currPrinter = findCurrPrinterNameObjById(this.state.resInfo, value);
      let currentNCCloudPrinter = this.state.currentNCCloudPrinter;
      currentNCCloudPrinter.printerId = currPrinter.printerId;
      currentNCCloudPrinter.printerName = currPrinter.printerName;
      toEndInfo.currentNCCloudPrinter = currentNCCloudPrinter;
      break;
    case 'printerStatus': 
    case 'twoSide':
      let currentPrinter = this.state.currentNCCloudPrinter;
      currentPrinter[key] = value;
      toEndInfo.currentNCCloudPrinter = currentPrinter;
      break;
    case 'paperResourceList':
      let currPaperResource = generateCurrPaperResource.call(this,this.state.resInfo, value);
      let currentNCCloudPaperResource = this.state.currentNCCloudPaperResource;
      currentNCCloudPaperResource.paperSourceName = currPaperResource.paperSourceName;
      currentNCCloudPaperResource.paperSourceId = currPaperResource.paperSourceId;
      toEndInfo.currentNCCloudPaperResource = currentNCCloudPaperResource;
      break;
    case "templateInfoList":
      toEndInfo.changetype = 1;
      break;
    case "doubleside":
      toEndInfo.doubleside = value == 0 ? false : true;
      toEndInfo.isDuplex = value == 1 ? false : true;
      break;
    case "paperWidth":
    case "paperHeight":
      printSetting = {
        paperId: "",
        paperName: this.state.json["index_015"],
        paperWidth: "paperWidth" === key ? value : printSetting.paperWidth,
        paperHeight: "paperHeight" === key ? value : printSetting.paperHeight
      }
      this.setState({printSetting});
      toEndInfo.currentNccloudPaper = printSetting;
    default:
      toEndInfo[key] = value
      break;
  }
  modifyToEndInfo.call(this, toEndInfo);
}

function changeSelfDefineWH(key, value) {
  let resInfo = deepClone(this.state.resInfo);
  let printSetting = this.state.printSetting;
  delete resInfo.nccloudPrinterList;
  resInfo.changeType= 2;
  resInfo.currentNccloudPaper={
    paperId: "",
    paperName: this.state.json["index_015"],
    paperWidth: "paperWidth" === key ? value : printSetting.paperWidth,
    paperHeight: "paperHeight" === key ? value : printSetting.paperHeight 
  };
  this.resetPageSize(resInfo);
}

//更改模板信息
function changeTemplateInfo(printTemplateID) {
  let resInfo = deepClone(this.state.resInfo);
  resInfo.changeType= 1;
  this.initFormData({printTemplateID})
  this.resetPageSize(resInfo,printTemplateID);
  this.setState({
    changeTem: true,
    currPrintTemplateID: printTemplateID
  })
}