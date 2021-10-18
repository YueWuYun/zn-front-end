/* 
 列表页组件
*/
import { base, cardCache, high } from "nc-lightapp-front";
import React, { Component } from "react";
import NCCOriginalBalance from "src/cmp/public/restmoney/list/index";
import NCCCCBalance from "src/ccc/public/Balance/list/index";

import {
  baseListInitTemplate,
  buttonClick,
  compositeTurnOff,
  getAssginUsedr,
  handleTabChange,
  linkList,
  pageInfoClick,
  searchBtnClick,
  selectedEvent,
  toggleListHeadBtnDisabled,
} from "./events";
import Modal from "../Modal";
import "./index.less";
let { NCAffix, NCDiv, NCTabs } = base;
const { NCTabPane } = NCTabs;
const {
  NCUploader,
  PrintOutput,
  ApprovalTrans,
  ApproveDetail,
  Inspection,
} = high;
let { getDefData, setDefData } = cardCache;

class BaseList extends Component {
  constructor(props) {
    super(props);
    let { TabsConfig } = props;
    this.selectedPKS = [];
    this.state = {
      baseMultiLangData: {}, // 多语文件 Object
      inlt: null, // 可用来进行占位符的一些操作 Object
      curPk: "", // 当前选中数据的pk String
      tabKey: TabsConfig.activeKey, // 当前tab的key String
      showUploader: false, // 是否显示附件上传组件 Boolean
      showApproveDetail: false, // 是否显示审批详情 Boolean
      showCCC: false, // 显示联查授信额度 Boolean
      showCCCBalance: null, // 授信pk Array
      compositedata: null, // 指派信息 Object
      compositedisplay: false, // 是否显示指派 Boolean
      showOriginalBalance: false, // 是否显示联查余额 Boolean
      showOriginalData: "", // 联查余额数据 String
      showFundPlan: false, // 显示预算计划 Boolean
      fundPlanData: null, // 预算计划数据 Object
      //输出参数
      outputData: {
        funcode: "", // 功能节点编码，即模板编码
        oids: [], // 单据pk集合
        nodekey: "", // 模板节点标识
        outputType: "output", // 输出类型
      },
      billInfo: null, // 附件上传信息 Object
      tabs: null, // 页签集合 Array
    };
    let { ModalConfig } = this.props;
    if (ModalConfig) {
      let modalShowKeysObj = {};
      if (ModalConfig instanceof Array && ModalConfig.length > 0) {
        // 如果传入的是数组 遍历
        ModalConfig.map((item) => {
          let { showKey, defaultShow } = item;
          modalShowKeysObj[showKey] = defaultShow;
        });
      } else if (ModalConfig instanceof Object) {
        let { showKey, defaultShow } = ModalConfig;
        modalShowKeysObj[showKey] = defaultShow;
      }
      this.state = {
        ...this.state,
        ...modalShowKeysObj, // modal配置中的控制modal显示字段
      };
    }
  }

  componentDidMount() {
    let { mutliLangKey, pub_multilang, moduleId } = this.props.BillConfig;
    this.props.MultiInit.getMultiLang({
      moduleId: [mutliLangKey, pub_multilang],
      domainName: moduleId,
      callback: this.multiLangGetCallback,
    });
  }

