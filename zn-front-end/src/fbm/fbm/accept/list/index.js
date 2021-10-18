/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import {
  ajax,
  base,
  cardCache,
  createPage,
  high,
  toast
} from "nc-lightapp-front";
import React, { Component } from "react";
import NCCOriginalBalance from "../../../../cmp/public/restmoney/list";
import { InnerAccoutDialog } from "../../../../tmpub/pub/inneraccount/list/index";
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import {
  APP_CODE,
  BILL_TYPE,
  CARD_PAGE_CODE,
  DATASOURCE,
  LIST_PAGE_CODE,
  LIST_SEARCH_CODE,
  LIST_TABLE_CODE,
  URL_LIST
} from "./../cons/const";
import {
  buttonClick,
  buttonVisiable,
  initTemplate,
  pageInfoClick,
  searchButtonClick
} from "./events/index";
let { NCTabsControl, NCFormControl, NCAffix, NCDiv } = base;
const {
  ExcelImport,
  ApproveDetail,
  NCUploader,
  ApprovalTrans,
  PrintOutput,
  Inspection
} = high;
const { NCTabPane } = NCTabs;
let { setDefData, getDefData } = cardCache;

class List extends Component {
  constructor(props) {
    super(props);
    this.primaryId = "pk_accept";
    this.tableId = LIST_TABLE_CODE;
    this.pageId = LIST_PAGE_CODE;
    this.appcode = props.getSearchParam("c") || props.getUrlParam("c");
    this.state = {
      // start: 页签
      activeKey: "-1",
      numvalues: {},
      // end: 页签

      //start 附件
      showUploader: false,
      billId: "",
      billno: "",
      target: null,
      //end 附件

      //start 审批详情
      approveshow: false,
      billtype: "",
      //end 审批详情
      // 联查计划预算
      showNtbDetail: false, //是否显示联查预算
      ntbdata: {}, //联查预算参数数据信息
      // 提交即指派 start
      compositedata: null,
      compositedisplay: null,
      // 提交即指派 end

      //导入导出
      selectedPKS: [],
      // 打印输出
      printOutputInfo: {},

      // 银行账户余额 start
      // 是否展示期初余额联查框，true:展示，false:不展示
      showOriginal: false,
      // 联查余额取数据，将需要联查的数据赋值给我
      showOriginalData: [],
      // 银行账户余额 end

      //是否点击查询按钮
      isSearchBtn: 1,

      //联查内部账户余额
      //是否展示
      showInnerAcc: false,
      //联查内部账户余额pk
      showInnerAccData: null
    };
    initTemplate.call(this, props);
  }

  componentWillMount() {}

  componentDidMount() {
    //获取页签数据
    let numvalues = getDefData("numvalues", DATASOURCE);
    let activeKey = getDefData("activeKey", DATASOURCE);
    if (numvalues && activeKey) {
      this.setState({
        numvalues: numvalues,
        activeKey: activeKey
      });
    }
    buttonVisiable.call(this, this.props);
  }
  /**查询区渲染完成回调函数 */
  myRenderCompleteEvent = () => {
    let muti = this.props.MutiInit.getIntl("36180BP"); //this.moduleId
    let money = muti && muti.get("36180BP-000035"); /* 国际化处理： 票据金额*/
    let start = muti && muti.get("36180BP-000036"); /* 国际化处理： 开始*/
    let end = muti && muti.get("36180BP-000037"); /* 国际化处理： 结束*/
    this.props.search.setTemlateByField(
      LIST_SEARCH_CODE,
      "billmoney",
      "defaultPlaceholder",
      { start: money + start, end: money + end }
    );
  };
  //页签筛选
  navChangeFun = (status, className, e) => {
    let tabkey = this.state.activeKey;
    if (tabkey != status) {
      this.setState(
        {
          activeKey: status,
          isSearchBtn: -1
        },
        () => {
          searchButtonClick.call(this);
        }
      );
      return;
    } else {
      this.setState({
        activeKey: status
      });
      return;
    }
  };

