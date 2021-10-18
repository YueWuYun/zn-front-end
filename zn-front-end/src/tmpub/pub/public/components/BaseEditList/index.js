/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**
 * 整表编辑列表组件
 * @author dongyue7
 */

import { base } from "nc-lightapp-front";
import React, { Component } from "react";
import { buttonClick } from "./event/editListButtonClick";
import { onSearchClick } from "./event/editListSearch";
import initTemplate from "./event/editListInitTemplate";
import { selectedEvent } from "./event/events";
import { searchButtonClick } from "./event/editListSearch";
let { NCAffix, NCDiv } = base;

class BaseEditList extends Component {
  constructor(props) {
    super(props);
    for (let k in props.constant) {
      this[k] = props.constant[k];
    }
    this.state = {
      showToast: false, // 查询提示标识
      showSearch: true, // 查询区显示标识
      json: {}, // 多语json
      inlt: null, // 多语资源
      status: "browse", // 页面状态
      editDelData: {
        // 编辑态删除暂存数据结构
        pageid: this.pageId,
        templetid: this.tableOid,
        model: {
          areaType: "table",
          areacode: this.tableId,
          rows: []
        }
      }
    };
    // props._initTemplate.call(this, props, props._afterSetMeta, props._beforeSetMeta, this.props.json);	// 节点传入的initTemplate，目前public中有公共的，若节点有其他需求可传自己的方法
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      if (status) {
        this.setState({ json, inlt }, () => {
          this.props._initTemplate
            ? this.props._initTemplate.call(
                this,
                this.props,
                this.props._afterSetMeta,
                this.props._beforeSetMeta,
                json
              )
            : initTemplate.call(
                this,
                this.props,
                this.props._afterSetMeta,
                this.props._beforeSetMeta,
                json
              );
        });
      } else {
        //console.log("未加载到多语资源");
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: [this.moduleId, "36010PUBLIC"],
      domainName: "tmpub",
      callback
    });
  }

  componentDidCatch(error, info) {
    //console.log({ error, info });
  }

  render() {
    let {
      button,
      search,
      editTable,
      _afterEvent,
      _searchAfterEvent,
      _beforeEvent,
      BillHeadInfo
    } = this.props;
    let { showSearch } = this.state;
    let { createEditTable } = editTable;
    let { NCCreateSearch } = search;
    let { createButtonApp } = button;
    const { createBillHeadInfo } = BillHeadInfo;
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
                title: this.state.json[this.pageTitle],
                initShowBackBtn: false
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: this.btnCode,
                onButtonClick: buttonClick.bind(this)
              })}
            </div>
          </NCDiv>
        </NCAffix>
        {/* 查询区域 */}
        {showSearch && (
          <div className="nc-singleTable-search-area">
            {NCCreateSearch(this.searchId, {
              oid: this.searchOid,
              showAdvBtn: false,
              showClearBtn: false,
              clickSearchBtn: onSearchClick.bind(this),
              onAfterEvent: _searchAfterEvent && _searchAfterEvent.bind(this),
              renderCompleteEvent: () => {
                searchButtonClick.call(this, this.props); // 整表编辑的档案都有预置数据，若无预置数据，这里需控制
              }
            })}
          </div>
        )}
        {/* 表体区域 */}
        <div className="nc-singleTable-table-area">
          {createEditTable(this.tableId, {
            showCheck: true,
            adaptionHeight: true,
            showIndex: this.showIndex || true,
            onSelected: selectedEvent.bind(this, this.props),
            onSelectedAll: selectedEvent.bind(this, this.props),
            onAfterEvent: _afterEvent && _afterEvent.bind(this),
            onBeforeEvent: _beforeEvent && _beforeEvent.bind(this)
          })}
        </div>
      </div>
    );
  }
}

export default BaseEditList;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/