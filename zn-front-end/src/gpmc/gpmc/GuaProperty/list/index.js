/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//主子表列表
import React, { Component } from "react";
import {
  createPage,
  base,
  high,
  cardCache,
  createPageIcon
} from "nc-lightapp-front";
import {
  buttonClick,
  setStatusNumKey,
  initTemplate,
  searchBtnClick,
  pageInfoClick,
  onTabChange,
  bodyBtnOperation,
  buttonDisabled
} from "./events";
import { moduleId, list, card, javaUrl, billtype } from "../cons/constant.js";
import { NCTabs } from "../../commom";
let { NCAffix, NCDiv } = base;
let { NCUploader, ApproveDetail, ApprovalTrans } = high;
let { setDefData, getDefData } = cardCache;
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
    this.showUploader = false; //附件上传show
    this.billInfo = {}; //附件上传信息
    this.state = {
      selectDatas: [], //选择数据的map
      status: "-1", //状态页签
      showApproveDetail: false, //是否显示审批详情
      tabStatus: {
        DTJ: {
          num: 0,
          content: "36620GP-000032" /* 国际化处理： 待提交*/,
          status: "-1"
        },
        SPZ: {
          num: 0,
          content: "36620GP-000033" /* 国际化处理： 审批中*/,
          status: "2"
        },
        all: {
          num: "",
          content: "36620GP-000034" /* 国际化处理： 全部*/,
          status: ""
        }
      },
      compositedisplay: false, //是否显示指派弹窗
      compositedata: null, //指派信息
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
      moduleId: ["36620GP"],
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

  getAssginUsedr = val => {
    bodyBtnOperation.call(
      this,
      this.state.selectDatas,
      javaUrl.commit,
      this.state.json["36620GP-000035"],
      false,
      val
    ); /* 国际化处理： 提交成功*/
  };

  turnOff = () => {
    this.setState({
      compositedisplay: false, //是否显示指派弹窗
      compositedata: null //指派信息
    });
  };

  DoubleClick = (record, index, props, e) => {
    props.pushTo("/card", {
      status: "browse",
      id: record[this.primaryId].value,
      pagecode: this.card.pageCode
    });
  };

  render() {
    let { table, button, search, BillHeadInfo, socket } = this.props;
    let {
      tabStatus,
      status,
      showApproveDetail,
      compositedisplay,
      compositedata
    } = this.state;
    let { createSimpleTable } = table;
    let { NCCreateSearch } = search;
    let { createButtonApp } = button;
    const { createBillHeadInfo } = BillHeadInfo;
    return (
      <div className="nc-bill-list">
        {socket.connectMesg({
          tableAreaCode: this.tableId,
          billpkname: this.primaryId,
          billtype: billtype,
          dataSource: this.dataSource
        })}
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.state.json[
                  "36620GP-000003"
                ] /* 国际化处理： 担保物权*/,
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
            //     "36620GP-000036"
            // ] /* 国际化处理： 查询*/,
            oid: list.searchOid //查询模板的oid，用于查询查询方案
          })}
        </div>
        <NCTabs activeKey={status} onChange={onTabChange.bind(this)}>
          {this.tabStatus.map(item => {
            return (
              <NCTabPane
                tab={`${this.state.json[tabStatus[item].content]} ${
                  item !== "all" ? "(" + tabStatus[item].num + ")" : ""
                }`}
                key={tabStatus[item].status}
              />
            );
          })}
        </NCTabs>
        <div className="nc-bill-table-area">
          {createSimpleTable(this.tableId, {
            handlePageInfoChange: pageInfoClick.bind(this),
            onSelected: buttonDisabled.bind(this),
            onSelectedAll: buttonDisabled.bind(this),
            onRowDoubleClick: this.DoubleClick.bind(this),
            showCheck: true,
            showIndex: true,
            // showTotal: true
            dataSource: this.dataSource,
            pkname: this.primaryId,
            componentInitFinished: () => {
              //缓存数据赋值成功的钩子函数
              //若初始化数据后需要对数据做修改，可以在这里处理
            }
          })}
        </div>
        {compositedisplay ? (
          <ApprovalTrans
            title={this.state.json["36620GP-000004"]} /* 国际化处理： 指派*/
            data={compositedata}
            display={compositedisplay}
            getResult={this.getAssginUsedr}
            cancel={this.turnOff}
          />
        ) : null}
        {showApproveDetail && (
          <ApproveDetail
            show={showApproveDetail}
            billtype={billtype}
            billid={this.billInfo.billId}
            close={() => {
              this.setState({
                showApproveDetail: false
              });
            }}
          />
        )}
        {this.showUploader && (
          <NCUploader
            placement={"bottom"}
            {...this.billInfo}
            onHide={() => {
              this.showUploader = false;
              this.forceUpdate();
            }}
          />
        )}
      </div>
    );
  }
}

List = createPage({
  mutiLangCode: moduleId
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/