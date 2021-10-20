/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//主子表卡片
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
  baseReqUrl,
  billtype,
  btnLimit,
  card,
  javaUrl,
  list,
  moduleId,
  tabs
} from "../cons/constant.js";
import {
  afterEvent,
  beforeEvent,
  buttonClick,
  buttonDisabled,
  buttonVisible,
  clearAll,
  getCardData,
  initTemplate,
  initTemplate1,
  initTemplate2,
  pageClick,
  tabAfterEvent,
  tabButtonClick
} from "./events";
import "./index.less";
let { NCUploader, ApproveDetail, ApprovalTrans } = high;
let { NCDiv, NCAffix } = base;
let { updateCache, getNextId, deleteCacheById } = cardCache;

class Card extends Component {
  constructor(props) {
    super(props);
    this.formId = card.headCode; //主表区域
    this.moduleId = moduleId; //多语使用
    this.pageId =
      this.props.getUrlParam("scene") == "linksce"
        ? card.pageCode_link
        : this.props.getUrlParam("scene") == "approvesce"
        ? card.pageCode_appro
        : card.pageCode; //card页面code
    this.primaryId = card.primaryId; //主键ID
    this.list = list;
    this.card = card;
    // this.cache = card.cardCache;		//缓存key
    this.tabCache = card.tabCache; //缓存key
    this.dataSource = list.listCache; //调用列表界面缓存pks
    this.tabCode = tabs.tabCode; //tab区域code
    this.tabOrder = tabs.tabOrder; //tab区域code排序
    this.showUploader = false; //附件上传show
    this.billInfo = {}; //附件上传信息
    this.versionList = []; //保存历史版本号，供查看历史版本使用
    this.idTs = {}; //保存id, ts, 供保存后直接提交等使用
    this.debtor = ""; //比划担保人单位和债务人单位是否相同，以此达到取消是否需要反担保字段的选中
    this.guarantor = ""; //比划担保人单位和债务人单位是否相同，以此达到取消是否需要反担保字段的选中
    this.pk_currtype = ""; //控制组织本币汇率的编辑性
    this.state = {
      isPaste: false, //tabs处是否粘贴
      showApproveDetail: false, //是否显示审批详情
      compositedisplay: false, //是否显示指派弹窗
      compositedata: null, //指派信息
      json: {},
      inlt: null
    };
    ["linksce_card", "report", "linksce"].includes(
      this.props.getUrlParam("scene")
    )
      ? initTemplate1.call(this, props)
      : this.props.getUrlParam("scene") === "approvesce"
      ? initTemplate2.call(this, props)
      : initTemplate.call(this, props);
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
      if (status) {
        this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
      } else {
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: ["36620GC"],
      domainName: "gpmc",
      callback
    });
    let status = this.props.getUrlParam("status");
    if (!status || status === "add") {
      //新增的时候置空数据
      clearAll.call(this, this.props);
    }
    window.onbeforeunload = () => {
      if (!["browse", "version"].includes(this.props.getUrlParam("status"))) {
        return this.state.json[
          "36620GC-000000"
        ]; /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
      }
    };
  }

  componentDidMount() {
    let id = this.props.getUrlParam("id");
    let status = this.props.getUrlParam("status");
    this.props.button.setButtonDisabled(["deleteRow", "copyRow"], true);
    if (id) {
      if (status === "version") {
        //查看版本
        this.initVersionTree();
      }
    }
  }

  /**
   * 按钮操作
   * @param {*} path       	接口地址
   * @param {*} content    	toast弹框显示内容
   * @param {*} pk_contract   pk
   * @param {*} userObj       提交即指派使用
   */
  btnOperation = (path, content, pk_contracts, userObj = null) => {
    let { id: pk_contract, ts } = this.idTs;
    pk_contract =
      pk_contract ||
      this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    ts = ts || this.props.form.getFormItemsValue(this.formId, "ts").value;
    let pkMapTs = new Map();
    if (pk_contract && ts) {
      pkMapTs.set(pk_contract, ts);
    }
    let data = {
      pks: [pk_contract],
      pageCode: this.pageId,
      pkMapTs
    };
    if (userObj) {
      data.userObj = userObj;
    }
    ajax({
      url: `${baseReqUrl}${path}.do`,
      data,
      success: res => {
        if (res.success) {
          if (path === javaUrl.delete) {
            let {
              status, // 状态
              msgDetail,
              errormessages
            } = res.data;
            if (status == "0") {
              toast({
                color: "success",
                content: this.state.json[
                  "36620GC-000032"
                ] /* 国际化处理： 删除成功！*/
              });
              // 获取下一条数据的id
              let nextId = getNextId(pk_contract, this.dataSource);
              //删除缓存
              deleteCacheById(this.primaryId, pk_contract, this.dataSource);
              if (nextId) {
                // 设置下一条的ID
                this.props.setUrlParam({ id: nextId });
                getCardData.call(this, nextId);
              } else {
                // 删除的是最后一个的操作
                this.props.setUrlParam({ id: "" });
                clearAll.call(this, this.props, null, tabs.tabShow);
              }
            } else {
              toast({
                color: "danger",
                content:
                  (errormessages && errormessages[0]) ||
                  (msgDetail && msgDetail[0])
              });
            }
          } else if (path === javaUrl.commit) {
            if (
              res.data.workflow &&
              ["approveflow", "workflow"].includes(res.data.workflow)
            ) {
              this.setState({
                compositedisplay: true, //是否显示指派弹窗
                compositedata: res.data //指派信息
              });
            } else {
              toast({ color: "success", content });
              this.setState({
                compositedisplay: false, //是否显示指派弹窗
                compositedata: null //指派信息
              });
              ts = res.data.head[this.formId].rows[0].values.ts.value;
              this.idTs = { id: pk_contract, ts };
              updateCache(
                this.primaryId,
                pk_contract,
                res.data,
                this.formId,
                this.dataSource
              ); // 更新列表缓存
              // updateCache(this.primaryId, pk_contract, res.data, this.formId, this.cache);// 更新卡片缓存
              this.props.form.setAllFormValue({
                [this.formId]: res.data.head[this.formId]
              });
              this.props.cardTable.setAllTabsData(
                res.data.bodys,
                this.tabOrder,
                Object.keys(res.data.bodys)
              );
              buttonVisible.call(this, this.props);
            }
          } else if (path === javaUrl.terminal) {
            toast({
              color: "success",
              content
            });
            ts = res.data.head[this.formId].rows[0].values.ts.value;
            this.idTs = { id: pk_contract, ts };
            updateCache(
              this.primaryId,
              pk_contract,
              res.data,
              this.formId,
              this.dataSource
            );
            // updateCache(this.primaryId, pk_contract, res.data, this.formId, this.cache);
            this.props.form.setAllFormValue({
              [this.formId]: res.data.head[this.formId]
            });
            this.props.cardTable.setAllTabsData(
              res.data.bodys,
              this.tabOrder,
              Object.keys(res.data.bodys)
            );
            buttonVisible.call(this, this.props);
          } else {
            toast({ color: "success", content });
            if (path === javaUrl.delversion) {
              //删除版本成功后返回正常浏览态，并刷新当前单据
              this.props.setUrlParam({
                status: "browse",
                signal: ""
              });
              getCardData.call(this, this.props.getUrlParam("id"), true, true);
            } else {
              ts = res.data.head[this.formId].rows[0].values.ts.value;
              this.idTs = { id: pk_contract, ts };
              updateCache(
                this.primaryId,
                pk_contract,
                res.data,
                this.formId,
                this.dataSource
              );
              // updateCache(this.primaryId, pk_contract, res.data, this.formId, this.cache);
              this.props.form.setAllFormValue({
                [this.formId]: res.data.head[this.formId]
              });
              this.props.cardTable.setAllTabsData(
                res.data.bodys,
                this.tabOrder,
                Object.keys(res.data.bodys)
              );
              buttonVisible.call(this, this.props);
            }
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
            area: tabs.btnCode,
            buttonLimit: btnLimit,
            onButtonClick: tabButtonClick.bind(this),
            popContainer: document.querySelector(".header-button-area")
          })}
        </div>
      </div>
    );
  };

  //同步树鼠标滑过事件
  onTreeMouseEnter = key => {
    this.props.syncTree.hideIcon(this.treeId, key, {
      delIcon: false,
      editIcon: false,
      addIcon: false
    });
  };

  //同步树节点点击事件
  onTreeSelect = pk => {
    if (pk === "-1") {
      return;
    }
    ajax({
      url: `${baseReqUrl}${javaUrl.versioncard}.do`,
      data: {
        pk,
        pageCode: this.pageId
      },
      success: res => {
        let { success, data } = res;
        if (success) {
          if (data && data.head) {
            this.props.form.setAllFormValue({
              [this.formId]: data.head[this.formId]
            });
            this.props.cardTable.setAllTabsData(
              data.bodys,
              this.tabOrder,
              Object.keys(data.bodys)
            );
          }
        }
      }
    });
  };

  /**
   * 加载查看版本页面
   * @param {*} callback - 回调函数
   */
  initVersionTree = callback => {
    const treeRoot = {
      isleaf: false,
      pid: "__root__",
      refname: this.state.json["36620GC-000001"] /* 国际化处理： 版本号*/,
      refpk: "-1"
    };
    ajax({
      url: `${baseReqUrl}${javaUrl.versionlist}.do`,
      data: {
        queryAreaCode: "search",
        querytype: "tree",
        querycondition: {},
        pageCode: this.pageId,
        pageInfo: { pageIndex: 0, pageSize: 100 },
        def1: this.props.getUrlParam("id") //主键
      },
      success: res => {
        let { success, data } = res;
        let versionList = data && data.data && data.data.rows;
        this.versionList = versionList.map(item => item.refpk);
        if (success) {
          let treeData = this.props.syncTree.createTreeData(versionList);
          if (versionList.length) {
            this.onTreeSelect(versionList[0].refpk);
          }
          this.props.syncTree.setSyncTreeData(this.treeId, [
            Object.assign(treeRoot, { children: treeData })
          ]);
        }
      }
    });
  };

  getAssginUsedr = val => {
    this.btnOperation(
      javaUrl.commit,
      this.state.json["36620GC-000002"],
      null,
      val
    ); /* 国际化处理： 提交成功!*/
  };

  turnOff = () => {
    this.setState({
      compositedisplay: false, //是否显示指派弹窗
      compositedata: null //指派信息
    });
    let id = this.props.form.getFormItemsValue(this.formId, this.primaryId)
      .value;
    this.props.setUrlParam({
      id,
      status: "browse"
    });
    buttonVisible.call(this, this.props);
  };

  // 标题左侧返回按钮事件
  handlePageBack = () => {
    let signal = this.props.getUrlParam("signal");
    let scene = this.props.getUrlParam("scene");
    if (signal === "card") {
      this.props.setUrlParam({
        status: "browse",
        signal: ""
      });
      initTemplate.call(this, this.props);
    } else {
      this.props.pushTo("/list", {
        id: this.props.getUrlParam("gua"),
        scene: scene === "linksce_card" ? "linksce" : "",
        pagecode: this.card.pageCode
      });
    }
  };

  render() {
    let {
      cardTable,
      form,
      button,
      cardPagination,
      syncTree,
      BillHeadInfo,
      DragWidthCom,
      socket
    } = this.props;
    let { showApproveDetail, compositedisplay, compositedata } = this.state;
    let { createTabsTable } = cardTable;
    let status = this.props.getUrlParam("status");
    let { createForm } = form;
    let { createCardPagination } = cardPagination;
    let { createButtonApp } = button;
    let { createSyncTree } = syncTree;
    let { createBillHeadInfo } = BillHeadInfo;

    // 卡片子表dom
    let cardFormTableDom = (
      <div className="nc-bill-bottom-area">
        <div className="nc-bill-table-area">
          {createTabsTable(this.tabCode, {
            cancelCustomRightMenu: true,
            tableHead: this.getTableHead.bind(this),
            showCheck: ["add", "edit", "change", "copy"].includes(status),
            showIndex: true,
            onSelected: buttonDisabled.bind(this),
            onSelectedAll: buttonDisabled.bind(this),
            onAfterEvent: tabAfterEvent.bind(this),
            onTabChange: key => {
              console.log(key);
            },
            adaptionHeight: true,
            modelSave: buttonClick.bind(this, this.props, "Save"),
            modelAddRow: (props, moduleId, index) => {
              //增行按钮操作
            },
            modelDelRow: (props, moduleId) => {
              //删行按钮操作
            }
          })}
        </div>
      </div>
    );
    // 卡片 主表dom
    let cardFormDom = (
      <div className="nc-bill-top-area">
        <div className="nc-bill-form-area">
          {createForm(this.formId, {
            onAfterEvent: afterEvent.bind(this),
            onBeforeEvent: beforeEvent.bind(this)
          })}
        </div>
      </div>
    );
    // 左树 dom
    let treeDom = (
      <div className="left-area" style={{ marginLeft: "20px" }}>
        {createSyncTree({
          treeId: this.treeId, // 组件id
          needSearch: false, //是否需要查询框，默认为true,显示。false: 不显示
          onSelectEve: this.onTreeSelect.bind(this), //选择节点回调方法
          onMouseEnterEve: this.onTreeMouseEnter.bind(this), //鼠标滑过节点事件
          defaultExpandAll: true, //默认展开所有节点
          disabledSearch: true //是否显示搜索框
        })}
      </div>
    );
    // 右卡 dom
    let rightDom = (
      <div className="nc-bill-card">
        {cardFormDom}
        {cardFormTableDom}
      </div>
    );
    return (
      <div className="nc-bill-card">
        {socket.connectMesg({
          headBtnAreaCode: card.btnCode, // 表头按钮区域ID
          formAreaCode: this.formId, // 表头Form区域ID
          billtype: billtype,
          billpkname: this.primaryId,
          dataSource: this.dataSource
        })}
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.state.json[
                  "36620GC-000003"
                ] /* 国际化处理： 担保合同*/,
                billCode: "",
                backBtnClick: this.handlePageBack
              })}
            </div>
            <div className="header-button-area">
              {/* 适配 微服务 按钮 开始 */}
              {this.props.button.createErrorFlag({
                headBtnAreaCode: card.btnCode
              })}
              {/* 适配 微服务 按钮 结束*/}
              {createButtonApp({
                area: card.btnCode,
                onButtonClick: buttonClick.bind(this)
              })}
            </div>
            <div
              className="header-cardPagination-area"
              style={{ float: "right" }}
            >
              {createCardPagination({
                dataSource: this.dataSource,
                handlePageInfoChange: pageClick.bind(this)
              })}
            </div>
          </NCDiv>
        </NCAffix>
        {/* 为多版本联查时加载 树卡区域 */}
        {status === "version" && (
          <div className="tree-card">
            <DragWidthCom
              leftDom={treeDom} //左侧区域dom
              rightDom={rightDom} //右侧区域dom
              defLeftWid="20%" // 默认左侧区域宽度，px/百分百
            />
          </div>
        )}
        {/* 为正常状态时 加载主子表 */}
        {status !== "version" && cardFormDom}
        {status !== "version" && cardFormTableDom}

        {compositedisplay && (
          <ApprovalTrans
            title={this.state.json["36620GC-000004"]} /* 国际化处理： 指派*/
            data={compositedata}
            display={compositedisplay}
            getResult={this.getAssginUsedr}
            cancel={this.turnOff}
          />
        )}
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

Card = createPage({
  mutiLangCode: moduleId,
  orderOfHotKey: ["header", "warrantyinfo"],
  billinfo: {
    billtype: "extcard",
    pagecode: card.pageCode,
    headcode: card.headCode,
    bodycode: tabs.tabOrder,
    tabs: true
  }
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/