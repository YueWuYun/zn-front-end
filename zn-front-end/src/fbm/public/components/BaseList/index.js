/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 列表页组件
 created by：liyaoh 2018-09-30
*/
import { ajax, base, cardCache, high } from "nc-lightapp-front";
import React, { Component } from "react";
import NCCCCBalance from "src/ccc/public/Balance/list/index";
import NCCOriginalBalance from "src/cmp/public/restmoney/list/index";
import { InnerAccoutDialog } from "../../../../tmpub/pub/inneraccount/list/index";
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import { list } from "../../container";
import { SDBookLinkBill, voucherLinkBill } from "../../container/common";
import { initList } from "../../container/page.js";
import AcceptModal from "../AcceptModal";
import ConfirmreceiptCom from "../ConfirmreceiptCom";
import DisabledCom from "../DisabledCom";
import ImpawnBackCom from "../impawnbackcom";
import ReturnCom from "../ReturnCom";
import TallyCom from "../TallyCom";
import {
  buttonClick,
  getListData,
  pageInfoClick,
  searchBtnClick,
  selectedEvent
} from "./events";
import "./index.less";
const { ExcelImport } = high;

let { NCAffix, NCTabsControl, NCDiv } = base;
const { NCTabPane } = NCTabs;
const {
  NCUploader,
  PrintOutput,
  ApprovalTrans,
  ApproveDetail,
  Inspection
} = high;
let { setDefData, getDefData } = cardCache;

class BaseList extends Component {
  static defaultProps = {
    showSearch: true, //默认显示查询区
    linkItems: [] //需要显示的联查组件
  };

  constructor(props) {
    super(props);
    for (let k in props.constant) {
      this[k] = props.constant[k];
    }

    this.selectedPKS = [];
    this.state = {
      json: {},
      inlt: null,
      tabNum: {}, //tab页签显示数量
      //输出用
      outputData: {
        funcode: "", //功能节点编码，即模板编码
        nodekey: "", //模板节点标识
        outputType: "output"
      },
      activeTab: props.listTabs && props.listTabs.defaultKey,
      showUploader: false, //是否显示附件上传
      billInfo: {}, //附件上传信息
      showApproveDetail: false, //是否显示审批详情
      showCCC: false, //显示联查授信额度
      showCCCBalance: null, //授信pk
      compositedata: null, //指派信息
      compositedisplay: false, //是否显示指派
      showOriginalBalance: false, //显示联查余额
      showOriginalData: "", //联查余额数据
      showNtbDetail: false, //显示预算计划
      showInneraccpk: null, //内部结算账户pk
      showInnerAccount: false, //显示内部结算账户
      ntbdata: null, //预算计划数据
      curPk: "", //当前选中数据的pk
      linkPks: "", //备份联查时传入的pk
      acceptModalShow: false // 是否显示受理Modal框
    };
    let app_code = props.getSearchParam("c");
    if (app_code) {
      this.appcode = app_code;
    }
  }
  componentWillMount() {
    let callback = (json, status, inlt) => {
      // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
      if (status) {
        this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
      } else {
        console.log("未加载到多语资源"); // 未请求到多语资源的后续操作
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: "fbmpublic",
      domainName: "fbm",
      callback
    });
  }

  componentDidMount() {
    //凭证联查单据
    let scene = this.props.getUrlParam("scene");
    let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
    // let callback = (json, status, inlt) => {
    //     // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
    //     if (status) {
    //         this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
    //     } else {
    //         console.log(未加载到多语资源); // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源,未加载到多语资源,未请求到多语资源的后续操作*//* 国际化处理： 未加载到多语资源*/
    //     }
    // };
    this.props._initTemplate.call(this, this.props); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
    this.props.listDidMount && this.props.listDidMount.call(this);
    if (scene && scene === "fip") {
      //fip代表会计平台
      voucherLinkBill.call(this);
    } else if (scene && scene === "linksce") {
      // 联查场景
      let pk = this.props.getUrlParam("id");
      this.setState({ linkPks: pk });
      SDBookLinkBill.call(this, pk);
    } else if (pk_ntbparadimvo) {
      //预算反联查
      this.ntbLinkBill.call(this);
    }
    this.setCacheTabNum();

    // this.props.MultiInit.getMultiLang({
    //     moduleId: MODULE_ID,
    //     domainName: "bond",
    //     callback
    // });
  }

