//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from "react";
import {
  createPage,
  createPageIcon,
  cardCache,
  high,
  base,
} from "nc-lightapp-front";
const { NCCheckbox: Checkbox } = base;
import { initTemplate } from "./events/initTemplate";
import { HeadBtnClick } from "./events/HeadBtnClick";
import { afterEvent } from "./events/afterEvent";
import { beforeEvent } from "./events/beforeEvent";
import { buttonCFSClick, buttonClick } from "./events/buttonClick";
import { searchBtnClick } from "./events/searchBtnClick";
import {
  LIST_BUTTON,
  SEARCHCACHE,
  LIST,
  MULTILANG,
  PRIMARTKEY,
  APPCODEN,
  CFSREQUESTURL,
  REQUESTURL,
} from "../constant";
import {
  pageInfoClick,
  handleDoubleClick,
  listSearch,
  getOffChangeData,
} from "./events/listOperator";
import { listCFSSearch, getCFSOffChangeData } from "./events/listOperatorCFS";
import { showOffChangeData } from "./events/showOffChangeData";
import { buttonVisibilityControl } from "./events/buttonVisibilityControl";

class List extends Component {
  constructor(props) {
    super(props);
    //this.pkname="111";
    this.appcode = props.getSearchParam("c");
    this.listPagecode = props.getSearchParam("p");
    this.updateConfigInfo();
    this.methodBind();
    this.state = {
      json: {},
      allBtn: [], //保存所有的按钮
      showAdvBtn: true, //查询区的高级和预置方案控制
      isShowOff: false, //列表是否显示停用数据
    };
  }

  componentWillMount() {
    // json： 多语json格式参数；
    // status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作；
    // inlt： 可用来进行占位符的一些操作
    let callback = (json, status, inlt) => {
      if (status) {
        initTemplate(this, this.props, json); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
        // 保存json和inlt到页面state中并刷新页面
        this.setState({ json, inlt });
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: MULTILANG.moduleId,
      domainName: MULTILANG.domainName,
      callback,
    });
  }

  componentDidMount() {
    console.log("componentDidMount");
    let { getDefData } = cardCache;
    if (getDefData(SEARCHCACHE.key, SEARCHCACHE.dataSource)) {
      this.props.button.setDisabled({
        [LIST_BUTTON.delete]: true,
        [LIST_BUTTON.refresh]: false,
      });
    } else {
      this.props.button.setDisabled({
        [LIST_BUTTON.delete]: true,
        [LIST_BUTTON.refresh]: true,
      });
    }
  }

  //this更新配置文件
  updateConfigInfo = () => {
    this.URLINFO = {};
    switch (this.appcode) {
      case APPCODEN.CCAppcode:
        this.URLINFO = REQUESTURL;
        break;
      case APPCODEN.CFAPPCODE:
        this.URLINFO = CFSREQUESTURL;
        break;
    }
  };

  //方法绑定this
  methodBind = () => {
    //公共
    this.searchBtnClick = searchBtnClick.bind(this);
    this.showOffChangeData = showOffChangeData.bind(this);
    this.HeadBtnClick = HeadBtnClick.bind(this);
    this.buttonVisibilityControl = buttonVisibilityControl.bind(this);
    if (this.appcode == APPCODEN.CCAppcode) {
      //成本中心结构
      this.listSearch = listSearch.bind(this);
      this.getOffChangeData = getOffChangeData.bind(this);
      this.buttonClick = buttonClick.bind(this);
    }
    if (this.appcode == APPCODEN.CFAPPCODE) {
      //成本要素结构
      this.listCFSSearch = listCFSSearch.bind(this);
      this.getCFSOffChangeData = getCFSOffChangeData.bind(this);
      this.buttonCFSClick = buttonCFSClick.bind(this);
    }
  };
  handlePageInfoChange = (props, config, pks) => {
    pageInfoClick({ ...props, json: this.state.json }, config, pks);
  };

  onRowDoubleClick = (record, index, props) => {
    handleDoubleClick(record, index, { ...props, json: this.state.json });
  };

  clickSearchBtn = (props) => {
    this.searchBtnClick({ ...props, json: this.state.json });
  };

  onButtonClick = (props, id) => {
    this.HeadBtnClick({ ...props, json: this.state.json }, id);
  };

  //显示停用数据
  showOffChange() {
    this.setState(
      {
        isShowOff: !this.state.isShowOff,
      },
      () => {
        showOffChangeData({ ...props, json: this.state.json }, 1);
      }
    );
  }
  render() {
    const { modal, table, search, editTable, title } = this.props;
    let { createEditTable } = editTable;
    let { createModal } = modal;
    const { createSimpleTable } = table;
    const { NCCreateSearch } = search;
    const { PrintOutput } = high;
    let status = this.props.editTable.getStatus(LIST.table_id); //状态来表示停用启用是否显示
    if (this.appcode == "10140CFS") {
      //成本中心结构，高级和预置查询方案不可见
      this.state.showAdvBtn = false;
    }
    return (
      <div className="nc-bill-list">
        {createModal("version", { noFooter: true })}
        <div className="nc-bill-header-area">
          <div className="header-title-search-area">
            {createPageIcon()}
            <h2 className="title-search-detail">{title}</h2>
          </div>
          <div>
            {status == "browse" && (
              <Checkbox
                //disabled
                onChange={this.showOffChange.bind(this)}
                checked={this.state.isShowOff}
              >
                显示停用
              </Checkbox>
            )}
          </div>
          <div className="header-button-area">
            {this.props.button.createButtonApp({
              area: LIST.head_btn_code,
              onButtonClick: this.onButtonClick,
            })}
          </div>
        </div>

        <div className="nc-bill-search-area">
          {NCCreateSearch(LIST.search_id, {
            dataSource: SEARCHCACHE.dataSource,
            showAdvBtn: this.state.showAdvBtn, //高级按钮和预置查询方案是否显示，默认不显示【成本要素，通过名称和编码查询，无需高级和预置查询方案】
            clickSearchBtn: this.clickSearchBtn,
          })}
        </div>

        <div className="table-area">
          {createEditTable(LIST.table_id, {
            showCheck: true,
            // isAddRow:true,
            showPagination: true,
            dataSource: SEARCHCACHE.dataSource,
            pkname: PRIMARTKEY.head_id,
            adaptionHeight: true,
            showIndex: true,
            handlePageInfoChange: this.handlePageInfoChange,
            onBeforeEvent: beforeEvent.bind(this),
            onAfterEvent: afterEvent.bind(this),
            // onRowDoubleClick: this.onRowDoubleClick
          })}
        </div>
        {/*<PrintOutput*/}
        {/*    ref="printOutput"*/}
        {/*    url={this.config.urls.printUrl}*/}
        {/*    data={{*/}
        {/*        funcode: '10140Z00', //功能节点编码，即模板编码*/}
        {/*        nodekey: 'termset', //模板节点标识*/}
        {/*        oids: this.state.pks, //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,*/}
        {/*        outputType: 'output'*/}
        {/*    }}*/}
        {/*    //callback={this.onSubmit}*/}
        {/*/>*/}
      </div>
    );
  }
}

List = createPage({})(List);
export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65