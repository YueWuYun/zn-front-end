/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//主子表卡片
import React, { Component } from "react";
import {
  createPage,
  ajax,
  base,
  toast,
  cardCache,
  high,
} from "nc-lightapp-front";
import {
  buttonClick,
  clearAll,
  initTemplate,
  initTemplate1,
  initTemplate2,
  buttonVisible,
  pageClick,
  getCardData,
  getCopyCardData,
  afterEvent,
  beforeEvent,
} from "./events";
import { moduleId, card, list, baseReqUrl, javaUrl } from "../cons/constant.js";
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
        ? card.pageCode
        : this.props.getUrlParam("scene") == "approvesce"
        ? card.pageCode_appro
        : card.pageCode; //card页面code
    this.primaryId = card.primaryId; //主键ID
    this.list = list;
    this.card = card;
    this.cache = card.cardCache; //缓存key
    this.dataSource = list.listCache; //调用列表界面缓存pks
    this.treeId = "versionTree"; //版本树id
    this.idTs = {}; //保存id, ts, 供保存后直接提交等使用
    (this.pk_currtype = ""), //控制组织本币汇率的编辑性
      (this.state = {
        showUploader: false, //附件上传show
        billInfo: {}, //附件上传信息
        showAppr: false,
        billid: "",
        compositedisplay: false, //是否显示指派弹窗
        compositedata: null, //指派信息
        json: {},
        inlt: null,
      });
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
      moduleId: ["36620GBM"],
      domainName: "gpmc",
      callback,
    });
    let status = this.props.getUrlParam("status");
    if (!status || status === "add") {
      //新增的时候置空数据
      clearAll.call(this, this.props);
    }
    window.onbeforeunload = () => {
      if (
        !["browse", "changeRecord"].includes(this.props.getUrlParam("status"))
      ) {
        return this.state.json[
          "36620GBM-000000"
        ]; /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
      }
    };
  }

  componentDidMount() {
    let id = this.props.getUrlParam("id");
    let status = this.props.getUrlParam("status");

    if (id) {
      if (status === "changeRecord") {
        //查看版本
        this.initVersionTree();
      }
      if (status === "copy") {
        getCopyCardData.call(this, id, false, false);
      } else {
        getCardData.call(this, id, true);
      }
    }
  }

  /**
   * 按钮操作
   * @param {*} path       接口地址
   * @param {*} content    toast弹框显示内容
   */
  btnOperation = (path, content, pk_guacontractquotes, userObj = null) => {
    let { id: pk_guacontractquote, ts } = this.idTs;
    pk_guacontractquote =
      pk_guacontractquote ||
      this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    ts = ts || this.props.form.getFormItemsValue(this.formId, "ts").value;
    let pkMapTs = new Map();
    if (pk_guacontractquote && ts) {
      pkMapTs.set(pk_guacontractquote, ts);
    }
    let data = {
      pks: [pk_guacontractquote],
      pageCode: this.pageId,
      pkMapTs,
    };
    if (userObj) {
      data.userObj = userObj;
    }
    ajax({
      url: `${baseReqUrl}${path}.do`,
      data,
      success: (res) => {
        if (res.success) {
          if (path === javaUrl.delete) {
            toast({ color: "success", content });
            // 获取下一条数据的id
            let nextId = getNextId(pk_guacontractquote, this.dataSource);
            //删除缓存
            deleteCacheById(
              this.primaryId,
              pk_guacontractquote,
              this.dataSource
            );
            if (nextId) {
              getCardData.call(this, nextId);
            } else {
              // 删除的是最后一个的操作
              this.props.setUrlParam({ id: "" });
              clearAll.call(this, this.props);
            }
          } else if (path === javaUrl.commit) {
            if (
              res.data.workflow &&
              ["approveflow", "workflow"].includes(res.data.workflow)
            ) {
              this.setState({
                compositedisplay: true, //是否显示指派弹窗
                compositedata: res.data, //指派信息
              });
            } else {
              toast({ color: "success", content });
              this.setState({
                compositedisplay: false, //是否显示指派弹窗
                compositedata: null, //指派信息
              });
              ts = res.data.head[this.formId].rows[0].values.ts.value;
              this.idTs = { id: pk_guacontractquote, ts };
              this.props.form.setAllFormValue({
                [this.formId]: res.data.head[this.formId],
              });
              updateCache(
                this.primaryId,
                pk_guacontractquote,
                res.data,
                this.formId,
                this.cache
              );
              updateCache(
                this.primaryId,
                pk_guacontractquote,
                res.data,
                this.formId,
                this.dataSource
              );
              buttonVisible.call(this, this.props);
            }
          } else {
            toast({ color: "success", content });
            if (path === javaUrl.delversion) {
              getCardData.call(this, pk_guacontractquote, false, true);
            } else {
              ts = res.data.head[this.formId].rows[0].values.ts.value;
              this.idTs = { id: pk_guacontractquote, ts };
              updateCache(
                this.primaryId,
                pk_guacontractquote,
                res.data,
                this.formId,
                this.cache
              );
              updateCache(
                this.primaryId,
                pk_guacontractquote,
                res.data,
                this.formId,
                this.dataSource
              );
              this.props.form.setAllFormValue({
                [this.formId]: res.data.head[this.formId],
              });
              buttonVisible.call(this, this.props);
            }
          }
        }
      },
    });
  };

  //同步树鼠标滑过事件
  onTreeMouseEnter = (key) => {
    this.props.syncTree.hideIcon(this.treeId, key, {
      delIcon: false,
      editIcon: false,
      addIcon: false,
    });
  };

  /**
   * 加载查看版本页面
   *
   * @param {*} callback - 回调函数
   */
  initVersionTree = (callback) => {
    const treeRoot = {
      isleaf: false,
      pid: "__root__",
      refname: this.state.json["36620GBM-000001"] /* 国际化处理： 版本号*/,
      refpk: "-1",
    };
    ajax({
      url: `${baseReqUrl}${javaUrl.versionlist}.do`,
      data: {
        queryAreaCode: "search",
        querytype: "tree",
        querycondition: {},
        pageCode: this.pageId,
        pageInfo: { pageIndex: 0, pageSize: "100" },
        def1: this.props.getUrlParam("id"), //主键
      },
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let treeData = this.props.syncTree.createTreeData(data.data.rows);
          this.setState(
            {
              isVersion: true,
            },
            () => {
              this.props.syncTree.setSyncTreeData(this.treeId, [
                Object.assign(treeRoot, { children: treeData }),
              ]);
            }
          );
        }
      },
    });
  };

  //同步树节点点击事件
  onTreeSelect = (key, data) => {
    console.log("-----tree-----", key, data);
    ajax({
      url: `${baseReqUrl}${javaUrl.versiondetail}.do`,
      data: {
        pk: key,
        pageCode: this.pageId,
      },
      success: (res) => {
        let { success, data } = res;
        if (success) {
          if (data && data.head) {
            this.props.form.setAllFormValue({
              [this.formId]: data.head[this.formId],
            });
          }
          if (data && data.bodys) {
            this.tabOrder &&
              this.props.cardTable.setAllTabsData(data.bodys, this.tabOrder);
          }
        }
      },
    });
  };

  getAssginUsedr = (value) => {
    this.btnOperation(
      javaUrl.commit,
      this.state.json["36620GBM-000002"],
      null,
      value
    ); /* 国际化处理： 提交成功!*/
  };

  turnOff = () => {
    this.setState({
      compositedisplay: false, //是否显示指派弹窗
      compositedata: null, //指派信息
    });
    let id = this.props.form.getFormItemsValue(this.formId, this.primaryId)
      .value;
    this.props.setUrlParam({
      id,
      status: "browse",
    });
    buttonVisible.call(this, this.props);
  };
  handlePageBack = () => {
    this.props.pushTo("/list", {
      id: this.props.getUrlParam("gua"),
      scene:
        this.props.getUrlParam("scene") === "linksce_card" ? "linksce" : "",
      pagecode: this.card.pageCode,
    });
  };

  render() {
    let { form, button, cardPagination, syncTree, DragWidthCom } = this.props;
    const { createBillHeadInfo } = this.props.BillHeadInfo;
    let status = this.props.getUrlParam("status");
    let { createForm } = form;
    let { createButtonApp } = button;
    let {
      showUploader,
      billInfo,
      billId,
      compositedisplay,
      compositedata,
      showAppr,
    } = this.state;
    let { createSyncTree } = syncTree;
    let { createCardPagination } = cardPagination;
    let treeDom = (
      <div className="left-area" style={{ marginLeft: "20px" }}>
        {createSyncTree({
          treeId: this.treeId, // 组件id
          needSearch: false, //是否需要查询框，默认为true,显示。false: 不显示
          onSelectEve: this.onTreeSelect.bind(this), //选择节点回调方法
          //  showLine :false,  //是否显示连线，默认不显示
          onMouseEnterEve: this.onTreeMouseEnter.bind(this), //鼠标滑过节点事件
          defaultExpandAll: true, //默认展开所有节点
          disabledSearch: true, //是否显示搜索框
        })}
      </div>
    );
    /* 右卡片区域 */
    let cardFormDom = (
      <div className="nc-bill-form-area">
        {createForm(this.formId, {
          onAfterEvent: afterEvent.bind(this),
          onBeforeEvent: beforeEvent.bind(this),
        })}
      </div>
    );

    return (
      <div className="nc-bill-card">
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: this.state.json["36620GBM-000003"], //标题/* 国际化处理： 担保债务*/
                billCode: "", //单据号
                backBtnClick: this.handlePageBack,
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: card.btnCode,
                onButtonClick: buttonClick.bind(this),
              })}
            </div>
            <div
              className="header-cardPagination-area"
              style={{ float: "right" }}
            >
              {createCardPagination({
                dataSource: this.dataSource,
                handlePageInfoChange: pageClick.bind(this),
              })}
            </div>
          </NCDiv>
        </NCAffix>
        {/* 树卡区域 */}
        {status === "changeRecord" ? (
          <div className="tree-card">
            <DragWidthCom
              leftDom={treeDom} //左侧区域dom
              rightDom={cardFormDom} //右侧区域dom
              defLeftWid="20%" // 默认左侧区域宽度，px/百分百
            />
          </div>
        ) : (
          cardFormDom
        )}
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
        {/** 联查审批详情 **/}
        <ApproveDetail
          show={showAppr}
          billid={billId}
          billtype={"36W3"}
          close={() => {
            this.setState({
              showAppr: false,
            });
          }}
        />
        {compositedisplay && (
          <ApprovalTrans
            title={this.state.json["36620GBM-000004"]} /* 国际化处理： 指派*/
            data={compositedata}
            display={compositedisplay}
            getResult={this.getAssginUsedr}
            cancel={this.turnOff}
          />
        )}
      </div>
    );
  }
}

Card = createPage({
  mutiLangCode: moduleId,
  billinfo: {
    billtype: "form",
    pagecode: card.pageCode,
    headcode: card.headCode,
  },
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/