  //设置选中页签和页签数字
  setCacheTabNum = () => {
    let numvalues = getDefData("numvalues", "tabCache");
    let selectedGroup = getDefData("selectedGroup", "tabCache");
    numvalues && this.setState({ tabNum: numvalues });
    selectedGroup && this.setState({ activeTab: selectedGroup });
  };
  // 查询区渲染完成回调函数
  renderCompleteEvent = () => {
    this.initOid();
    // 默认先查询
    // this.queryFirst();
  };
  initOid = () => {
    let queryInfo = this.props.search.getQueryInfo(this.searchId, false);
    if (queryInfo && queryInfo.oid) {
      let oid = queryInfo.oid;
      this.oid = oid;
    }
  };
  //初始化四状态默认值的时候的回调函数
  setInitValueEvent = () => {
    this.queryFirst();
  };
  queryFirst = () => {
    let searchdata = this.props.search.getQueryInfo(this.searchId);
    if (searchdata && JSON.stringify(searchdata) != "{}") {
      // 去查询
      let allData = this.props.table.getAllTableData(this.tableId);
      if (allData && allData.rows.length == 0) {
        // 未查询过
        searchBtnClick.call(this, this.props, searchdata.querycondition);
      }
    }
  };
  //列表查询成功后的回调函数
  queryListCallback = res => {
    if (!this.props.listTabs) return;
    //设置tab页签显示的数字
    let numsObj = {};
    if (res.data) {
      let resNums = res.data.groupData;
      this.props.listTabs.items.map(item => {
        if (item.name) {
          numsObj[item.name] = resNums[item.name];
        }
      });
      console.log("tabnums", numsObj);
      setDefData("numvalues", "tabCache", numsObj); //页签数字放到缓存中
      this.setState({
        tabNum: numsObj
      });
    }
  };

  handleDoubleClick = (record, index, props) => {
    props.pushTo("/card", {
      status: "browse",
      id: record[this.primaryId].value,
      pagecode: this.pageId,
      scene: this.props.getUrlParam("scene")
    });
  };

  //页签筛选
  handleTabChange = status => {
    this.props.listTabs.tabChangeServal.call(this, status, serval => {
      let searchCache = getDefData(
        this.searchCache.key,
        this.searchCache.dataSource
      );
      setDefData("selectedGroup", "tabCache", status);
      this.setState({ activeTab: status }, () => {
        searchCache && getListData.call(this, [serval]);
      });
    });
  };

  //提交即指派
  getAssginUsedr = value => {
    list.listCommit.call(this, {
      data: {
        pks: this.state.curPk,
        userObj: value
      },
      successAfter: () => {
        this.compositeTurnOff();
      }
    });
  };

  //取消提交即指派
  compositeTurnOff = () => {
    this.setState({
      compositedata: null,
      compositedisplay: false
    });
  };

  //预算反联查单据
  ntbLinkBill = () => {
    let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
    if (!pk_ntbparadimvo) return;
    let data = {
      pageCode: this.pageId,
      pk: pk_ntbparadimvo,
      modulecode: this.modulecode,
      extParam: {
        pk_ntbparadimvo
      }
    };
    ajax({
      url: this.API_URL.ntbLink,
      data,
      success: res => {
        let { data } = res;
        if (data) {
          let { grid, head } = data;
          let gridRow = grid && grid[this.tableId].rows;
          if (gridRow.length > 1) {
            this.props.table.setAllTableData(
              this.tableId,
              data.grid[this.tableId]
            );
            // 显示全部页签
            this.setState({
              activeTab: this.props.listTabs
            });
          } else if (gridRow.length == 1) {
            let pk = grid[this.tableId].rows[0].values[this.primaryId].value;
            this.props.pushTo("/card", {
              status: "browse",
              id: pk,
              scene: "linksce",
              showBackBtn: false
            });
          }
        }
      }
    });
  };

