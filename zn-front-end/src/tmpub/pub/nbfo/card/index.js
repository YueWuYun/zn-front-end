/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**
 * 非银行金融机构卡片
 * @author：dongyue7
 */

import {
  base,
  getBusinessInfo,
  high,
  toast,
  createPage,
} from "nc-lightapp-front";
import React, { Component } from "react";
import {
  accList,
  appcode,
  baseReqUrl,
  card,
  insPrintData,
  javaUrl,
  list,
  moduleId,
} from "../cons/constant";
import { billHeadVisible, cancel, handleClick } from "../public/event";
import { buttonClick, getCardData, initTemplate, pageClick } from "./events";
let { NCAffix, NCDiv } = base;
let { PrintOutput } = high;

class Card extends Component {
  constructor(props) {
    super(props);
    this.formId = card.headCode; //主表区域
    this.tableId = card.tableCode; //子表区域
    this.tablePrimaryId = card.tablePrimaryId; //子表区域
    this.moduleId = props.moduleId || moduleId; //多语使用
    this.pageId = props.pageId || card.pageCode; //card页面code
    this.appcode = props.appcode || appcode;
    this.primaryId = card.primaryId; //主键ID
    this.accListPageCode = props.accListPageCode || accList.pageCode;
    this.accListTitle = props.accListTitle; //银行账户标题的多语编码
    this.cache = card.cardCache; //缓存key
    this.dataSource = card.cardCache; //调用列表界面缓存pks
    this.treeId = "tree"; //树id
    this.cardDataCache = accList.cardDataCache; //子表缓存
    this.businessInfo = getBusinessInfo();
    if (props.pageType === "org") {
      //集团
      this.appcode = "36010NBFOO";
      this.pageId = "36010NBFOO_card";
      this.nodekey = "36010NBFOO_card";
      this.dataSource = "tm.pub.interestrateOrg.datasource";
      this.oid = "0001Z610000000024Y41";
    } else if (props.pageType === "group") {
      //全局
      this.appcode = "36010NBFOG";
      this.pageId = "36010NBFOG_card";
      this.nodekey = "36010NBFOG_card";
      this.dataSource = "tm.pub.interestrateGroup.datasource";
      this.oid = "0001Z610000000028M29";
    }
    this.state = {
      isPaste: false, //tabs处是否粘贴
      checkedRows: [], //tabs处当前选中行的index集合
      printOut: {
        //打印输出使用
        ...insPrintData,
        outputType: "output",
      },
      type: {},
      pk: [],
      selectedPk: props.getUrlParam("typePk"),
      newId: "",
      reviseStatus: true,
      showPagination: true,
      context: {}, // 全局上下文
    };
    // initTemplate.call(this, props);
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      if (status) {
        initTemplate.call(this, this.props, json);
        this.setState({ json, inlt });
        this.afterGetLang(json);
      } else {
        //console.log("未加载到多语资源");
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: [this.moduleId, "36010NBFO"],
      domainName: "tmpub",
      callback,
    });
  }

  afterEvent = (props, moduleId, key) => {
    let data = this.props.createExtCardData(this.pageId, this.formId);
    if (
      data.head.head.rows[0].values.name.value &&
      data.head.head.rows[0].values.name.value.trim().length > 50
    ) {
      toast(
        { color: "warning", content: "名称字段长度不能超过50" },
        this.props.form.setFormItemsValue(this.formId, {
          [key]: { value: "" },
        })
      );
    }
  };

  afterGetLang() {
    window.onbeforeunload = () => {
      if (!["browse"].includes(this.props.getUrlParam("status"))) {
        return this.state.json[
          "36010NBFO-000015"
        ]; /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
      }
    };
  }

  componentWillUnmount() {
    window.onbeforeunload = () => {
      // 停止事件
    };
  }

  componentDidMount() {
    let id = this.props.getUrlParam("id");
    if (id) {
      getCardData.call(this, id, true, true);
    } else {
      billHeadVisible.call(this, false, false);
      this.setState({ showPagination: false });
      this.props.form.setFormItemsValue(this.formId, {
        enable_state: {
          value: "1",
          display: this.state.json && this.state.json["36010NBFO-000016"],
        },
      }); /* 国际化处理： 已启用*/
    }
  }

  render() {
    let {
      cardTable,
      form,
      button,
      ncmodal,
      cardPagination,
      DragWidthCom,
      syncTree,
      BillHeadInfo,
    } = this.props;
    let { printOut } = this.state;
    let { createCardTable } = cardTable;
    let { createBillHeadInfo } = BillHeadInfo;
    let { createForm } = form;
    let { createCardPagination } = cardPagination;
    let { createButtonApp } = button;
    let { createModal } = ncmodal;
    let { createSyncTree } = syncTree;
    return (
      <div className="nc-bill-card nbfo-card">
        {/* 头部 header*/}
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.state.json && this.state.json[this.props.pageTitle], //标题/* 国际化处理： 非银行金融机构*/
                backBtnClick: () => {
                  //返回按钮的点击事件
                  handleClick.call(this, "list", {
                    bckPk: this.state.selectedPk,
                    bckFlag: true,
                    pagecode: list.pageCode,
                  });
                },
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: card.btnCode,
                onButtonClick: buttonClick.bind(this),
              })}
            </div>
            {this.state.showPagination && (
              <div
                className="header-cardPagination-area"
                style={{ float: "right" }}
              >
                {createCardPagination({
                  handlePageInfoChange: pageClick.bind(this),
                })}
              </div>
            )}
          </NCDiv>
        </NCAffix>
        {/* 树卡区域 */}
        <div className="tree-card">
          <DragWidthCom
            leftDom={
              <div className="tree-area" style={{ marginLeft: "20px" }}>
                {createSyncTree({
                  treeId: "tree",
                  needEdit: false, //不启用编辑
                  showLine: true, //显示连线
                  needSearch: true, //是否需要搜索框,
                  showModal: true, //是否使用弹出式编辑
                  hiddenDefaultIcon: true, //隐藏默认的文件夹图标
                  disabledSearch: true,
                })}
              </div>
            } //左侧区域dom
            rightDom={
              <div className="nc-bill-card">
                <div className="nc-bill-top-area">
                  <div className="nc-bill-form-area">
                    {createForm(this.formId, {
                      onAfterEvent: this.afterEvent.bind(this),
                    })}
                  </div>
                </div>
                <div className="nc-bill-bottom-area">
                  <div className="nc-bill-table-area">
                    {createCardTable(this.tableId, {
                      showIndex: true,
                      adaptionHeight: true,
                    })}
                  </div>
                </div>
              </div>
            } //右侧区域dom
            defLeftWid="21%" // 默认左侧区域宽度，px/百分百
          />
          <PrintOutput
            ref="printOutput"
            url={`${baseReqUrl}${javaUrl.print}.do`}
            data={printOut}
          />
          {createModal("cancelModal", {
            title:
              this.state.json &&
              this.state.json["36010NBFO-000007"] /* 国际化处理： 取消*/,
            content:
              this.state.json &&
              this.state.json[
                "36010NBFO-000030"
              ] /* 国际化处理： 确定要取消么?*/,
            beSureBtnClick: () => {
              cancel.call(this, this.props);
            },
          })}
        </div>
      </div>
    );
  }
}

Card = createPage({
  billinfo: {
    billtype: "extcard",
    pagecode: card.pageCode,
    headcode: card.headCode,
    bodycode: ["bankaccount"],
  },
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/