/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/***
 *
 * @Description: 贴现试算
 * @author: zhoulyu
 * @date: 2019年11月27日 下午5:05:41
 * @version ncc2004
 */
import { base, createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { list, searchCache } from "../cons/constant";
import { afterEvent } from "./events/afterEvent";
import { buttonClick } from "./events/buttonclick";
import { buttonVisible } from "./events/buttonVisible";
import initTemplate from "./events/initTemplate";
import { searchButtonClick } from "./events/search";

let { NCAffix, NCDiv } = base;

class List extends Component {
  constructor(props) {
    super(props);
    this.tableId = list.tableCode;
    this.searchId = list.searchCode;
    this.formId = list.headCode;
    this.pageid = list.pageCode;
    this.appcode = props.getSearchParam("c") || props.getUrlParam("c");
    this.selectedPKS = [];
    this.searchCache = searchCache;
    this.state = {
      billtype: "36H8"
    };
    initTemplate.call(this, props);
  }

  componentDidMount() {
    buttonVisible.call(this, this.props);
  }

  //查询区渲染完成之后的回调事件
  renderCompleteEvent = () => {
    let muti = this.props.MutiInit.getIntl("36180DTC");
    let money = muti && muti.get("36180DTC-000021"); /* 国际化处理： 票据金额*/
    let start = muti && muti.get("36180DTC-000022"); /* 国际化处理： 开始*/
    let end = muti && muti.get("36180DTC-000023"); /* 国际化处理： 结束*/
    this.props.search.setTemlateByField(
      this.searchId,
      "money",
      "defaultPlaceholder",
      { start: money + start, end: money + end }
    );
  };
  render() {
    let { button, search, editTable, form, BillHeadInfo } = this.props;
    let { createForm } = form;
    let { createEditTable } = editTable;
    let { NCCreateSearch } = search;
    let { createButtonApp } = button;
    const { createBillHeadInfo } = BillHeadInfo;
    let muti = this.props.MutiInit.getIntl("36180DTC");
    return (
      <div className="nc-single-table">
        {/* 标题及肩部按钮区域 */}
        <NCAffix>
          <NCDiv
            areaCode={NCDiv.config.HEADER}
            className="nc-singleTable-header-area"
          >
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title:
                  muti &&
                  muti.get("36180DTC-000000") /* 国际化处理： 贴现试算*/,
                initShowBackBtn: false
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: list.btnCode,
                onButtonClick: buttonClick.bind(this)
              })}
            </div>
          </NCDiv>
        </NCAffix>
        {/* 查询区域 */}
        <div className="nc-singleTable-search-area remove-block">
          {NCCreateSearch(this.searchId, {
            oid: this.searchOid,
            showAdvBtn: true, //  显示高级按钮
            showClearBtn: true,
            clickSearchBtn: searchButtonClick.bind(this),
            renderCompleteEvent: this.renderCompleteEvent //查询区渲染完成之后的回调事件
          })}
        </div>
        {/* 表头字段区域 */}
        <div
          className="nc-bill-top-area remove-block"
          style={{ "background-color": "#f6f6f6" }}
        >
          <div className="nc-bill-form-area">
            {createForm(this.formId, {
              onAfterEvent: afterEvent.bind(this)
            })}
          </div>
        </div>
        {/* 表体区域 */}
        <div className="nc-singleTable-table-area">
          {createEditTable(this.tableId, {
            showIndex: true,
            adaptionHeight: true, // 表格占满屏幕
            onSelected: buttonVisible.bind(this),
            onSelectedAll: buttonVisible.bind(this)
          })}
        </div>
      </div>
    );
  }
}

List = createPage({
  mutiLangCode: "36180DTC"
})(List);
//export default List;
ReactDOM.render(<List />, document.querySelector("#app"));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/