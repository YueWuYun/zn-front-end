/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//主子表列表
import { base, cardCache, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import { NCTabs } from "../../commom";
import {
  baseReqUrl,
  javaUrl,
  list,
  card,
  moduleId,
  printData
} from "../cons/constant.js";
import {
  buttonClick,
  buttonDisabled,
  initTemplate,
  onTabChange,
  pageInfoClick,
  searchBtnClick,
  setStatusNumKey
} from "./events";
import { BusinessInnerOperator } from "./events/BusinessOperator";
let { NCAffix, NCDiv } = base;
let { setDefData, getDefData } = cardCache;
let { NCUploader, PrintOutput, ApproveDetail, ApprovalTrans } = high;
let NCTabPane = NCTabs.NCTabPane;

class List extends Component {
  constructor(props) {
    super(props);
    this.tableId = list.tableCode; //table区域
    this.searchId = list.searchCode; //查询区域
    this.pageId = list.pageCode; //list页面code
    this.primaryId = list.primaryId; //主键ID
    this.list = list;
    this.card = card;
    this.dataSource = list.listCache; //缓存key
    this.moduleId = moduleId; //多语使用
    this.tabStatus = list.tabStatus; //状态页签的key
    this.tabContainer = list.tabContainer; //保存后台返回tab的key
    this.searchKey = list.searchKey; //查询条件缓存key
    this.statusKey = list.statusKey; //tab状态区域缓存的key
    this.statusNumKey = list.statusNumKey; //tab状态区域数量缓存的key
    this.billNo = list.billno; //单据编
    this.state = {
      showUploader: false, //附件上传show
      billInfo: {}, //附件上传信息
      pks: [], //后台返回的所有pks
      status: "0",
      printOut: {
        //打印输出使用
        ...printData,
        outputType: "output"
      },
      tabStatus: {
        DTJ: {
          num: 0,
          content: "36620GBM-000024" /* 国际化处理： 待提交*/,
          status: "0"
        },
        DSP: {
          num: 0,
          content: "36620GBM-000025" /* 国际化处理： 审批中*/,
          status: "1"
        },
        all: {
          num: "",
          content: "36620GBM-000026" /* 国际化处理： 全部*/,
          status: ""
        }
      },
      compositedisplay: false, //是否显示指派弹窗
      compositedata: null, //指派信息
      record: null,
      index: null, //指派使用
      json: {},
      inlt: null
    };
    // initTemplate.call(this, props);
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
      if (status) {
        initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
        this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
      } else {
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: ["36620GBM"],
      domainName: "gpmc",
      callback
    });
    window.onbeforeunload = null;
  }

  componentDidMount() {
    buttonDisabled.call(this);
    // 获取缓存的tab的key
    let status = getDefData(this.statusKey, this.dataSource);
    if (status) {
      this.setState({ status: status === "all" ? "" : status });
    }
    setStatusNumKey.call(
      this,
      getDefData(this.dataSource, this.statusNumKey) || {}
    );
  }

  onRowDoubleClick = (record, index, props, e) => {
    let scene = this.props.getUrlParam("scene");
    props.pushTo("/card", {
      status: "browse",
      scene,
      id: record.pk_guacontractquote && record.pk_guacontractquote.value,
      pagecode: this.card.pageCode
    });
  };

  //关闭审批详情
  closeApprove = () => {
    this.setState({
      showAppr: false
    });
  };

  getAssginUsedr = value => {
    BusinessInnerOperator.call(
      this,
      "commit",
      this.props,
      this.state.record,
      this.state.index,
      this.tableId,
      this.pageId,
      javaUrl.commit,
      this.state.json["36620GBM-000027"],
      value
    ); /* 国际化处理： 提交成功*/
  };

  turnOff = () => {
    this.setState({
      compositedisplay: false, //是否显示指派弹窗
      compositedata: null //指派信息
    });
  };

  render() {
    let { table, button, search, BillHeadInfo } = this.props;
    let { createSimpleTable } = table;
    let { NCCreateSearch } = search;
    let { createButtonApp } = button;
    let {
      showUploader,
      billInfo,
      printOut,
      billId,
      tabStatus,
      status,
      compositedisplay,
      compositedata
    } = this.state;
    const { createBillHeadInfo } = BillHeadInfo;
    return (
      <div className="nc-bill-list">
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.state.json[
                  "36620GBM-000003"
                ] /* 国际化处理： 担保债务*/,
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
        <div className="nc-bill-search-area">
          {NCCreateSearch(this.searchId, {
            clickSearchBtn: searchBtnClick.bind(this),
            // showAdvBtn: false,                           //  显示高级按钮
            // onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
            // searchBtnName: this.state.json[
            //     "36620GBM-000028"
            // ] /* 国际化处理： 查询*/,
            oid: list.searchOid //查询模板的oid，用于查询查询方案
          })}
        </div>
        <NCTabs activeKey={status} onChange={onTabChange.bind(this)}>
          {this.tabStatus.map(item => {
            return (
              <NCTabPane
                tab={
                  this.state.json[tabStatus[item].content] !=
                  this.state.json["36620GBM-000026"]
                    ? `${this.state.json[tabStatus[item].content]}
                                      (${tabStatus[item].num})
                                    `
                    : this.state.json[tabStatus[item].content]
                }
                key={tabStatus[item].status}
              /> /* 国际化处理： 全部*/
            );
          })}
        </NCTabs>
        <div className="nc-bill-table-area">
          {createSimpleTable(this.tableId, {
            handlePageInfoChange: pageInfoClick.bind(this),
            onSelected: buttonDisabled.bind(this),
            onSelectedAll: buttonDisabled.bind(this),
            showCheck: true,
            showIndex: true,
            // showTotal: true
            dataSource: this.dataSource,
            pkname: this.primaryId,
            onRowDoubleClick: this.onRowDoubleClick.bind(this),
            componentInitFinished: () => {
              //缓存数据赋值成功的钩子函数
              //若初始化数据后需要对数据做修改，可以在这里处理
            }
          })}
        </div>
        <PrintOutput
          ref="printOutput"
          url={`${baseReqUrl}${javaUrl.print}.do`}
          data={printOut}
        />
        {showUploader && (
          <NCUploader
            placement={"bottom"}
            {...billInfo}
            onHide={() => {
              this.setState({
                showUploader: false
              });
            }}
          />
        )}
        {/** 联查审批详情 **/}
        <div>
          <ApproveDetail
            show={this.state.showAppr}
            close={this.closeApprove}
            billid={billId}
            billtype={"36W3"}
          />
        </div>
        {compositedisplay ? (
          <ApprovalTrans
            title={this.state.json["36620GBM-000004"]} /* 国际化处理： 指派*/
            data={compositedata}
            display={compositedisplay}
            getResult={this.getAssginUsedr}
            cancel={this.turnOff}
          />
        ) : null}
      </div>
    );
  }
}

List = createPage({
  mutiLangCode: moduleId
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/