/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**
 * 结息日卡片
 * @author：dongyue7
 */

import React, { Component } from "react";
import {
  createPage,
  ajax,
  base,
  toast,
  high,
  cardCache,
} from "nc-lightapp-front";
import {
  buttonClick,
  clearAll,
  setEditStatus,
  initTemplate,
  buttonVisible,
  tabButtonClick,
  pageClick,
  getCardData,
  afterEvent,
} from "./events";
import {
  moduleId,
  btnLimit,
  card,
  list,
  baseReqUrl,
  javaUrl,
  printData,
} from "../cons/constant.js";
import { billHeadVisible, handleSysDatas } from "./events/page";
import { bodySelectedEvent } from "./events/bodySelectedEvents";
import { afterTableEvent } from "./events/afterTableEvent";
import { LIST } from "../../interestrate/cons/constant";
let { PrintOutput } = high;
let { NCAffix, NCDiv } = base;
let { updateCache, getNextId, deleteCacheById } = cardCache;

class Card extends Component {
  constructor(props) {
    super(props);
    this.formId = card.headCode; //主表区域
    this.tableId = card.tableCode; //子表区域
    this.moduleId = moduleId; //多语使用
    this.pageId = card.pageCode; //card页面code
    this.primaryId = card.primaryId; //主键ID
    this.tablePrimaryId = card.tablePrimaryId; //table主键ID
    this.cache = list.listCache; //缓存key
    this.dataSource = list.listCache; //调用列表界面缓存pks
    this.state = {
      isPaste: false, //table处是否粘贴
      checkedRows: [], //table处当前选中行的index集合
      printOut: {
        //打印输出使用
        ...printData,
        outputType: "output",
      },
    };
    // initTemplate.call(this, props);
  }

  componentWillUnmount() {
    window.onbeforeunload = () => {
      // 停止事件
    };
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
      if (status) {
        initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
        this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
        this.afterGetLang(json);
      } else {
        //console.log("未加载到多语资源"); // 未请求到多语资源的后续操作
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: this.moduleId,
      domainName: "tmpub",
      callback,
    });
  }

  afterGetLang(json) {
    window.onbeforeunload = () => {
      if (!["browse"].includes(this.props.getUrlParam("status"))) {
        return json[
          "36010ISDC-000017"
        ]; /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
      }
    };
  }

  componentDidMount() {
    let id = this.props.getUrlParam("id");
    if (id) {
      getCardData.call(this, id, true);
      handleSysDatas.call(this);
    } else {
      this.props.form.setFormItemsDisabled(this.formId, {
        settlecycle: true,
        cycleunit: true,
        enablestate: true,
      });
      this.props.form.setFormItemsValue(this.formId, {
        enablestate: {
          display: this.state.json && this.state.json["36010ISDC-000018"],
          value: "0",
        } /* 国际化处理： 已启用*/,
        endsettledate: { display: "20", value: "20" },
      });
      billHeadVisible.call(this, false, false);
    }
  }

  //返回按钮事件配置
  handleBackClick() {
    this.props.pushTo("/list", {
      pagecode: LIST.page_id,
    });
  }

  /**
   * 按钮操作
   * @param {*} path       接口地址
   * @param {*} content    toast弹框显示内容
   */
  btnOperation = (path, content, pkMapTs) => {
    let pk_setdate = this.props.form.getFormItemsValue(
      this.formId,
      this.primaryId
    ).value;
    ajax({
      url: `${baseReqUrl}${path}.do`,
      data: { pks: [pk_setdate], pkMapTs },
      success: (res) => {
        if (res.success && res.data) {
          if (path === javaUrl.delete) {
            if (res.data.failNum === "0") {
              // 如果删除成功
              toast({ color: "success", content });
              // 获取下一条数据的id
              let nextId = getNextId(pk_setdate, this.cache);
              //删除缓存
              deleteCacheById(this.primaryId, pk_setdate, this.cache);
              if (nextId) {
                getCardData.call(this, nextId);
                this.props.setUrlParam({ id: nextId });
              } else {
                // 删除的是最后一个的操作
                this.props.setUrlParam("");
                setEditStatus.call(this, "browse");
                clearAll.call(this, this.props);
              }
            } else {
              // 如果删除失败
              toast({ color: "warning", content: res.data.errormessages[0] });
            }
          } else if (path != javaUrl.delete) {
            toast({ color: "success", content });
            updateCache(
              this.primaryId,
              pk_setdate,
              res.data,
              this.formId,
              this.cache
            );
            getCardData.call(this, this.props.getUrlParam("id"));
            buttonVisible.call(this, this.props);
          } else if (res.data.failNum != "0") {
            toast({
              color: "danger",
              content: this.state.json["36010ISDC-000019"],
            }); /* 国际化处理： 该条数据已被引用，删除失败！*/
          }
        }
      },
    });
  };

  //获取列表肩部信息
  getTableHead = () => {
    return (
      <div className="shoulder-definition-area">
        <div className="definition-icons">
          {this.props.button.createButtonApp({
            area: card.tableHead,
            buttonLimit: btnLimit,
            onButtonClick: tabButtonClick.bind(this),
            popContainer: document.querySelector(".header-button-area"),
          })}
        </div>
      </div>
    );
  };

  render() {
    let { cardTable, form, button, cardPagination, BillHeadInfo } = this.props;
    let { printOut } = this.state;
    let { createCardTable } = cardTable;
    let { createBillHeadInfo } = BillHeadInfo;
    let { createForm } = form;
    let { createCardPagination } = cardPagination;
    let { createButtonApp } = button;
    let status = this.props.getUrlParam("status") === "browse";
    let scene = this.props.getUrlParam("scene") === "linksce";
    let showPagintion = status && !scene;
    const langData = this.props.MultiInit.getLangData(moduleId);
    return (
      <div className="nc-bill-card fmc-demo">
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: langData && langData.json["36010ISDC-000020"], //标题/* 国际化处理： 结息日*/
                backBtnClick: () => {
                  //返回按钮的点击事件
                  this.handleBackClick();
                },
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: card.btnCode,
                onButtonClick: buttonClick.bind(this),
              })}
            </div>
            {showPagintion && (
              <div
                className="header-cardPagination-area"
                style={{ float: "right" }}
              >
                {createCardPagination({
                  dataSource: this.dataSource,
                  handlePageInfoChange: pageClick.bind(this),
                })}
              </div>
            )}
          </NCDiv>
        </NCAffix>
        <div className="nc-bill-top-area">
          <div className="nc-bill-form-area">
            {createForm(this.formId, {
              onAfterEvent: afterEvent.bind(this),
            })}
          </div>
        </div>
        <div className="nc-bill-bottom-area">
          <div className="nc-bill-table-area">
            {createCardTable(this.tableId, {
              tableHead: this.getTableHead.bind(this),
              // modelSave: this.saveBill,
              // onAfterEvent: afterEvent.bind(this),
              showCheck: true,
              showIndex: true,
              adaptionHeight: true,
              onSelected: bodySelectedEvent.bind(this),
              onSelectedAll: bodySelectedEvent.bind(this),
              onAfterEvent: afterTableEvent.bind(this),
            })}
          </div>
        </div>

        <PrintOutput
          ref="printOutput"
          url={`${baseReqUrl}${javaUrl.print}.do`}
          data={printOut}
        />
      </div>
    );
  }
}

Card = createPage({
  billinfo: {
    tabs: true,
    billtype: "extcard",
    pagecode: card.pageCode,
    headcode: card.headCode,
    bodycode: ["settleDateDetail"],
  },
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/