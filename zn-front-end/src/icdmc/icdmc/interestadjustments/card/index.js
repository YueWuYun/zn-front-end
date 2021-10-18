/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//主子表卡片
import React, { Component } from "react";
import { createPage, ajax, base, high, toast, cardCache } from "nc-lightapp-front";
import { buttonClick, clearAll, setEditStatus, initTemplate, initTemplate2, buttonVisible, pageClick, getCardData, afterEvent, beforeEvent, getCopyData } from "./events";
import { moduleId, card, list, baseReqUrl, javaUrl, billtype } from "../cons/constant.js";
import "./index.less";
let { NCAffix, NCDiv } = base;
let { NCUploader, ApproveDetail, ApprovalTrans } = high;
let { getCacheById, updateCache, addCache, getNextId, deleteCacheById } = cardCache;

class Card extends Component {
  constructor(props) {
    super(props);
    this.formId = card.headCode; //主表区域
    this.moduleId = moduleId; //多语使用
    this.pageId = card.pageCode; //card页面code
    this.primaryId = card.primaryId; //主键ID
    this.list = list;
    this.card = card;
    this.cache = card.cardCache; //缓存key
    this.dataSource = list.listCache; //调用列表界面缓存pks
    this.showUploader = false; //附件上传show
    this.billInfo = {}; //附件上传信息
    this.idTs = {}; //保存id, ts, 供保存后直接提交等使用
    this.state = {
      showApproveDetail: false, //是否显示审批详情
      compositedisplay: false, //是否显示指派弹窗
      compositedata: null, //指派信息
      json: {},
      inlt: null
    };
    this.props.getUrlParam("scene") === "approvesce"
      ? initTemplate2.call(this, props)
      : initTemplate.call(this, props);
  }

componentWillMount() {
    let callback = (json, status, inlt) => {
      // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
      if (status) {
        this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
      } else {
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: ["36360ICIA"],
      domainName: "icdmc",
      callback
    });
    let status = this.props.getUrlParam("status");
    if (!status || status === "add") {
      //新增的时候置空数据
      clearAll.call(this, this.props);
    }
    window.onbeforeunload = () => {
      if (!["browse", "version"].includes(this.props.getUrlParam("status"))) {
        return this.state.json[
          "36360ICIA-000000"
        ]; /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
      }
    };
}

componentDidMount() {
    let id = this.props.getUrlParam("id");
    if (id) {
      if (this.props.getUrlParam("status") === "copy") {
        getCopyData.call(this, id, true);
      } else {
        getCardData.call(this, id, true);
      }
    }
}