  //行双击
  doubleClick = (record, index, props, e) => {
    props.pushTo("/card", {
      status: "browse",
      id: record.pk_accept && record.pk_accept.value,
      pagecode: CARD_PAGE_CODE
    });
  };
  // 附件的关闭点击
  onHideUploader = () => {
    this.setState({
      showUploader: false
    });
  };
  getAssginUsedr = value => {
    let that = this;
    let selectDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks = [];
    let tss = [];
    if (selectDatas && selectDatas.length > 0) {
      selectDatas.forEach(val => {
        pks.push(val.data.values.pk_accept.value);
        tss.push(val.data.values.ts.value);
      });
    } else if (this.record != null) {
      pks.push(this.record.pk_accept.value);
      tss.push(this.record.ts.value);
    } else {
      toast({
        color: "waring",
        content:
          this.props.MutiInit.getIntl("36180BP") &&
          this.props.MutiInit.getIntl("36180BP").get(
            "36180BP-000027"
          ) /* 国际化处理： 指派传参，获取pk失败！*/
      });
      return;
    }
    let sendData = {
      pageid: LIST_PAGE_CODE,
      pks: pks,
      tss: tss,
      isCardOpt: false,
      userObj: value
    };
    let successcallback = function(res) {
      let { success, data } = res;
      if (success) {
        if (data && data.errMsg) {
          toast({ color: "warning", content: data.errMsg });
        } else {
          toast({
            color: "success",
            content:
              this.props.MutiInit.getIntl("36180BP") &&
              this.props.MutiInit.getIntl("36180BP").get("36180BP-000028")
          }); /* 国际化处理： 提交成功*/
          that.setState({
            compositedata: res.data,
            compositedisplay: false
          });
          if (res.data.grid) {
            // 表体行发起的操作
            if (this.record != null) {
              let updateDataArr = [
                {
                  index: this.index,
                  data: {
                    values: res.data.grid[LIST_TABLE_CODE].rows[0].values
                  }
                }
              ];
              this.props.table.updateDataByIndexs(
                LIST_TABLE_CODE,
                updateDataArr
              );
              this.record = null;
              this.index = null;
            } else {
              let returnData = data.grid[LIST_TABLE_CODE].rows;
              //处理选择数据
              let selectedData = that.props.table.getCheckedRows(
                LIST_TABLE_CODE
              );
              if (selectedData && !that.index) {
                selectedData.forEach(val => {
                  let pk_accept_check = val.data.values.pk_accept.value;
                  returnData.forEach(retrunval => {
                    if (pk_accept_check === retrunval.values.pk_accept.value) {
                      let updateDataArr = [
                        {
                          index: val.index,
                          data: {
                            values: retrunval.values
                          }
                        }
                      ];
                      that.props.table.updateDataByIndexs(
                        LIST_TABLE_CODE,
                        updateDataArr
                      );
                    }
                  });
                });
              } else {
                that.props.table.updateDataByIndexs(LIST_TABLE_CODE, [
                  {
                    index: that.index,
                    data: {
                      values: returnData[0].values
                    }
                  }
                ]);
                that.index = null;
              }
            }
          }
        }
      }
    };
    doAjax.call(this, sendData, URL_LIST.COMMIT, successcallback);
  };
  // 提交即指派取消
  compositeTurnOff = value => {
    this.setState({
      compositedata: null,
      compositedisplay: false
    });
  };
  render() {
    let {
      form,
      button,
      table,
      insertTable,
      search,
      socket,
      modal,
      BillHeadInfo
    } = this.props;
    let { createSimpleTable } = table;
    let { NCCreateSearch } = search;
    let { createModal } = modal;
    let {
      showUploader,
      target,
      numvalues,
      showApproveDetail,
      showSearchCom,
      showTableCom,
      selectedPKS,
      billId,
      billno,
      billtype,
      activeKey,
      printOutputInfo,
      showNtbDetail,
      showInnerAcc,
      showOriginal
    } = this.state;
    const { createBillHeadInfo } = BillHeadInfo;
    return (
      <div className="nc-bill-list">
        {socket.connectMesg({
          tableAreaCode: LIST_TABLE_CODE,
          billpkname: this.primaryId,
          billtype: BILL_TYPE
        })}
        <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
          <div className="header-title-search-area">
            {createBillHeadInfo({
              title:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                  "36180BP-000014"
                ) /* 国际化处理： 票据付款*/,
              initShowBackBtn: false
            })}
          </div>
          <div className="header-button-area">
            {this.props.button.createButtonApp({
              area: "list_head",
              buttonLimit: 7,
              onButtonClick: buttonClick.bind(this),
              popContainer: document.querySelector(".header-button-area")
            })}
          </div>
        </NCDiv>
        <div className="nc-bill-search-area">
          {NCCreateSearch(
            LIST_SEARCH_CODE, //模块id
            {
              clickSearchBtn: searchButtonClick.bind(this), //   点击按钮事件
              showAdvBtn: true, //  显示高级按钮
              defaultConditionsNum: 5,
              // 添加高级查询区自定义页签 (fun), return Dom
              addAdvTabs: this.addAdvTabs,
              // onAfterEvent: afterEvent.bind(this),
              renderCompleteEvent: this.myRenderCompleteEvent // 查询区渲染完成回调函数
            }
          )}
        </div>
        <div className="tab-definInfo-area">
          <NCTabs
            activeKey={activeKey}
            onChange={v => {
              this.navChangeFun.call(this, v);
            }}
          >
            <NCTabPane
              key={"-1"}
              tab={
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                  "36180BP-000029"
                ) /* 国际化处理： 待提交*/ +
                  "(" +
                  ((numvalues && numvalues.NOT_COMMIT) || 0) +
                  ")"
              }
            />
            <NCTabPane
              key={"2"}
              tab={
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                  "36180BP-000030"
                ) /* 国际化处理： 审批中*/ +
                  "(" +
                  ((numvalues && numvalues.IN_APPROVE) || 0) +
                  ")"
              }
            />
            <NCTabPane
              key={"0"}
              tab={
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                  "36180BP-000031"
                ) /* 国际化处理： 全部*/
              }
            />
          </NCTabs>
        </div>
        <div className="nc-bill-table-area">
          {createSimpleTable(LIST_TABLE_CODE, {
            dataSource: DATASOURCE,
            pkname: "pk_accept",
            handlePageInfoChange: pageInfoClick.bind(this), //翻页事件
            showCheck: true,
            showIndex: true,
            onRowDoubleClick: this.doubleClick.bind(this), //行双击事件
            onSelected: buttonVisiable.bind(this), //行选中事件
            onSelectedAll: buttonVisiable.bind(this), //行全选事件
            componentInitFinished: () => {
              buttonVisiable.call(this, this.props);
            }
          })}
        </div>
        <div className="nc-faith-demo-div2">
          {/* 这里是附件上传组件的使用，需要传入三个参数 */}
          {showUploader && (
            <NCUploader
              billId={billId}
              target={target}
              placement={"bottom"}
              billNo={billno}
              onHide={this.onHideUploader}
            />
          )}
        </div>
        {/* 联查 审批详情 */}
        {showApproveDetail && (
          <ApproveDetail
            show={showApproveDetail}
            billtype={billtype}
            billid={billId}
            close={() => {
              this.setState({
                showApproveDetail: false
              });
            }}
          />
        )}
        {/** 联查预算 **/}
        {showNtbDetail && (
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
        <div>
          {/* 提交即指派 */}
          {this.state.compositedisplay ? (
            <ApprovalTrans
              title={
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get("36180BP-000015")
              } /* 国际化处理： 指派*/
              data={this.state.compositedata}
              display={this.state.compositedisplay}
              getResult={this.getAssginUsedr.bind(this)}
              cancel={this.compositeTurnOff}
            />
          ) : (
            ""
          )}
        </div>
        {/** 模板导出 */}
        <div>
          {createModal("importModal", {
            noFooter: true,
            className: "import-modal",
            hasBackDrop: false
          })}
          <ExcelImport
            {...Object.assign(this.props)}
            moduleName="fbm" //模块名
            billType={BILL_TYPE} //单据类型
            pagecode={CARD_PAGE_CODE}
            appcode={this.appcode}
            selectedPKS={selectedPKS}
          />
        </div>
        {/* 打印输出组件 */}
        <PrintOutput
          ref="printOutput"
          url={URL_LIST.PRINTOUTPUT}
          data={printOutputInfo}
        />
        {/* 银行账户余额 */}
        <NCCOriginalBalance
          // 补录框显示
          showmodal={this.state.showOriginal}
          showOriginalData={this.state.showOriginalData}
          // 点击确定按钮的回调函数
          onSureClick={retOriginalMsg => {
            //console.log(retOriginalMsg, 'retOriginalMsg')
            //关闭对话框
            this.setState({
              showOriginal: false
            });
          }}
          onCloseClick={() => {
            //关闭对话框
            this.setState({
              showOriginal: false
            });
          }}
        />
        {/* 内部账户余额弹框 */}
        {showInnerAcc && (
          <InnerAccoutDialog
            //是否显示
            // showModal={this.state.showInnerAcc}
            showModal={this.state.showInnerAcc}
            //查询pk
            accpk={this.state.showInnerAccData}
            closeModal={() => {
              //关闭对话框
              this.setState({
                showInnerAcc: false
              });
            }}
          />
        )}
      </div>
    );
  }
}

function doAjax(sendData, url, successCallback) {
  ajax({
    url: url,
    data: sendData,
    success: successCallback.bind(this)
  });
}

List = createPage({
  billinfo: {
    billtype: "grid",
    pagecode: LIST_PAGE_CODE
  },
  mutiLangCode: APP_CODE
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/