  componentWillReceiveProps(nextProps) {
    // 将父组件传给子组件且作为子组件state属性值的参数进行更新，否则父组件传入值变化，不回更新相应state中属性
    let { info } = nextProps.TabsConfig;
    this.setState({
      tabs: info,
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
    let { TableConfig, table: tableUtil, BillConfig, getUrlParam } = this.props;

    let scene = getUrlParam("scene"); // 凭证反联差
    let pk_ntbparadimvo = getUrlParam("pk_ntbparadimvo"); // 预算反联查

    // 加载对应页面的模板信息及创建页面数据模型
    baseListInitTemplate.call(this, () => {
      if (!!pk_ntbparadimvo || !!scene) {
        // 如果为联查 或 为预算反联查
        linkList.call(
          this,
          BillConfig.pageId,
          TableConfig.tableId,
          BillConfig.primaryId
        );
      }
      // 设置头部按钮启用状态
      toggleListHeadBtnDisabled.call(this);
    });
  };

  // 从缓存中取出数据后 设置选中页签和页签数字及列表数据
  resetTableData = () => {
    let { BillConfig, TableConfig, table:tableUtil } = this.props;
    // 已经缓存的tabKey
    let tabKey = getDefData(
      BillConfig.tabKeyCache.key,
      BillConfig.tabKeyCache.dataSource
    );
    tabKey && this.setState({ tabKey: tabKey });

    // 已缓存的tabs
    let tabsCache = getDefData(
      BillConfig.tabsCache.key,
      BillConfig.tabsCache.dataSource
    );
    tabsCache && this.setState({ tabs: [...tabsCache] });
    // 取消选择列表数据,如果是卡片返回到列表页，需要将表格的界面视图同勾选数据保持一致
    let isBack = getDefData(
      "isBack",
      BillConfig.dataSource
    );
    if(isBack){
      tableUtil.selectAllRows(TableConfig.tableId, false);
      // 设置卡片返回标志位，用于列表页判断是否刷新列表
      setDefData("isBack", BillConfig.dataSource, false);
    }
  };

  /**
   * @param {*} record 某数据
   * @param {*} index 索引
   * @param {*} props props
   * 双击跳转到卡片页面
   */
  handleDoubleClick = (record, index) => {
    let { BillConfig, getUrlParam, pushTo } = this.props;
    // 联查场景
    let scene = getUrlParam("scene");
    // 将联查列表的主键传递给卡片，为满足卡片返回时列表还能正确显示数据
    let pks = getUrlParam("id");
    let urlParm = {
      status: "browse",
      id: record[BillConfig.primaryId].value,
      pagecode: BillConfig.cardPageCode,
      pks: pks
    };
    scene && (urlParm = { ...urlParm, scene });
    pushTo("/card", urlParm);
  };

  render() {
    let {
      BillConfig, // 单据基本配置信息
      TableConfig, // 表格配置信息
      TabsConfig, // 页签配置信息
      SearchConfig, // 查询区配置信息
      LinkConfig, // 联查配置信息
      BtnConfig, // 按钮配置信息
      ModalConfig, //  自定义modal框信息
      table: tableUtil,
      button: buttonUtil,
      search: searchUtil,
      ncmodal,
      BillHeadInfo,
      socket,
    } = this.props;
    let {
      baseMultiLangData,
      showUploader,
      billInfo,
      outputData,
      showApproveDetail,
      compositedata,
      compositedisplay,
      tabs,
      tabKey,
    } = this.state;
    let scene = this.props.getUrlParam("scene"); // 联查场景
    ModalConfig =
      ModalConfig &&
      (ModalConfig instanceof Array ? ModalConfig : [ModalConfig]);
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
                initShowBackBtn: false,
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
        {!scene && SearchConfig.show && (
          <div className="nc-bill-search-area">
            {searchUtil.NCCreateSearch(SearchConfig.searchId, {
              clickSearchBtn: SearchConfig.searchBtnClick
                ? SearchConfig.searchBtnClick.bind(this)
                : searchBtnClick.bind(this),
              showAdvBtn: true, //  显示高级按钮
              oid: SearchConfig.oid, // 查询模板的oid，用于查询查询方案
              // onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
            })}
          </div>
        )}
        {!scene && TabsConfig.show && tabs && (
          <div>
            <NCTabs activeKey={tabKey} onChange={handleTabChange.bind(this)}>
              {tabs.map((item) => (
                <NCTabPane tab={item.content + item.num} key={item.key} />
              ))}
            </NCTabs>
          </div>
        )}
        <div className="nc-bill-table-area">
          {TableConfig &&
            TableConfig.tableId &&
            tableUtil.createSimpleTable(TableConfig.tableId, {
              handlePageInfoChange: pageInfoClick.bind(this),
              showCheck: true,
              showIndex: true,
              dataSource: BillConfig.dataSource,
              pkname: BillConfig.primaryId,
              onRowDoubleClick: this.handleDoubleClick.bind(this),
              onSelected: TableConfig.selectedEvent
                ? TableConfig.selectedEvent.bind(this)
                : selectedEvent.bind(this),
              onSelectedAll: TableConfig.selectedEvent
                ? TableConfig.selectedEvent.bind(this)
                : selectedEvent.bind(this),
              componentInitFinished: () => {
                // 缓存数据赋值成功的钩子函数
                // 若初始化数据后需要对数据做修改，可以在这里处理
                // 重置列表数据
                this.resetTableData();
              },
            })}
        </div>
        {/* 打印输出 */}
        <PrintOutput
          ref="printOutput"
          url={BillConfig.API_URL.print}
          data={outputData}
          callback={this.onSubmit}
        />
        {/* 附件 */}
        {showUploader && (
          <NCUploader
            placement={"bottom"}
            {...billInfo}
            onHide={() => {
              this.setState({
                showUploader: false,
              });
            }}
          />
        )}
        {/* 联查审批详情 */}
        {Object.keys(LinkConfig).includes("ApproveDetail") && (
          <ApproveDetail
            show={showApproveDetail}
            billtype={BillConfig.billtype}
            billid={billInfo && billInfo.billId}
            close={() => {
              this.setState({
                showApproveDetail: false,
              });
            }}
          />
        )}
        {/* 提交即指派 */}
        {compositedisplay && (
          <ApprovalTrans
            title={baseMultiLangData["3617PUB-000023"]} /* 国际化处理： 指派*/
            data={compositedata}
            display={compositedisplay}
            getResult={getAssginUsedr.bind(this)}
            cancel={compositeTurnOff.bind(this)}
          />
        )}
        {/* 联查余额 */}
        {Object.keys(LinkConfig).includes("Balance") && (
          <NCCOriginalBalance
            showmodal={this.state.showOriginalBalance}
            showOriginalData={this.state.showOriginalData}
            // 点击确定按钮的回调函数
            onSureClick={() => {
              // 关闭弹框
              this.setState({
                showOriginalBalance: false,
              });
            }}
            onCloseClick={() => {
              // 关闭弹框
              this.setState({
                showOriginalBalance: false,
              });
            }}
          />
        )}
        {Object.keys(LinkConfig).includes("Credit") && (
          <NCCCCBalance
            showmodal={this.state.showCCC}
            showCCCBalance={this.state.showCCCBalance}
            // 点击确定按钮的回调函数
            onSureClick={() => {
              //关闭对话框
              this.setState({
                showCCC: false,
              });
            }}
            onCloseClick={() => {
              //关闭对话框
              this.setState({
                showCCC: false,
              });
            }}
          />
        )}

        {/* 联查预算 */}
        {Object.keys(LinkConfig).includes("FundPlan") && (
          <Inspection
            show={this.state.showFundPlan}
            sourceData={this.state.fundPlanData}
            cancel={() => {
              // 关闭弹框
              this.setState({ showFundPlan: false });
            }}
            affirm={() => {
              // 关闭弹框
              this.setState({ showFundPlan: false });
            }}
          />
        )}
        {/* 导入 */}
        {ncmodal.createModal("importModal", {
          noFooter: true,
          className: "import-modal",
          hasBackDrop: false,
        })}
        {/* 列表增加模态显示框 */}
        {ModalConfig &&
          ModalConfig.map((item) => (
            <Modal
              {...this.props}
              ModalConfig={{
                showModal: this.state[item.showKey],
                ...item,
                FormConfig: item.FormConfig && {
                  ...item.FormConfig,
                  beforeEvent:
                    item.FormConfig.beforeEvent &&
                    item.FormConfig.beforeEvent.bind(this), //  modal编辑前事件
                  afterEvent:
                    item.FormConfig.afterEvent &&
                    item.FormConfig.afterEvent.bind(this), //  modal编辑后事件
                },
                BtnConfig: item.BtnConfig && {
                  ...item.BtnConfig,
                  handleConfirm:
                    item.BtnConfig.handleConfirm &&
                    item.BtnConfig.handleConfirm.bind(this),
                  //  modal确认按钮处理函数
                  handleCancel:
                    item.BtnConfig.handleCancel &&
                    item.BtnConfig.handleCancel.bind(this),
                  //  modal取消按钮处理函数
                  onClose:
                    item.BtnConfig.onClose && item.BtnConfig.onClose.bind(this),
                  //  modal关闭按钮处理函数
                },
              }}
            />
          ))}
      </div>
    );
  }
}

export default BaseList;
