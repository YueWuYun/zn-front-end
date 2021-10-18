/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置卡片页
 created by：liyaoh 2018-08-13
*/

import {
  ajax,
  base,
  cardCache,
  createPage,
  high,
  toast
} from "nc-lightapp-front";
import React, { Component } from "react";
import {
  API_URL,
  app_code,
  CARD,
  DATA_SOURCE,
  nodekey
} from "../cons/constant.js";
import {
  afterEvent,
  afterTableEvent,
  bodyButtonClick,
  bodySelectedAllEvent,
  bodySelectedEvent,
  buttonClick,
  buttonVisible,
  initTemplate
} from "./events";
import {
  billHeadVisible,
  clearAll,
  getCardData,
  pageClick,
  setEditStatus
} from "./events/page";
let { updateCache, getNextId, deleteCacheById } = cardCache;
let { NCDiv, NCAffix } = base;
const { PrintOutput } = high;

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.appcode = app_code;
    this.formId = CARD.form_id;
    this.primaryId = CARD.primary_id; //主键ID
    this.treeId = "tree";
    this.pageId = CARD.page_id;
    this.dataSource = DATA_SOURCE; //缓存key
    this.nodekey = nodekey;
    this.tabCode = CARD.tab_code; //tab区域code编码
    this.tabOrder = CARD.tab_order; //tab排序
    this.interestId = CARD.interest_id;
    this.moduleId = props.moduleId;
    if (this.props.pageType === "group") {
      //集团
      this.appcode = "36010IRCG";
      this.pageId = "36010IRCG_card";
      this.nodekey = "36010IRCG_card";
      this.dataSource = "tm.pub.interestrateGroup.datasource";
      this.moduleId = "36010IRCG";
    } else if (props.pageType === "global") {
      //全局
      this.appcode = "36010IRC";
      this.pageId = "36010IRC_card";
      this.nodekey = "36010IRC_card";
      this.dataSource = "tm.pub.interestrateGlobal.datasource";
      this.moduleId = "36010IRC";
    } else if (props.pageType === "org") {
    }
    this.state = {
      //输出用
      outputData: {
        funcode: "", //功能节点编码，即模板编码
        nodekey: "", //模板节点标识
        oids: [],
        outputType: "output"
      },
      isVersion: false, //显示版本信息
      cardVersion: false, //卡片页点击查看版本标识
      context: {} // 全局上下文
    };
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      if (status) {
        initTemplate.call(this, this.props);
        this.setState({ json, inlt });
        this.afterGetLang(json);
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

  afterGetLang() {
    window.onbeforeunload = () => {
      if (!["browse"].includes(this.props.getUrlParam("status"))) {
        return this.state.json["36010IR-000050"];
      }
    };
  }

  componentWillUnmount() {
    window.onbeforeunload = () => {
      // 停止事件
    };
  }

  componentDidMount() {}

  //返回按钮事件配置
  handleBackClick() {
    if (this.state.isVersion && this.state.cardVersion) {
      //卡片查看版本点返回到查看版本之前的状态
      this.props.setUrlParam({ pageType: undefined });
      let id = this.props.getUrlParam("id");
      this.setState(
        {
          isVersion: false,
          cardVersion: false
        },
        () => {
          getCardData.call(this, id);
        }
      );
    } else {
      this.props.pushTo("/list", {
        pagecode: CARD.page_id
      });
    }
  }

  btnOperation = (path, content) => {
    let pkMapTs = new Map();
    let pk = this.props.form.getFormItemsValue(this.formId, this.primaryId)
      .value;
    let ts = this.props.form.getFormItemsValue(this.formId, "ts").value;
    //主键与tsMap
    if (pk && ts) {
      pkMapTs.set(pk, ts);
    }
    ajax({
      url: API_URL[path],
      data: {
        pks: [pk],
        pkMapTs,
        pageCode: this.pageId
      },
      success: res => {
        if (res.success) {
          toast({ color: "success", content });
          if (path === "delete") {
            // 获取下一条数据的id
            let nextId = getNextId(pk, this.dataSource);
            //删除缓存
            deleteCacheById(this.primaryId, pk, this.dataSource);
            if (nextId) {
              this.props.setUrlParam({ id: nextId });
              getCardData.call(this, nextId);
            } else {
              // 删除的是最后一个的操作
              this.props.setUrlParam({ id: "" });
              setEditStatus.call(this, "browse");
              clearAll.call(this, this.props);
              billHeadVisible.call(this, true, false);
            }
          } else if (res.data) {
            updateCache(
              this.primaryId,
              pk,
              res.data,
              this.formId,
              this.dataSource
            );
            buttonVisible.call(this, this.props);
          }
        }
      }
    });
  };
  //获取列表肩部信息
  getTableHead = () => {
    return (
      <div className="shoulder-definition-area">
        <div className="definition-icons">
          {this.props.button.createButtonApp({
            area: CARD.shoulder_btn_code,
            // buttonLimit: btnLimit,
            onButtonClick: bodyButtonClick.bind(this),
            popContainer: document.querySelector(".header-button-area")
          })}
        </div>
      </div>
    );
  };

  tabsChange = key => {
    let interestObj = {
      rationrate: "rationflag",
      advancerate: "headflag",
      overduerate: "overdueflag"
    };
    let curIntersetFlag = this.props.form.getFormItemsValue(
      this.formId,
      interestObj[key]
    ).value;
    this.props.button.setButtonDisabled(["addRow"], !curIntersetFlag);
  };
  //同步树鼠标滑过事件
  onTreeMouseEnter = key => {
    this.props.syncTree.hideIcon(this.treeId, key, {
      delIcon: false,
      editIcon: false,
      addIcon: false
    });
  };
  onTreeNodeClick = key => {
    if (key == "-1") return;
    ajax({
      url: API_URL.versioncard,
      data: {
        pk: key,
        pageCode: this.pageId
      },
      success: res => {
        let { success, data } = res;
        if (success) {
          if (data && data.head) {
            this.props.form.setAllFormValue({
              [this.formId]: data.head[this.formId]
            });
          }
          if (data && data.bodys) {
            this.tabOrder &&
              this.props.cardTable.setAllTabsData(data.bodys, this.tabOrder);
          }
        }
      }
    });
  };
  render() {
    let {
      cardTable,
      form,
      button,
      cardPagination,
      BillHeadInfo,
      DragWidthCom,
      syncTree
    } = this.props;
    let { createTabsTable } = cardTable;
    let { createSyncTree } = syncTree;
    let { createBillHeadInfo } = BillHeadInfo;
    let { createForm } = form;
    let { createCardPagination } = cardPagination;
    let { createButtonApp } = button;
    let status = this.props.getUrlParam("status") === "browse";
    let scene = this.props.getUrlParam("scene") === "linksce";
    let showPagination = status && !scene;
    const langData = this.props.MultiInit.getLangData(this.moduleId);
    let { isVersion, cardVersion } = this.state;
    let treeDom = (
      <div className="left-area" style={{ marginLeft: "20px" }}>
        {createSyncTree({
          treeId: this.treeId, // 组件id
          needSearch: false, //是否需要查询框，默认为true,显示。false: 不显示
          onSelectEve: this.onTreeNodeClick.bind(this), //选择节点回调方法
          onMouseEnterEve: this.onTreeMouseEnter.bind(this), //鼠标滑过节点事件
          defaultExpandAll: true, //默认展开所有节点
          disabledSearch: true //是否显示搜索框
        })}
      </div>
    );
    /* 卡片子表区域 */
    let cardFormTableDom = (
      <div className="nc-bill-bottom-area">
        <div className="nc-bill-table-area">
          {createTabsTable(this.tabCode, {
            cancelCustomRightMenu: true,
            showCheck: !status,
            showIndex: true,
            adaptionHeight: true,
            onAfterEvent: afterTableEvent.bind(this),
            tableHead: this.getTableHead.bind(this),
            onTabChange: this.tabsChange.bind(this),
            onSelected: bodySelectedEvent.bind(this), // 左侧选择列单个选择框回调
            onSelectedAll: bodySelectedAllEvent.bind(this) // 左侧选择列全选回调
          })}
        </div>
      </div>
    );
    /* 卡片主表区域 */
    let cardFormDom = (
      <div className="nc-bill-top-area">
        <div className="nc-bill-form-area">
          {createForm(this.formId, {
            onAfterEvent: afterEvent.bind(this),
            expandArr: [this.interestId]
          })}
        </div>
      </div>
    );
    /* 右卡 dom */
    let rightDom = (
      <div className="nc-bill-card">
        {cardFormDom}
        {cardFormTableDom}
      </div>
    );
    return (
      <div className="nc-bill-card">
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.state.json && this.state.json[this.props.pageTitle], //标题
                backBtnClick: () => {
                  //返回按钮的点击事件
                  this.handleBackClick();
                }
              })}
            </div>
            {!isVersion && (
              <div className="header-button-area">
                {createButtonApp({
                  area: CARD.head_btn_code,
                  onButtonClick: buttonClick.bind(this)
                })}
              </div>
            )}
            {showPagination && !isVersion && (
              <div
                className="header-cardPagination-area"
                style={{ float: "right" }}
              >
                {createCardPagination({
                  dataSource: this.dataSource,
                  handlePageInfoChange: pageClick.bind(this)
                })}
              </div>
            )}
          </NCDiv>
        </NCAffix>

        {/* 当多版本联查时加载树卡页面 */}
        {cardVersion && (
          <div className="tree-card">
            <DragWidthCom
              leftDom={treeDom} //左侧区域dom
              rightDom={rightDom} //右侧区域dom
              defLeftWid="20%" // 默认左侧区域宽度，px/百分百
            />
          </div>
        )}

        {/* 当正常单据状态时加载主子表 */}
        {!cardVersion && cardFormDom}
        {!cardVersion && cardFormTableDom}

        {/* 打印组件 */}
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

Card = createPage({
  billinfo: {
    billtype: "extcard"
  },
  orderOfHotKey: ["head", "rationrate"]
})(Card);

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/