  render() {
    let {
      table,
      button,
      search,
      ncmodal,
      BillHeadInfo,
      cardTable,
      form,
      modal,
      cardPagination,
      transferTable,
      socket
    } = this.props;
    const { createTransferList } = transferTable;
    let {
      showSearch,
      listTabs,
      linkItems,
      _buttonClick,
      _bodyButtonClick,
      _doubleClickEvent,
      _searchBtnClick,
      _selectedEvent,
      _componentInitFinished,
      initImport,
      _renderCompleteEvent
    } = this.props;
    let {
      showUploader,
      billInfo,
      outputData,
      tabNum,
      showApproveDetail,
      compositedata,
      compositedisplay
    } = this.state;
    let { createSimpleTable, getTablePageInfo } = table;
    let { NCCreateSearch } = search;
    let { createButtonApp } = button;
    let { createModal } = ncmodal;
    let { createBillHeadInfo } = BillHeadInfo;
    let scene = this.props.getUrlParam("scene");
    return (
      <div className="nc-bill-list">
        {/* 适配 socket 开始 */}
        {socket.connectMesg({
          tableAreaCode: this.tableId,
          billpkname: this.primaryId,
          billtype: this.billtype
        })}
        {/* 适配 socket 结束 */}
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.props.pageTitle,
                initShowBackBtn: false
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: this.props.headBtnArea,
                onButtonClick: _buttonClick
                  ? _buttonClick.bind(this)
                  : buttonClick.bind(this)
              })}
            </div>
          </NCDiv>
        </NCAffix>
        {!scene && showSearch && (
          <div className="nc-bill-search-area">
            {NCCreateSearch(this.searchId, {
              clickSearchBtn: _searchBtnClick
                ? _searchBtnClick.bind(this)
                : searchBtnClick.bind(this),
              showAdvBtn: true, //  显示高级按钮
              renderCompleteEvent: _renderCompleteEvent
                ? _renderCompleteEvent.bind(this)
                : this.renderCompleteEvent // 查询区渲染完成回调函数  //初始化状态默认值的时候的回调函数
            })}
          </div>
        )}
        {!scene && listTabs && (
          <NCTabs
            activeKey={this.state.activeTab}
            onChange={val => this.handleTabChange.call(this, val)}
          >
            {listTabs.items.map(item => {
              let num =
                listTabs.allKey != item.key
                  ? " (" + ((item.name && tabNum[item.name]) || 0) + ")"
                  : "";
              let tabText =
                listTabs.allKey != item.key ? item.title + num : item.title;
              return <NCTabPane key={item.key} tab={tabText} />;
            })}
          </NCTabs>
        )}
        <div className="nc-bill-table-area">
          {createSimpleTable(this.tableId, {
            handlePageInfoChange: pageInfoClick.bind(this),
            showCheck: true,
            showIndex: this.showIndex ? this.showIndex : true,
            dataSource: this.dataSource,
            pkname: this.primaryId,
            onRowDoubleClick: _doubleClickEvent
              ? _doubleClickEvent.bind(this)
              :this.handleDoubleClick.bind(this),
            onSelected: _selectedEvent
              ? _selectedEvent.bind(this)
              : selectedEvent.bind(this),
            onSelectedAll: _selectedEvent
              ? _selectedEvent.bind(this)
              : selectedEvent.bind(this),
            componentInitFinished: _componentInitFinished
              ? _componentInitFinished.bind(this)
              : initList.bind(this)
          })}
        </div>
        {/* 打印输出 */}
        <PrintOutput
          ref="printOutput"
          url={this.API_URL.print}
          data={outputData}
        />
        {/* 附件 */}
        {showUploader && (
          <NCUploader
            placement={"bottom"}
            {...billInfo}
            onHide={() => {
              this.setState({
                showUploader: false
              });
            }}
            // 用于判断，是否属于上游单据，上游单据只能使用附件的下载功能，不可上传
            disableButton={
              this.state.disableButton ? this.state.disableButton : false
            }
          />
        )}
        {/* 联查审批详情 */}
        {linkItems.includes("approveDetail") && (
          <ApproveDetail
            show={showApproveDetail}
            billtype={this.billtype}
            billid={billInfo.billId}
            close={() => {
              this.setState({
                showApproveDetail: false
              });
            }}
          />
        )}
        {/* 提交即指派 */}
        {compositedisplay && (
          <ApprovalTrans
            title={
              this.state.json["fbmpublic-000009"]
            } /* 国际化处理： 指派*/ /* 国际化处理： 指派*/
            data={compositedata}
            display={compositedisplay}
            getResult={this.getAssginUsedr}
            cancel={this.compositeTurnOff}
          />
        )}
        {/*联查授信*/}
        {linkItems.includes("creditBalance") && (
          <NCCCCBalance
            showmodal={this.state.showCCC}
            showCCCBalance={this.state.showCCCBalance}
            // 点击确定按钮的回调函数
            onSureClick={() => {
              //关闭对话框
              this.setState({
                showCCC: false
              });
            }}
            onCloseClick={() => {
              //关闭对话框
              this.setState({
                showCCC: false
              });
            }}
          />
        )}
        {/*联查内部结算账户 */}
        {this.state.showInnerAccount && (
          <InnerAccoutDialog
            showModal={this.state.showInnerAccount}
            accpk={this.state.showInneraccpk}
            closeModal={() => {
              //关闭对话框
              this.setState({
                accpk: null,
                showInnerAccount: false
              });
            }}
          />
        )}
        {/* 联查余额 */}
        {linkItems.includes("bankBalance") && (
          <NCCOriginalBalance
            showmodal={this.state.showOriginalBalance}
            showOriginalData={this.state.showOriginalData}
            // 点击确定按钮的回调函数
            onSureClick={() => {
              //关闭对话框
              this.setState({
                showOriginalBalance: false
              });
            }}
            onCloseClick={() => {
              //关闭对话框
              this.setState({
                showOriginalBalance: false
              });
            }}
          />
        )}
        {/** 联查预算 **/}
        {linkItems.includes("ntb") && (
          <Inspection
            show={this.state.showNtbDetail}
            sourceData={this.state.ntbdata}
            cancel={() => {
              this.setState({ showNtbDetail: false });
            }}
            affirm={() => {
              this.setState({ showNtbDetail: false });
            }}
          />
        )}
        <DisabledCom
          context={this}
          show={this.state.disabledComShow}
          title={this.state.json["fbmpublic-000010"]} /* 国际化处理： 作废原因*/
          signCode={this.disableReason}
          onSureCallback={list.listInvalid.bind(this)}
        />
        {/* 确认收妥 */}
        <ConfirmreceiptCom
          context={this}
          show={this.state.confirmreceiptComShow}
          title={this.state.json["fbmpublic-000011"]} /* 国际化处理： 确认收妥*/
          signCode={this.confirmreceipt}
          onSureCallback={list.listConfirmreceipt.bind(this)}
        />
        <ReturnCom
          context={this}
          show={this.state.returnComShow}
          title={this.state.json["fbmpublic-000012"]} /* 国际化处理： 退回原因*/
          signCode={this.returnReason}
          onSureCallback={list.listReturn.bind(this)}
        />
        <TallyCom
          context={this}
          show={this.state.tallyComShow}
          title={
            this.state.json["fbmpublic-000089"]
          } /* 国际化处理： 记账-计划*/
          signCode={this.tallyPlan}
          onSureCallback={list.listTally.bind(this)}
        />
        <ImpawnBackCom
          context={this}
          show={this.state.impawnbackComShow}
          title={this.state.json["fbmpublic-000018"]} /* 国际化处理： 解除质押*/
          signCode={this.impawnbackAreaCode}
          impawnbackpersonid={this.impawnbackpersonid}
          impawnbackdate={this.impawnbackdate}
          onSureCallback={list.impawnBackInstr.bind(this)}
        />
        <AcceptModal
          show={this.state.acceptModalShow}
          title={this.state.json["fbmpublic-000091"]}
          content={this.state.json["fbmpublic-000091"]}
          sureButtonText={this.state.json["fbmpublic-000094"]}
          denyButtonText={this.state.json["fbmpublic-000095"]}
          cancelButtonText={this.state.json["fbmpublic-000004"]}
          onSure={() => {
            // 是
            this.acceptData.data = Object.assign(
              { extParam: { isacceptednow: "Y" } },
              this.acceptData.data
            );
            list.listOperation.call(
              this,
              Object.assign({ name: "accept" }, this.acceptData)
            );
            this.setState({
              acceptModalShow: false
            });
          }}
          onDeny={() => {
            // 否
            this.acceptData.data = Object.assign(
              { extParam: { isacceptednow: "N" } },
              this.acceptData.data
            );
            list.listOperation.call(
              this,
              Object.assign({ name: "accept" }, this.acceptData)
            );
            this.setState({
              acceptModalShow: false
            });
          }}
          onCancel={() => {
            this.setState({
              acceptModalShow: false
            });
          }} // 取消
          onClose={() => {
            this.setState({
              acceptModalShow: false
            });
          }}
        />
        {/* {导入} */}
        {createModal("importModal", {
            noFooter: true,
            className: "import-modal",
            hasBackDrop: false
          })}
          {initImport && (
            <ExcelImport
              {...this.props}
              moduleName={this.modelname} //模块名
              billType={this.billtype} //单据类型
              pagecode={this.cardPageCode}
              appcode={this.appcode}
              selectedPKS={this.selectedPKS}
            />
          )}
      </div>
    );
  }
}

export default BaseList;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/