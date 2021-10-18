import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import {ajax,base,Cipher,gzip,viewModel,print,getMultiLang, output, deepClone, createPage} from "nc-lightapp-front";
import initTemplate from "./lifeCycle/initTemplate";
import beforEvent from "./lifeCycle/beforEvent";
import afterEvent from "./lifeCycle/afterEvent";
import { setStorage, getStorage, clearStorage } from "./storageMethod";
import formPreviewPrint from "../printPreview/formPreviewPrint";
import { modifyMeta, initFormVal, initToEndInfo, modifyToEndInfo } from "./method";
import websocketLink from "./websocketLink";
import getTotalPageByForm from "./getTotalPageByForm";
const { getCookie, getGlobalStore} = viewModel;
const Gzip = gzip;
let gziptools = new Gzip();
let {opaqueDecrypt} = Cipher;
const { NCButton, NCInput, NCRow, NCCol, NCIcon, NCCheckbox, NCLoading} = base;
require("./index.less");

class PrintPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoad: false,
      modalVis: false,
      nopreview: false,
      totalPages: 0,
      printSetting: {
        //纸张信息
        paperId: "",
        paperName: "",
        paperWidth: 210,
        paperHeight: 297,
        nccloudPaperDirect: false
      },
      currentNCCloudPrinter: {}, //打印机
      currentNCCloudPaperResource: {}, //纸张来源
      info: {
        //回显使用
        pageRangeType: { display: "所有页面", value: 0 },
        pageFrom: { display: "1", value: 1 },
        pageTo: { display: "1", value: 1 },
        pageWholeType: { display: "全部", value: 0 },
        copies: { display: false, value: false },
        collated: { display: false, value: false },
        doubleside: { display: true, value: true },
        isDuplex: { display: false, value: false }
      },
      toEndInfo: {
        //提交后台服务
      },
      asid: this.props.params.asid,
      resInfo: {},
      originalQuery: {},
      currPrintTemplateID: "",
      changeTem: false,//是否在切换模板
      json:{},
      init: null
    };
  }

  //本地存储格式化数据,客户端打印直接使用
  saveLocalData = () => {
    const {
      currentNCCloudPaperResource,
      toEndInfo,
      currentNCCloudPrinter
    } = this.state;
    let toEndInfoVO = deepClone(toEndInfo);
    toEndInfoVO.currentNCCloudPaperResource = currentNCCloudPaperResource;
    toEndInfoVO.currentNCCloudPrinter = currentNCCloudPrinter;
    const printInfo = {
      info: this.state.info,
      toEndInfo: toEndInfoVO
    };
    setStorage(this.state.asid, JSON.stringify(printInfo));
  };

  save = () => {
    this.cancel();
    this.saveLocalData();
    if (
      this.props.onEnsureInfoSave &&
      typeof this.props.onEnsureInfoSave === "function"
    ) {
      this.props.onEnsureInfoSave(this.state.toEndInfo);
    }
  };

  cancel = () => {
    this.setState({
      modalVis: false
    });
    let element = ReactDOM.findDOMNode(this);
    ReactDOM.unmountComponentAtNode(element);
    let parentElement = element.parentNode;
    parentElement.parentNode &&
      parentElement.parentNode.removeChild(parentElement);
  };

  componentWillMount() {
    let callback = (json, status, inlt) => {
      if (status) {
        this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
      } else {
          console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
      }
    }
    getMultiLang({ 'moduleId': 'contains_printOnClient', callback })
  }

  componentDidMount() {
    this.setState({
      modalVis: true,
      originalQuery: {
        params: this.props.params,
        url: this.props.url
      }
    });
    //返回current
    this.initFormData();
    this.getTotalPages({params: this.props.params, url: this.props.url});
  }

  getTotalPages = (query) => {
    //获取预览打印总页数，后台对应的down.do的数据易导致后台死循环
    let queryParams = deepClone(query.params);
    const transParams = {...queryParams, download: "previewTotalPages"};
    
    getTotalPageByForm({
      newProps: this.props,
      url: query.url, 
      params: transParams,
      enctype: 2
    });
    console.log("gzipStatus",getGlobalStore('gzip'))
    this.getUnzipTotalPage();
  }

  //将返回的总页数解压缩、解密
  getUnzipTotalPage = () => {
    let aeskey = opaqueDecrypt(localStorage.getItem('cowboy'));
    let cckk = getCookie('cookiets') || Date.now();
    // 做一次 数据转型
    cckk = isNaN(cckk) ? cckk : Number(cckk);
    let cckks = cckk + ''; 
    aeskey = cckks + aeskey.substring(0, aeskey.length - cckks.length);

    const that = this;
    let num = 0;//预防后台代码未提交
    let timer = setInterval( () => {
      let preIfr = window.frames["totalPageIframe"];
      if(preIfr) {
        num += 1;
        num > 20 && clearInterval(timer);
        let preDiv = preIfr.document.getElementsByTagName("pre")[0];
        if(preDiv && preDiv.innerHTML) {
          let res = (typeof preDiv.innerHTML === 'string')  ? Cipher.decrypt(preDiv.innerHTML, aeskey) : preDiv.innerHTML;
          clearInterval(timer);
          if(getGlobalStore('gzip') == '1') {
            res = gziptools.unzip(res);
          }
          that.setState({
            totalPages: res.data
          })
        }
      }
    }, 1000)
  }

  // initSetPaperDirWidth = () => {//初始默认设置纸张方向为横向
  //   this.props.form.setFormItemsValue("printStyle", {
  //     nccloudPaperDirect: {value: false}
  //   })
  // }
  toggleShowLoad(status) {
    this.setState({
      showLoad: status
    })
  }

  //初始化表单数据
  initFormData = async(vo = {}) => {
    //返回打印机list
    let currPrintTemplateID = (vo.printTemplateID) ? vo.printTemplateID : this.props.params.printTemplateID;
    let resVO = await websocketLink(
      this.props,
      this.props.url,
      {
        ...this.props.params,
        printTemplateID: currPrintTemplateID
      },
      this.state.json
    );
    let { resInfo } = this.state;
    let nccloudPrinterList = resVO.nccloudPrinterList;
    
    const that = this;

    let ncclouPrintSetting = null;
    
    if(this.props.params.asid && getStorage(this.props.params.asid)) {
      ncclouPrintSetting = JSON.stringify(JSON.parse(getStorage(this.props.params.asid)).toEndInfo);
    }
    //外部有模板id传入，清除页面缓存，后台asid生成异常
    if(this.props.params.printTemplateID) {
      clearStorage(this.props.params.asid);
      ncclouPrintSetting = null;
      let printIdKeyArrStr = getStorage("printClientHistory");
      if(printIdKeyArrStr && printIdKeyArrStr.includes(this.props.params.asid)) {
        let printArr = printIdKeyArrStr.split(",");
        let endStr = printArr.pop();
        localStorage.setItem("printClientHistory", printArr.join(","));
      }
    }
    
    this.setState({
      currPrintTemplateID,
      nopreview: (!!ncclouPrintSetting && JSON.parse(ncclouPrintSetting).nopreview) || false
    })
    //切换模板不再用缓存数据
    ajax({
      url: "/nccloud/riart/printtool/down.do",
      data: {
        printTemplateID: currPrintTemplateID,
        appcode: this.props.params.appcode,
        nodeKey: this.props.params.nodekey,
        ncclouPrintSetting: vo.printTemplateID ? {...ncclouPrintSetting,changeType: 1} : ncclouPrintSetting
      },
      success: res => {
        const {success, data} = res;
        if (success) {
          resInfo = {
            ...res.data,
            //测试多模板数据 begin(注释)
            // nccloudTemplateInfoList: [
            //   {
            //       "templateId": "1001Z010000000003WIW",
            //       "templateName": "登录日志"
            //   },
            //   {
            //     "templateId": 3,
            //     "templateName": 3
            //   }
            // ],
            //end
            nccloudPrinterList,
            printTemplateID: currPrintTemplateID,
          };
          that.setState({
            resInfo,
          });
          that.formatData(resInfo);
          initToEndInfo.call(that, resInfo);
          // !ncclouPrintSetting && that.initSetPaperDirWidth();
        }
      },
      // error: res => {
      //   toast({ color: "danger", content: res.message });
      // }
    });
  };

  //格式化模板数据
  formatData = data => {
    modifyMeta.call(this, data);
    initFormVal.call(this, data, "", data.printTemplateID);
  };

  //重置纸张尺寸
  resetPageSize = (pageParam = {}, printTemplateID = "") => {
    const { originalQuery, printSetting, toEndInfo} = this.state;
    if (!Object.keys(pageParam).length) {
      pageParam = printSetting;
    }
    this.toggleShowLoad.call(this, true);
    formPreviewPrint({
      newProps: this.props,
      params: {
        ...originalQuery.params,
        printTemplateID: printTemplateID ? printTemplateID: originalQuery.params.printTemplateID,
        printSetting: JSON.stringify(pageParam),
        changeType: printTemplateID ? 1 : 2
      },
      url: originalQuery.url,
      enctype: 2,
      hasModal: true
    }, this.state.json);
    //暂定使用定时器的方式
    setTimeout( () => {
      this.toggleShowLoad.call(this, false);
    }, 1500)
    
  };

  //根据横纵向变更纸张尺寸
  resetPageWH = data => {
    this.setState({
      printSetting: data.currentNccloudPaper
    });
    this.props.form.setFormItemsValue("printStyle", {
      paperWidth: { value: data.currentNccloudPaper.paperWidth },
      paperHeight: { value: data.currentNccloudPaper.paperHeight }
    });
  };

  resetIframeStyle = () => {};

  changePreviewStatus = (val) => {
    modifyToEndInfo.call(this,{...this.state.toEndInfo, nopreview: val});
    this.setState({
      nopreview: val
    })
  }

  output = () => {
    const { originalQuery } = this.state;
    console.log("currPrintTemplateID", this.state.currPrintTemplateID)
    debugger
    output({ 
      url: originalQuery.url, 
      data: {...originalQuery.params, download: null, outputType: 'output'}, 
    callback: this.onButtonClick });
  }

  render() {
    const { form, params } = this.props;
    let { createForm } = form;
    const { modalVis, originalQuery, resInfo } = this.state;
    return (
      <div
        className="print-preview-model"
        style={{ display: modalVis ? "block" : "none" }}
      >
        <iframe id="totalPageIframe" name="totalPageIframe" style={{display: 'none'}}></iframe>
        <div className="print-preview-model-dialog" />
        <div className="model-body">
          <header className="model-header">
          {/* 打印预览 */}
            <span>{this.state.json["index_003"]}</span>
            <NCIcon
              type="uf-close"
              className="close-modal"
              onClick={this.cancel}
            />
          </header>
          <NCRow>
            <NCCol md={9}>
              <iframe
                id="printPreviewModal"
                name="printPreviewModal"
                style={{ width: "100%", height: "430px" }}
                onLoad={() => {
                  this.resetIframeStyle();
                }}
              />
            </NCCol>
            <NCCol md={3}>
              <NCLoading container={this} show={this.state.showLoad}/>
              <div className="print-form-contain">
              {/* 打印模板 */}
                <h4 className="header-title header-title-first">{this.state.json["index_004"]}</h4>
                {createForm("printTemplate", {
                  onAfterEvent: afterEvent.bind(this),
                  onBeforeEvent: beforEvent.bind(this)
                })}
                {/* 打印范围 */}
                <h4 className="header-title">{this.state.json["index_005"]}</h4>
                {createForm("printRange", {
                  onAfterEvent: afterEvent.bind(this),
                  onBeforeEvent: beforEvent.bind(this)
                })}
                {/* 打印机 */}
                <h4 className="header-title">{this.state.json["index_006"]}</h4>
                {createForm("printMachine", {
                  onAfterEvent: afterEvent.bind(this),
                  onBeforeEvent: beforEvent.bind(this)
                })}
                {/* 纸张设置 */}
                <h4 className="header-title">{this.state.json["index_007"]}</h4>
                {createForm("printStyle", {
                  onAfterEvent: afterEvent.bind(this),
                  onBeforeEvent: beforEvent.bind(this)
                })}
              </div>
            </NCCol>
          </NCRow>
          <footer className="model-footer">
          {/* 点击打印时不再进行预览 */}
            <NCCheckbox checked={this.state.nopreview} fieldid="preview_check"
              value={this.state.nopreview}
              onChange={this.changePreviewStatus}
              >{this.state.json["index_008"]}</NCCheckbox>
              {/* "(可预览5页) " 共5页*/}
            <p className="total-paegs">{this.state.totalPages > 5 && `（${this.state.json["index_009"]}5${this.state.json["index_010"]}）`}{this.state.json["index_011"]}{this.state.totalPages}{this.state.json["index_010"]}</p>
            {/* 打印、输出、取消 */}
            <NCButton onClick={this.save} fieldid="print_btn"  colors="danger">{this.state.json["index_012"]}</NCButton>
            <NCButton onClick={this.output} fieldid="output_btn">{this.state.json["index_013"]}</NCButton>
            <NCButton onClick={this.cancel} fieldid="cancel_btn">{this.state.json["index_014"]}</NCButton>
          </footer>
        </div>
      </div>
    );
  }
}

PrintPreviewModal = createPage({
  initTemplate: initTemplate
})(PrintPreviewModal);

export default PrintPreviewModal;

