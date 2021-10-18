/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/*
 * @PageInfo: 参照上游生成拉单来源
 * 选择票据列表
 *
 * @Date: 2019-10-26 22:31:36
 * @Last Modified by: wusib
 * @Last Modified time: 2019-10-26 22:31:36
 */
import { ajax, base, createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import { module_id } from "../cons/constant";
import { buttonClick, search_btnClick } from "./btnClicks";
import { REF21_CONST } from "./const";
import { search_afterEvent } from "./events";
import { initSingleTemplate, initTemplate } from "./init";
const { NCAffix, NCDiv } = base;

class TransferTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ntotalnum: 0,
      ntotalmny: 0,
      queryInfo: null
    };
    initTemplate.call(this, props);
  }
  componentDidMount() {
    let { hasCache } = this.props.transferTable;
    if (!hasCache(REF21_CONST.Ref21DataSource)) {
      this.props.transferTable.setTransferTableValue(
        REF21_CONST.formId,
        REF21_CONST.tableId,
        [],
        REF21_CONST.pk_head,
        REF21_CONST.pk_body
      );
    }
  }

  // 点击返回
  clickReturn = () => {
    this.props.pushTo("/list", {});
  };
  // 列设置
  handleClick = () => {};

  // 切换
  changeViewType = () => {
    if (!this.props.meta.getMeta()[REF21_CONST.singleTableId]) {
      initSingleTemplate.call(this, this.props); //加载主子拉平模板
    }
    this.props.transferTable.changeViewType();
  };
  // react：界面渲染函数
  render() {
    const { transferTable, button, search, BillHeadInfo } = this.props;
    const { NCCreateSearch } = search;
    const { createButtonApp } = button;
    const { createTransferTable } = transferTable;
    let { createBillHeadInfo } = BillHeadInfo;
    return (
      <div id="transferList" className="nc-bill-list">
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title:
                  this.props.MutiInit.getIntl("36180DA") &&
                  this.props.MutiInit.getIntl("36180DA").get(
                    "36180DA-000014"
                  ) /* 国际化处理： 选择票据号码 */,
                backBtnClick: this.clickReturn.bind(this)
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: "list_head",
                buttonLimit: 8,
                onButtonClick: buttonClick.bind(this),
                popContainer: document.querySelector(".header-button-area")
              })}
            </div>
          </NCDiv>
        </NCAffix>
        <div className="nc-bill-search-area">
          {NCCreateSearch(
            REF21_CONST.searchId,
            {
              clickSearchBtn: search_btnClick.bind(this),
              onAfterEvent: search_afterEvent.bind(this)
            }
            //模块id
          )}
        </div>
        <div className="nc-bill-transferTable-area">
          {createTransferTable({
            tableType: "simple", //表格默认显示的类型，默认为主子表 full:主子拉平 nest:主子表 simple:单表
            headTableId: REF21_CONST.formId, //表格组件id
            transferBtnText:
              this.props.MutiInit.getIntl("36180DA") &&
              this.props.MutiInit.getIntl("36180DA").get("36180DA-000013"), //转单按钮显示文字/* 国际化处理： 确认*/
            containerSelector: "#transferList",
            onTransferBtnClick: ids => {
              this.props.pushTo(REF21_CONST.destPageUrl, {
                status: "add",
                srcbilltype: "ref22",
                pagecode: REF21_CONST.transCardId
              });
            },
            dataSource: REF21_CONST.Ref21DataSource
          })}
        </div>
      </div>
    );
  }
}

TransferTable = createPage({
  mutiLangCode: module_id
})(TransferTable);
export default TransferTable;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/