  /**
   * 按钮操作
   * @param {*} path       	接口地址
   * @param {*} content    	toast弹框显示内容
   * @param {*} pk_contract   pk
   * @param {*} userObj       提交即指派使用
   */
btnOperation = (path, content, pk_contracts, userObj) => {
    let { id: pk_contract, ts } = this.idTs;
    pk_contract = pk_contract || this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    ts = ts || this.props.form.getFormItemsValue(this.formId, "ts").value;
    let pkMapTs = new Map();
    if (pk_contract && ts) {
      pkMapTs.set(pk_contract, ts);
    }
    let data = {
      pks: [pk_contract],
      pageCode: this.pageId,
      pkMapTs
    };
    if (userObj) {
      data.userObj = userObj;
    }
    ajax({
      url: `${baseReqUrl}${path}.do`,
      data,
      success: res => {
        if (res.success) {
          if(res.data != null && res.data.errormessages != null && res.data.errormessages != ''){// 有错误信息，优先显示错误信息
            toast({ color: "danger", content: res.data.errormessages[0] });
          } else if (path === javaUrl.delete) {// 删除
              toast({ color: "success", content });
              // 获取下一条数据的id
              let nextId = getNextId(pk_contract, this.dataSource);
              //删除缓存
              deleteCacheById(this.primaryId, pk_contract, this.dataSource);
              if (nextId) {
                getCardData.call(this, nextId);
                this.props.setUrlParam({ id: nextId });
              } else {
                // 删除的是最后一个的操作
                this.props.setUrlParam({ id: null });
                setEditStatus.call(this, "browse");
                clearAll.call(this, this.props);
              }
          } else if (path === javaUrl.commit) {// 提交
              if (res.data.result && res.data.result.workflow && ["approveflow", "workflow"].includes(res.data.result.workflow)) {
                this.setState({
                  compositedisplay: true, //是否显示指派弹窗
                  compositedata: res.data.result //指派信息
                });
              } else {
                toast({ color: "success", content });
                this.setState({
                  compositedisplay: false, //是否显示指派弹窗
                  compositedata: null //指派信息
                });
                if(res.data.billCards[0].head){
                  ts = res.data.billCards[0].head[this.formId].rows[0].values.ts.value;
                  this.idTs = { id: pk_contract, ts };
                  this.props.form.setAllFormValue({ [this.formId]: res.data.billCards[0].head[this.formId]});
                  updateCache(this.primaryId, pk_contract, res.data, this.formId, this.dataSource);
                  updateCache(this.primaryId, pk_contract, res.data, this.formId, this.cache);
                }
                buttonVisible.call(this, this.props);
              }
          } else {
              toast({ color: "success", content });
              if(res.data.billCards[0].head){
                ts = res.data.billCards[0].head[this.formId].rows[0].values.ts.value;
                this.idTs = { id: pk_contract, ts };
                this.props.form.setAllFormValue({[this.formId]: res.data.billCards[0].head[this.formId]});
                updateCache(this.primaryId, pk_contract, res.data, this.formId, this.dataSource);
                updateCache(this.primaryId, pk_contract, res.data, this.formId, this.cache);
              }
              buttonVisible.call(this, this.props);
          }
        }
      }
    });
};

getAssginUsedr = val => {
    this.btnOperation(
      javaUrl.commit,
      this.state.json["36360ICIA-000001"],
      null,
      val
    ); /* 国际化处理： 提交成功!*/
};

turnOff = () => {
    this.setState({
      compositedisplay: false, //是否显示指派弹窗
      compositedata: null //指派信息
    });
    let id = this.props.form.getFormItemsValue(this.formId, this.primaryId)
      .value;
    this.props.setUrlParam({
      id,
      status: "browse"
    });
    buttonVisible.call(this, this.props);
};

  render() {
    let { form, button, cardPagination, BillHeadInfo } = this.props;
    let { showApproveDetail, compositedisplay, compositedata } = this.state;
    let { createForm } = form;
    let { createCardPagination } = cardPagination;
    let { createButtonApp } = button;
    let { createBillHeadInfo } = BillHeadInfo;
    return (
      <div className="nc-bill-card">
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.state.json[
                  "36360ICIA-000002"
                ] /* 国际化处理： 贷款利息调整*/,
                billCode: "",
                backBtnClick: () =>
                  this.props.pushTo("/list", {
                    pagecode: this.card.pageCode
                  })
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: card.btnCode,
                onButtonClick: buttonClick.bind(this)
              })}
            </div>
            <div
              className="header-cardPagination-area"
              style={{ float: "right" }}
            >
              {createCardPagination({
                dataSource: this.dataSource,
                handlePageInfoChange: pageClick.bind(this)
              })}
            </div>
          </NCDiv>
        </NCAffix>
        <div className="nc-bill-top-area remove-block">
          <div className="nc-bill-form-area">
            {createForm(this.formId, {
              onAfterEvent: afterEvent.bind(this),
              onBeforeEvent: beforeEvent.bind(this)
            })}
          </div>
        </div>
        {compositedisplay ? (
          <ApprovalTrans
            title={this.state.json["36360ICIA-000003"]} /* 国际化处理： 指派*/
            data={compositedata}
            display={compositedisplay}
            getResult={this.getAssginUsedr}
            cancel={this.turnOff}
          />
        ) : null}
        {showApproveDetail && (
          <ApproveDetail
            show={showApproveDetail}
            billtype={billtype}
            billid={this.billInfo.billId}
            close={() => {
              this.setState({
                showApproveDetail: false
              });
            }}
          />
        )}
        {this.showUploader && (
          <NCUploader
            placement={"bottom"}
            {...this.billInfo}
            onHide={() => {
              this.showUploader = false;
              this.forceUpdate();
            }}
          />
        )}
      </div>
    );
  }
}

Card = createPage({
  mutiLangCode: moduleId,
  billinfo: {
    billtype: "form",
    pagecode: card.pageCode,
    headcode: card.headCode
  }
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/