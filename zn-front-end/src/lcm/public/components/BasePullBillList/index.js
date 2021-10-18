/* 
 拉单列表页组件
*/
import { base, pageTo } from "nc-lightapp-front";
import React, { Component } from "react";
import {
  baseListInitTemplate,
  buttonClick,
  searchBtnClick,
  list,
  listUtils,
  common,
} from "./events";
import "./index.less";
let { NCAffix, NCDiv } = base;

class BasePullBillList extends Component {
  constructor(props) {
    super(props);
    this.selectedPKS = [];
    this.state = {
      baseMultiLangData: {}, // 多语文件 Object
      inlt: null, // 可用来进行占位符的一些操作 Object
    };
  }

  componentDidMount() {
    let { mutliLangKey, pub_multilang, moduleId } = this.props.BillConfig;
    this.props.MultiInit.getMultiLang({
      moduleId: [mutliLangKey, pub_multilang],
      domainName: moduleId,
      callback: this.multiLangGetCallback,
    });
  }

  /**
   * 多语加载成功回调函数
   * @param {*} baseMultiLangData - 多语文件
   * @param {*} status - 请求状态
   * @param {*} inlt - 占位符
   */

  multiLangGetCallback = (baseMultiLangData, status, inlt) => {
    if (status) {
      this.setState({ baseMultiLangData, inlt }, this.multiLangSetCallback);
    } else {
      console.log(
        this.state.baseMultiLangData["3617PUB-000022"]
      ); /* 国际化处理： 未加载到多语资源 */
    }
  };

  multiLangSetCallback = () => {
    // 加载对应页面的模板信息及创建页面数据模型
    baseListInitTemplate.call(this, () => {
      // 设置头部按钮启用状态
      listUtils.toggleListHeadBtnDisabled.call(this);
    });
  };

  // 返回按钮点击函数
  handleBackClick = () => {
    pageTo.pushTo("/list");
  };

  render() {
    let {
      BillConfig, // 单据基本配置信息
      TableConfig, // 表格配置信息
      SearchConfig, // 查询区配置信息
      BtnConfig, // 按钮配置信息
      button: buttonUtil,
      search: searchUtil,
      BillHeadInfo,
      transferTable,
      socket,
    } = this.props;

    let { createTransferTable } = transferTable;
    return (
      <div className="nc-bill-list">
        {/* 适配 socket 开始 */}
        {socket.connectMesg({
          tableAreaCode: TableConfig.tableId,
          billpkname: BillConfig.primaryId,
          billtype: BillConfig.billtype,
          dataSource: BillConfig.dataSource,
        })}
        {/* 适配 socket 结束 */}
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {BillHeadInfo.createBillHeadInfo({
                title: BillConfig.pageTitle, //标题
                initShowBackBtn: true,
                backBtnClick: this.handleBackClick.bind(this), // 返回函数
              })}
            </div>
            <div className="header-button-area">
              {buttonUtil.createButtonApp({
                area: BtnConfig.btnArea,
                onButtonClick: BtnConfig.buttonClick
                  ? BtnConfig.buttonClick.bind(this)
                  : buttonClick.bind(this),
              })}
            </div>
          </NCDiv>
        </NCAffix>
        {
          <div className="nc-bill-search-area">
            {searchUtil.NCCreateSearch(SearchConfig.searchId, {
              clickSearchBtn: SearchConfig.searchBtnClick
                ? SearchConfig.searchBtnClick.bind(this)
                : searchBtnClick.bind(this),
              showAdvBtn: true, //  显示高级按钮
              oid: SearchConfig.oid, // 查询模板的oid，用于查询查询方案
            })}
          </div>
        }

        <div className="nc-bill-table-area">
          {TableConfig &&
            TableConfig.tableId &&
            createTransferTable({
              tableType: "simple",
              headTableId: TableConfig.tableId, // 表格组件id
              transferBtnText: this.state.baseMultiLangData["3617PUB-000048"], // 转单按钮显示文字 /* 国际化处理： 确认*/
              containerSelector: "#transferList",
              onTransferBtnClick: common.handleTransferListConfirm.bind(this),
              dataSource: BillConfig.dataSource,
              pkname: BillConfig.primaryId,
            })}
        </div>
      </div>
    );
  }
}

export default BasePullBillList;
