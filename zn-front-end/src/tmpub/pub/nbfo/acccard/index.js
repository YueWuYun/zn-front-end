/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**
 * 非银行金融机构银行账户卡片
 * @author：dongyue7
 */

import { base, high } from "nc-lightapp-front";
import React, { Component } from "react";
import {
  accCard,
  accPrintData,
  acc_data_source,
  appCode,
  baseReqUrl,
  javaUrl,
  moduleId,
  list
} from "../cons/constant";
import { handleClick } from "../public/event";
import { buttonClick, getCardData, initTemplate, pageClick } from "./events";
import { afterEvent } from "./events/afterEvents";
import { afterTableEvent } from "./events/afterTableEvent";
import { bodySelectedEvent } from "./events/bodySelectedEvent";
import { billHeadVisible, getTableHead } from "./events/page";
import "./index.less";
let { PrintOutput } = high;
let { NCAffix, NCDiv } = base;

class Card extends Component {
  constructor(props) {
    super(props);
    this.formId = accCard.headCode; //主表区域
    this.tableId = accCard.tableCode; //子表区域
    this.tablePrimaryId = accCard.tableCode; //子表区域
    this.appcode = props.appcode || appCode;
    this.primaryId = accCard.primaryId; //主键ID
    this.dataSource = acc_data_source; //缓存
    this.moduleId = moduleId; //多语ID
    if (this.appcode === "36010NBFOO") {
      (this.pageId = "36010NBFOO_bankacc_card"),
        (this.accListTitle = "36010NBFOO-000001");
      this.nodekey = "36010NBFO_acc_card";
    } else if (this.appcode === "36010NBFOG") {
      this.pageId = "36010NBFOG_bankacc_card";
      this.accListTitle = "36010NBFOG-000001";
      this.nodekey = "36010NBFO_acc_card";
    } else {
      this.pageId = "36010NBFO_bankacc_card";
      this.accListTitle = "36010NBFO-000045";
      this.nodekey = "36010NBFO_acc_card";
    }
    this.state = {
      isPaste: false, //table处是否粘贴
      checkedRows: [], //table处当前选中行的index集合
      printOut: {
        //打印输出使用
        ...accPrintData,
        outputType: "output"
      },
      showPagination: true
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
      moduleId: [this.moduleId, this.appcode],
      domainName: "tmpub",
      callback
    });
  }

  afterGetLang() {
    window.onbeforeunload = () => {
      if (!["browse"].includes(this.props.getUrlParam("status"))) {
        return (
          this.state.json && this.state.json["36010NBFO-000015"]
        ); /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
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
    let status = this.props.getUrlParam("status");
    if (id) {
      getCardData.call(this, id, true);
      if (status === "edit") {
        this.props.form.setFormItemsDisabled(this.formId, {
          code: true
        });
      }
    } else {
      this.props.form.setFormItemsValue(this.formId, {
        nonbankfininstitution: {
          value: this.props.getUrlParam("namePk"),
          display: this.props.getUrlParam("name")
        },
        accountproperty: {
          value: "0",
          display:
            this.state.json &&
            this.state.json["36010NBFO-000009"] /* 国际化处理： 公司*/
        },
        enable_state: {
          value: "1",
          display:
            this.state.json &&
            this.state.json["36010NBFO-000016"] /* 国际化处理： 已启用*/
        }
      });
      billHeadVisible.call(this, false, false);
    }
    this.setState({ name: this.props.getUrlParam("name") });
  }

  render() {
    let { cardTable, form, button, cardPagination, BillHeadInfo } = this.props;
    let { printOut } = this.state;
    let { createCardTable } = cardTable;
    let { createBillHeadInfo } = BillHeadInfo;
    let { createForm } = form;
    let { createCardPagination } = cardPagination;
    let { createButtonApp } = button;
    return (
      <div className="nc-bill-card">
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.state.json && this.state.json[this.accListTitle], //标题/* 国际化处理： 非银行金融机构银行账户*/
                backBtnClick: () => {
                  //返回按钮的点击事件
                  let namepk = this.props.getUrlParam("namePk");
                  handleClick.call(this, "list", {
                    namePk: namepk,
                    appcode: this.appcode,
                    pagecode: list.pageCode
                  });
                }
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: accCard.btnCode,
                onButtonClick: buttonClick.bind(this)
              })}
            </div>
            {this.state.showPagination && (
              <div
                className="header-cardPagination-area"
                style={{ float: "right" }}
              >
                {createCardPagination({
                  dataSource: this.dataSource,
                  handlePageInfoChange: pageClick.bind(this)
                })}
              </div>
            )}
          </NCDiv>
        </NCAffix>
        <div className="nc-bill-top-area">
          <div className="nc-bill-form-area">
            {createForm(this.formId, {
              onAfterEvent: afterEvent.bind(this)
            })}
          </div>
        </div>
        <div className="nc-bill-bottom-area">
          <div className="nc-bill-table-area">
            {createCardTable(this.tableId, {
              tableHead: getTableHead.bind(this),
              showCheck: true,
              showIndex: true,
              onSelected: bodySelectedEvent.bind(this),
              onSelectedAll: bodySelectedEvent.bind(this),
              onAfterEvent: afterTableEvent.bind(this)
            })}
          </div>
        </div>
        {/* 打印模版 */}
        <PrintOutput
          ref="printOutput"
          url={`${baseReqUrl}${javaUrl.accPrint}.do`}
          data={printOut}
        />
      </div>
    );
  }
}

// Card = createPage({
// 	orderOfHotKey: [ 'head', 'pk_bankacc_b' ]
// })(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/