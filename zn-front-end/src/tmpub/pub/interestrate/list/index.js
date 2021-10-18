/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置列表页
 created by：liyaoh 2018-08-13
*/
import { base, high } from "nc-lightapp-front";
import React, { Component } from "react";
import {
  API_URL,
  app_code,
  DATA_SOURCE,
  LIST,
  nodekey
} from "../cons/constant";
import {
  buttonClick,
  initTemplate,
  pageInfoClick,
  searchBtnClick,
  selectedEvent
} from "./events";
let { NCAffix, NCDiv } = base;
const { PrintOutput } = high;

export default class List extends Component {
  constructor(props) {
    super(props);
    this.appcode = app_code;
    this.moduleId = "36010IRCO";
    this.searchId = LIST.search_id;
    this.tableId = LIST.table_id;
    this.pageId = LIST.page_id;
    this.nodekey = nodekey; //打印输出编码
    this.dataSource = DATA_SOURCE; //缓存key
    this.oid = LIST.search_oid; //查询区oid
    this.pageType = props.pageType;
    this.primaryId = LIST.primary_id;
    if (props.pageType === "group") {
      //集团
      this.appcode = "36010IRCG";
      this.pageId = "36010IRCG_list";
      this.nodekey = "36010IRCG_card";
      this.dataSource = "tm.pub.interestrateGroup.datasource";
      this.oid = "0001Z610000000024Y41";
      this.moduleId = "36010IRCG";
    } else if (props.pageType === "global") {
      //全局
      this.appcode = "36010IRC";
      this.pageId = "36010IRC_list";
      this.nodekey = "36010IRC_card";
      this.dataSource = "tm.pub.interestrateGlobal.datasource";
      this.oid = "0001Z610000000028M29";
      this.moduleId = "36010IRC";
    }
    this.state = {
      //输出用
      outputData: {
        funcode: "", //功能节点编码，即模板编码
        nodekey: "", //模板节点标识
        oids: [],
        outputType: "output"
      }
    };
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      if (status) {
        this.setState({ json, inlt }, () => {
          initTemplate.call(this, this.props, json);
        });
      } else {
        //console.log("未加载到多语资源");
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: [this.moduleId, "36010IR"],
      domainName: "tmpub",
      callback
    });
  }

  onSearchClick = () => {
    searchBtnClick.call(this, this.props);
  };

  handleDoubleClick = (record, index, props) => {
    props.pushTo("/card", {
      status: "browse",
      id: record[this.primaryId].value,
      pagecode: this.pageId
    });
  };

  render() {
    let { table, button, search, BillHeadInfo } = this.props;
    let { createSimpleTable } = table;
    let { NCCreateSearch } = search;
    let { createButtonApp } = button;
    const { createBillHeadInfo } = BillHeadInfo;
    return (
      <div className="nc-bill-list">
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.state.json && this.state.json[this.props.pageTitle],
                initShowBackBtn: false
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: LIST.head_btn_code,
                onButtonClick: buttonClick.bind(this)
              })}
            </div>
          </NCDiv>
        </NCAffix>
        <div className="nc-bill-search-area">
          {NCCreateSearch(this.searchId, {
            clickSearchBtn: searchBtnClick.bind(this),
            showAdvBtn: true, //  显示高级按钮
            oid: this.oid //查询模板的oid，用于查询方案
          })}
        </div>
        <div className="nc-bill-table-area">
          {createSimpleTable(this.tableId, {
            handlePageInfoChange: pageInfoClick.bind(this),
            showCheck: true,
            adaptionHeight: true,
            dataSource: this.dataSource,
            pkname: this.primaryId,
            onRowDoubleClick: this.handleDoubleClick.bind(this),
            onSelected: selectedEvent.bind(this),
            onSelectedAll: selectedEvent.bind(this),
            componentInitFinished: () => {
              //缓存数据赋值成功的钩子函数
              //若初始化数据后需要对数据做修改，可以在这里处理
            }
          })}
        </div>
        <PrintOutput
          ref="printOutput"
          url={API_URL.print}
          data={this.state.outputData}
          callback={this.onSubmit}
        />
      </div>
    );
  }
}

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/