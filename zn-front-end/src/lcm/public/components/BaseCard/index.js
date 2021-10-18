/*
 卡片页组件
*/
import {
  base,
  cardCache,
  high,
  promptBox,
  toast,
  pageTo,
} from "nc-lightapp-front";
import React, { Component } from "react";
import NCCOriginalBalance from "src/cmp/public/restmoney/list/index";
import NCCCCBalance from "src/ccc/public/Balance/list/index";
import Modal from "../Modal";
import { cardUtils, common } from "./../../container";
import {
  baseCardInitTemplate,
  buttonClick,
  compositeTurnOff,
  getAssginUsedr,
  initVersionTree,
  onTreeMouseEnter,
  onTreeNodeClick,
  pageClick,
  setPageStatus,
  templateInited,
  pullBillTemplateInited,
  getCardAfterEventData,
  clearAllData,
  getBeforeEventCurrtype,
  baseCardItemsRule,
  disableItemsSet,
  requiredItemsSet,
  tabModalToNextData,
  onTransferItemSelected,
} from "./events";
import "./index.less";
let { NCDiv, NCAffix } = base;
let {
  PrintOutput,
  NCUploader,
  ApproveDetail,
  ApprovalTrans,
  Inspection,
} = high;
let { setDefData } = cardCache;
let btnsMap = null;

class BaseCard extends Component {
  constructor(props) {
    super(props);
    this.saveBefore = props._saveBefore && props._saveBefore.bind(this); // 主表保存前事件处理函数
    this.saveAfter = props._saveAfter && props._saveAfter.bind(this); // 主表保存后事件处理函数
    this.cardItemsRule =
      props._cardItemsRule && props._cardItemsRule.bind(this); // 主表字段规则处理函数
    this.handelVerificate =
      props._handelVerificate && props._handelVerificate.bind(this); // 自定义主子表数据校验
    this.tableItemsRule =
      props._tableItemsRule && props._tableItemsRule.bind(this); // 子表字段规则处理函数
    this.handleCopy = props._handleCopy && props._handleCopy.bind(this); // 复制时主子表事件处理函数
    this.handleChange = props._handleChange && props._handleChange.bind(this); // 变更时主子表事件处理函数
    this.handleExtension =
      props._handleExtension && props._handleExtension.bind(this); // 展期时主子表事件处理函数
    this.state = {
      baseMultiLangData: {}, // 多语文件 Object
      inlt: null, // 可用来进行占位符的一些操作 Object
      billNo: "", // 单据编号 String
      isPaste: false, // 是否粘贴标识 Boolean
      //输出参数
      outputData: {
        funcode: "", // 功能节点编码，即模板编码 String
        oids: [], // 单据pk集合
        nodekey: "", // 模板节点标识 String
        outputType: "output", // 输出类型 String
      },
      billInfo: {}, // 附件上传信息 Object
      showUploader: false, // 是否显示附件上传组件 Boolean
      showApproveDetail: false, // 是否显示审批详情 Boolean
      isVersion: false, // 显示版本信息标识 Boolean
      showCCC: false, // 显示联查授信额度 Boolean
      showCCCBalance: null, // 授信pk Array
      compositedata: null, // 指派信息 Object
      compositedisplay: false, // 是否显示指派 Boolean
      showOriginalBalance: false, // 是否显示联查余额 Boolean
      showOriginalData: "", // 联查余额数据 String
      showFundPlan: false, // 显示预算计划 Boolean
      fundPlanData: null, // 预算计划数据 Object
      sideModalAdd: true, // 侧拉弹框增行按钮显示控制
      sideModalDel: true, // 侧拉弹框增行按钮显示控制
      sideModalSave: true, // 侧拉弹框增行按钮显示控制
      billCards: null, // 拉单数据集合
      curIndex: 0, // 当前选中拉单数据索引
      transferPks: [], // 拉单所选数据集合
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
    // 加载多语文件
    let { mutliLangKey, pub_multilang, moduleId } = this.props.BillConfig;

    this.props.MultiInit.getMultiLang({
      moduleId: [mutliLangKey, pub_multilang],
      domainName: moduleId,
      callback: this.multiLangCallback,
    });
  }

  /**
   * 多语加载成功回调函数
   * @param {*} baseMultiLangData - 多语文件
   * @param {*} status - 请求状态
   * @param {*} inlt - 占位符
   */

  multiLangCallback = (baseMultiLangData, status, inlt) => {
    if (status) {
      this.setState({ baseMultiLangData, inlt }, () => {
        let id = this.props.getUrlParam("id");
        let pageType = this.props.getUrlParam("pageType");
        // 是否为拉单
        let isPull = this.props.getUrlParam("isPull");
        if (id && pageType === "version") {
          // 如果是联查版本页面
          this.handleSetVersionTree(id);
        }
        baseCardInitTemplate.call(
          this,
          isPull ? pullBillTemplateInited.bind(this) : templateInited.bind(this)
        );
      });
    } else {
      console.log(
        this.state.baseMultiLangData["3617PUB-000022"]
      ); /* 国际化处理： 未加载到多语资源 */
    }
  };

  // 设置版本树参数并初始化
  handleSetVersionTree = (id) => {
    let { BillConfig, TreeConfig, syncTree: TreeUtil } = this.props;
    // 版本树结构信息
    let treeRoot = {
      isleaf: false,
      pid: "__root__",
      refname: this.state.baseMultiLangData[
        "3617PUB-000026"
      ] /* 国际化处理： 版本号 */,
      refpk: "-1",
    };

    // 发送数据
    let data = {
      queryAreaCode: "search", // 区域编码
      querytype: "tree", //  类型
      querycondition: {}, // 过滤条件
      pageCode: BillConfig.pageId, // pageCode
      pageInfo: { pageIndex: 0, pageSize: "100" }, // 页面信息
      def1: id, //主键
    };
    // 成功回调函数
    let callback = (treeData) => {
      this.setState(
        {
          isVersion: true,
        },
        () => {
          TreeUtil.setSyncTreeData(TreeConfig.treeId, [
            Object.assign(treeRoot, { children: treeData }),
          ]);
        }
      );
    };
    initVersionTree.call(this, BillConfig.API_URL.versionList, data, callback);
  };

  //返回按钮事件配置
  handleBackClick = () => {
    let { BillConfig } = this.props;
    // 联查场景
    let scene = this.props.getUrlParam("scene");
    // 联查列表时的主键信息，需要再返回给联查列表页
    let pks = this.props.getUrlParam("pks");
    // 是否拉单
    let isPull = this.props.getUrlParam("isPull");
    let urlParm = { status: "browse", id: pks };
    scene && (urlParm = { ...urlParm, scene });
    // 返回操作需要将复制状态置为false
    this.setState({ isPaste: false, });
    if (this.state.isVersion) {
      // 卡片查看版本点返回到查看版本之前的状态
      urlParm = { ...urlParm, pageType: "" };
      this.setState({
        isVersion: false,
      });
    } else if (isPull) {
      // 如果是拉单状态
      // 是否推单
      let isPush = this.props.getUrlParam("isPush");

      if (!isPush) {
        // 如果不是推过来的
        // 设置卡片返回标志位，用于列表页判断是否刷新列表
        setDefData("isPullBack", BillConfig.dataSource, true);

        let { name } = common.getPullUrlParams.call(this);
        let { target } = common.getPullBillConfig.call(this);
        let { url } = target;
        pageTo.pushTo(url, {
          pks: null,
          id: "",
          status: "",
          isPull: true,
          name,
        });
      } else if (isPush) {
        pageTo.pushTo("/list");
      }
    } else {
      // 设置卡片返回标志位，用于列表页判断是否刷新列表
      setDefData("isBack", BillConfig.dataSource, true);
      // 跳转到列表页
      pageTo.pushTo("/list", urlParm);
    }
  };

  /**
   * 页签切换处理函数
   * @param {*} key    当前选中页签的key
   */
  tabsChange = async (key) => {
    // 按钮显示函数
    cardUtils.toggleCardTableTabsBtn.call(this);
    // 编辑性控制
    await disableItemsSet.call(this, this.cardData, { table: true });
    // 必输性控制
    await requiredItemsSet.call(this, this.cardData, { table: true });
  };

  // 子表肩部按钮区域
  getTableHead = () => (
    <div className="shoulder-definition-area">
      <div className="definition-icons">
        {this.props.button.createButtonApp({
          area: this.props.TabsConfig.btnArea,
          // buttonLimit: btnLimit,
          onButtonClick: this.bodyButtonClick,
          popContainer: document.querySelector(".header-button-area"),
        })}
      </div>
    </div>
  );

  /**
   * @param {String} isTabsEmmit - 是否只触发子表肩部 非必输
   */
  // 按钮显隐控制
  buttonVisible = (isTabsEmmit) => {
    if (isTabsEmmit) {
      // 卡片子表肩部部按钮状态设置
      cardUtils.toggleCardTableTabsBtn.call(this);
      return;
    }
    let { FormConfig, BillConfig, form: formUtil } = this.props;
    // 业务状态
    let status = this.props.getUrlParam("status");
    // 联查业务场景
    let scene = this.props.getUrlParam("scene");
    // 是否浏览态
    let isBrowse = status === "browse";
    // 是否为拉单状态
    let isPull = this.props.getUrlParam("isPull");
    // 是否为推单状态
    let isPush = this.props.getUrlParam("isPush");
    // 单据编号
    let billNo = formUtil.getFormItemsValue(
      FormConfig.formId,
      BillConfig.billNo
    );
    billNo = billNo && billNo.value;
    // 卡片头部按钮状态设置
    cardUtils.toggleCardHeadBtn.call(this);
    // 卡片子表肩部部按钮状态设置
    cardUtils.toggleCardTableTabsBtn.call(this);
    // 设置页面状态
    setPageStatus.call(this, isBrowse ? "browse" : "edit");
    //设置卡片头部状态
    this.props.BillHeadInfo.setBillHeadInfoVisible({
      showBackBtn:
        (isBrowse || (isPull && !isPush)) && (!scene || scene === "linksce"), // 控制显示返回按钮
      showBillCode: billNo, //控制显示单据号：true为显示,false为隐藏 ---非必传
      billCode: billNo, //修改单据号---非必传
    });

    let saga_status = this.props.form.getFormItemsValue(
      FormConfig.formId,
      "saga_status"
    );
    // 根据saga状态显示红色感叹号
    this.props.button.toggleErrorStatus("head", {
      isError: saga_status && saga_status.value && saga_status.value == 1,
    });
    if (isBrowse) {
      //saga状态为1，弹出错误提示框
      if (saga_status && saga_status.value) {
        this.props.socket.showToast({
          gtxid: this.props.form.getFormItemsValue(
            FormConfig.formId,
            "saga_gtxid"
          ).value,
          billpk: this.props.form.getFormItemsValue(
            FormConfig.formId,
            BillConfig.primaryId
          ).value,
        });
      }
    }
  };

  // 多子表页签规则
  tableTabsRule = (areacode, newVal, oldVal, cardData) => {
    let { TabsConfig, FormConfig } = this.props;
    if (areacode === FormConfig.formId && TabsConfig && TabsConfig.tabsRule) {
      // 发上变化的数据在主表区域
      cardUtils.handleTabsRule.call(this, newVal, oldVal, cardData);
    }
  };

  // 主表编辑后事件
  afterEvent = async function (props, ...args) {
    let { FormConfig, form: formUtil } = this.props;
    // 如果操作字段你为pk_org
    let oldVal = args[3] && args[3].value;
    let newVal = args[2] && args[2].value;
    if (oldVal === newVal) return;
    if (args[1] === "pk_org") {
      if ((newVal && oldVal && oldVal !== newVal) || !newVal) {
        // 如果pk_org有新旧值且发生改变 或新值为空
        promptBox({
          color: "warning",
          title: this.state.baseMultiLangData[
            "3617PUB-000034"
          ] /* 国际化处理： 确定要更换财务组织吗 */,
          content: this.state.baseMultiLangData[
            "3617PUB-000083"
          ] /* 国际化处理： 更换财务组织回清空所有数据，请谨慎操作！*/,
          beSureBtnClick: () => {
            // 清空所有字段
            clearAllData.call(this);
            if (!newVal) {
              // 如果清空财务组织 设置主表编辑性为不可编辑
              this.props.initMetaByPkorg();
              this.cardData = null;
              // 按钮显示 规则
              this.buttonVisible.call(this);
              // 多子表页签规则
              this.tableTabsRule.call(
                this,
                args[0],
                newVal,
                oldVal,
                this.cardData
              );
            } else {
              let data = getCardAfterEventData.call(
                this,
                args[0],
                args[1],
                args[2]
              );

              // 删除data的changedrows属性
              data.changedrows && delete data.changedrows;

              baseCardItemsRule.call(this, args[0], args[1], data);
            }
          },
          cancelBtnClick: () => {
            formUtil.setFormItemsValue(args[0], {
              [args[1]]: args[3],
            });
          },
        });
      } else {
        // 如果pk_org有值
        // 走模板编辑性
        this.props.resMetaAfterPkorgEdit();
        let data = getCardAfterEventData.call(this, args[0], args[1], args[2]);
        // 删除data的changedrows属性
        data.changedrows && delete data.changedrows;
        baseCardItemsRule.call(this, args[0], args[1], data);
      }
    } else {
      let data = getCardAfterEventData.call(this, args[0], args[1], args[2]);
      // 删除data的changedrows属性
      data.changedrows && delete data.changedrows;
      baseCardItemsRule.call(this, args[0], args[1], data);
    }
  };

  // 主表编辑前事件
  beforeEvent = (props, ...args) => {
    if (this.props._beforeEvent) {
      return (
        this.props._beforeEvent.call(this, ...args) &&
        getBeforeEventCurrtype.call(this, props, args[1])
      );
    } else {
      return getBeforeEventCurrtype.call(this, props, args[1]);
    }
  };

  // 子表编辑前事件
  beforeTableEvent = (props, ...args) => {
    if (this.props._beforeTableEvent) {
      return (
        this.props._beforeTableEvent.call(this, ...args) &&
        getBeforeEventCurrtype.call(this, props, args[1])
      );
    } else {
      return getBeforeEventCurrtype.call(this, props, args[1]);
    }
  };

  // 子表编辑后事件
  afterTableEvent = async function (props, ...args) {
    // 编辑后事件可能会涉及网络请求异步函数
    let { cardTable: cardTableUtil } = this.props;
    let areacode = cardTableUtil.getCurTabKey();
    let data = getCardAfterEventData.call(
      this,
      areacode,
      args[1],
      {
        value: args[2],
      },
      args[3] && args[3][0] && args[3][0].oldvalue
    );

    if (data.newvalue.value) {
      let newvalues = [];
      if (data.newvalue.value instanceof Array) {
        // 如果newvalue是数组 添加changedrows属性
        newvalues = data.newvalue.value.map((item) => {
          return item.refpk;
        });
      } else if (data.newvalue.value instanceof Object) {
        // 如果newvalue是对象
        newvalues.push(data.newvalue.value.refpk);
      }
      data.changedrows = [
        {
          newvalue: {
            value: newvalues,
          },
        },
      ];
    }
    baseCardItemsRule.call(this, areacode, args[1], data, args[4]);
  };

  // 子表按钮事件
  bodyButtonClick = async (...args) => {
    this.props._bodyButtonClick &&
      (await this.props._bodyButtonClick.call(this, ...args));
    let status = this.props.getUrlParam("status");
    if (status === "browse") {
      // 如果是浏览态 退出
      return;
    }
    let {
      cardTable: cardTableUtil,
      button: buttonUtil,
      TabsConfig,
      TableConfig
    } = this.props;
    if (!btnsMap) {
      // 页面所有按钮集合
      btnsMap = {};
      let btns = buttonUtil.getButtons();
      btns.map((item) => {
        if (!btnsMap[item.area]) {
          // 如果btnsMap中没有某区域按钮
          btnsMap[item.area] = [];
        } else {
          btnsMap[item.area].push(item.key);
        }
      });
    }

    if (TabsConfig && TabsConfig.btnArea && btnsMap[TabsConfig.btnArea]) {
      // 如果是子表肩部按钮
    } else if (
      TableConfig &&
      TableConfig.btnArea &&
      btnsMap[TableConfig.btnArea]
    ) {
      // 如果是子表行内按钮
    }
    let curTabKey = cardTableUtil.getCurTabKey();
    // 获取子表数据
    let tableData = cardTableUtil.getTabData(curTabKey);
    // 更新cardData
    this.cardData.card.bodys[curTabKey] = tableData;
    // 按钮显示函数
    let checkedRows = cardTableUtil.getCheckedRows(TableConfig.tableCode);
    cardUtils.toggleCardTableTabsBtn.call(this, checkedRows);
  };

  // 子表勾选单行数据
  bodySelectedEvent = (props, moduleId, record, index, status) => {
    let { cardTable: cardTableUtil, TableConfig } = this.props;
    let checkedRows = cardTableUtil.getCheckedRows(TableConfig.tableCode);
    cardUtils.toggleCardTableTabsBtn.call(this, checkedRows);
  };

  // 子表全选数据
  bodySelectedAllEvent = (props, moduleId, status, length) => {
    let { cardTable: cardTableUtil, TableConfig } = this.props;
    let checkedRows = cardTableUtil.getCheckedRows(TableConfig.tableCode);
    cardUtils.toggleCardTableTabsBtn.call(this, checkedRows);
  };

  // 侧拉弹框保存事件
  modelSave = () => {
    buttonClick.call(this, this.props, "Save");
  };

  // 侧拉弹框增行操作
  modelAddRowBefore = (props, moduleId, index, record) => {
    // 代表能否执行行内删行操作的flag
    let flag = false;
    let { TabsConfig } = this.props;
    if (TabsConfig && TabsConfig.btnsRule) {
      // 如果卡片子表肩部按钮规则存在
      let btnRule = TabsConfig.btnsRule.call(this);
      for (let item of btnRule) {
        if (item.key === "AddRow") {
          // 如果是增行按钮
          if (item.visible instanceof Boolean) {
            // 如果visible属性是布尔值
            flag = item.visible;
          } else if (item.visible instanceof Function) {
            // 如果visible属性是函数类型
            flag = item.visible.call(this);
          } else {
            // 尝试转为布尔值类型
            flag = Boolean(item.visible);
          }
        }
      }
      if (flag) {
        // 如果flag为true 则表示可以进行增行操作
        this.bodyButtonClick.call(this, props, "AddRow", "", record, index);

        // 更新侧拉弹框中的数据
        tabModalToNextData.call(this, "modalAdd", index);
      } else {
        toast({
          color: "warning",
          content: this.state.baseMultiLangData["3617PUB-000046"],
        }); /* 国际化处理 当前单据数据不允许增行 */
      }
    }
    return false;
  };

  // 侧拉弹框删行操作
  modelDelRowBefore = (props, moduleId, index, record) => {
    // 代表能否执行行内删行操作的flag
    let flag = false;
    let { TableConfig, cardTable: cardTableUtil } = this.props;
    if (TableConfig && TableConfig.btnsRule) {
      // 如果卡片子表行内按钮规则存在
      // 当前活动页签
      let curTabKey = cardTableUtil.getCurTabKey();
      //   // 当前页签所有数据
      let btnRule = TableConfig.btnsRule.call(this, curTabKey, record, index);
      for (let item of btnRule) {
        if (item.key === "DelRow") {
          // 如果是删行按钮
          if (item.visible instanceof Boolean) {
            // 如果visible属性是布尔值
            flag = item.visible;
          } else if (item.visible instanceof Function) {
            // 如果visible属性是函数类型
            flag = item.visible.call(this);
          } else {
            // 尝试转为布尔值类型
            flag = Boolean(item.visible);
          }
        }
      }
      if (flag) {
        // 如果flag为true 则表示可以进行删行操作
        this.bodyButtonClick.call(this, props, "DelRow", "", record, index);

        // 更新侧拉弹框中的数据
        tabModalToNextData.call(this, "modalDel", index);
      } else {
        toast({
          color: "warning",
          content: this.state.baseMultiLangData["3617PUB-000047"],
        }); /* 国际化处理 该行数据不允许删行 */
      }
    }
    return false;
  };

  // 侧拉弹框切换行数据处理函数
  sideModalRowChange = (record, index) => {
    // 设置侧拉弹框按钮显隐
    cardUtils.toogleSideModalBtns.call(this, record, index);
  };

  render() {
    let {
      BillHeadInfo,
      cardPagination,
      DragWidthCom,
      ncmodal,
      BillConfig, // 单据基本配置信息
      BtnConfig, // 按钮配置信息
      FormConfig, // 主表配置信息
      TreeConfig, // 树状图配置信息
      TableConfig, // 表格配置信息
      PullBillConfig, // 拉单配置
      LinkConfig, // 联查配置信息
      ModalConfig, //  自定义modal框信息
      cardTable: cardTableUtil,
      button: buttonUtil,
      form: formUtil,
      syncTree: TreeUtil,
      socket,
      transferTable: transferTableUtil,
      getUrlParam
    } = this.props;
    let {
      baseMultiLangData,
      showUploader,
      billInfo,
      outputData,
      isVersion,
      showApproveDetail,
      compositedata,
      compositedisplay,
      showOriginalBalance,
      showOriginalData,
      showFundPlan,
      fundPlanData,
      sideModalAdd,
      sideModalDel,
      sideModalSave,
    } = this.state;
    let { createTransferList } = transferTableUtil;
    let { createTabsTable } = cardTableUtil;
    let { createCardPagination } = cardPagination;
    let { createBillHeadInfo } = BillHeadInfo;
    let { createButtonApp, createErrorFlag } = buttonUtil;
    let { createSyncTree } = TreeUtil;
    let { createForm } = formUtil;
    let status = getUrlParam("status"); // 页面状态
    let isBrowse = status === "browse";
    let scene = getUrlParam("scene"); // 联查场景
    let linkListToCard = getUrlParam("pks"); // 联查列表跳转卡片页时，记录列表数据，用于卡片返回列表时使用
    let isPull = getUrlParam("isPull"); // 是否为拉单
    let isShowBackBtn = !(scene && !linkListToCard); // 卡片页是否显示返回按钮（联查场景下没有 pks 参数时，不需要显示返回按钮，其他场景都需要有返回按钮）
    // let isPush = this.props.getUrlParam("isPush"); // 是否为推单
    // let leftTransferArea = ""
    // if(isPull){
    //   // 如果是拉单
    //   let {origin} = commmon.getPullBillConfig.call(this)
    //   leftTransferArea = origin.leftTransferArea
    // }

    ModalConfig =
      ModalConfig &&
      (ModalConfig instanceof Array ? ModalConfig : [ModalConfig]);
    // 树状区域
    let treeDom = (
      <div className="left-area" style={{ marginLeft: "20px" }}>
        {createSyncTree({
          treeId: TreeConfig.treeId, // 组件id
          needSearch: TreeConfig.needSearch, // 是否需要查询框，默认为true,显示。false: 不显示
          defaultExpandAll: TreeConfig.defaultExpandAll, // 默认展开所有节点
          disabledSearch: TreeConfig.disabledSearch, // 是否显示搜索框
          onSelectEve: onTreeNodeClick.bind(this), // 选择节点回调方法
          onMouseEnterEve: onTreeMouseEnter.bind(this), // 鼠标滑过节点事件
        })}
      </div>
    );
    /// 卡片主表区域
    let cardFormDom = (
      <div className={`nc-bill-top-area ${!TableConfig && "remove-block"}`}>
        <div className="nc-bill-form-area">
          {createForm(FormConfig.formId, {
            onAfterEvent: this.afterEvent.bind(this),
            onBeforeEvent: this.beforeEvent.bind(this),
          })}
        </div>
      </div>
    );
    // 卡片子表区域
    let cardFormTableDom = (
      <div className="nc-bill-bottom-area">
        <div className="nc-bill-table-area">
          {TableConfig && TableConfig.tableCode
            ? createTabsTable(TableConfig.tableCode, {
              cancelCustomRightMenu: true,
              showCheck: true, // 是否展示复选框
              showIndex: true,
              hideAdd: !sideModalAdd, // 是否隐藏侧拉弹框增行按钮
              hideDel: !sideModalDel, // 是否隐藏侧拉弹框删除按钮
              hideModelSave: !sideModalSave, // 是否隐藏侧拉弹框保存按钮
              modelSave: this.modelSave.bind(this),
              sideRowChange: this.sideModalRowChange.bind(this), // 侧拉弹框行数据切换函数
              modelAddRowBefore: this.modelAddRowBefore.bind(this), // 侧拉弹框增行按钮点击前函数
              modelDelRowBefore: this.modelDelRowBefore.bind(this), // 侧拉弹框删除按钮点击前函数
              tableHead: this.getTableHead.bind(this), // 子表表头
              onTabChange: this.tabsChange.bind(this), // 子表页签切换函数
              onAfterEvent: this.afterTableEvent.bind(this), // 子表编辑后事件
              onBeforeEvent: this.beforeTableEvent.bind(this), //  子表编辑前事件
              onSelected: this.bodySelectedEvent.bind(this), // 左侧选择列单个选择框回调函数
              onSelectedAll: this.bodySelectedAllEvent.bind(this), // 左侧选择列全选回调函数
            })
            : ""}
        </div>
      </div>
    );
    // 右卡区域
    let rightDom = (
      <div className="nc-bill-card">
        {cardFormDom}
        {cardFormTableDom}
      </div>
    );

    return (
      <div
        className={isPull ? "nc-bill-transferList" : "nc-bill-card"}
        id={isPull ? "transferCard" : ""}
      >
        <NCAffix>
          {/* 适配 socket 开始 */}
          {socket.connectMesg({
            headBtnAreaCode: BtnConfig.btnArea, // 表头按钮区域ID
            formAreaCode: FormConfig.formId, // 表头Form区域ID
            billtype: BillConfig.billtype,
            billpkname: BillConfig.primaryId,
            dataSource: BillConfig.dataSource,
          })}
          {/* 适配 socket 结束 */}
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title: BillConfig.pageTitle, // 标题
                initShowBackBtn: isShowBackBtn, // 显示返回按钮
                backBtnClick: this.handleBackClick.bind(this), // 返回函数
              })}
            </div>
            {!isVersion && (
              <div className="header-button-area">
                {/* 适配 socket 头部错误标识开始 */}
                {createErrorFlag({
                  headBtnAreaCode: BtnConfig.btnArea,
                })}
                {/* 适配 socket 头部错误标识结束 */}
                {createButtonApp({
                  area: BtnConfig.btnArea,
                  onButtonClick: buttonClick.bind(this),
                })}
              </div>
            )}
            {!isVersion && !scene && isBrowse && (
              <div
                className="header-cardPagination-area"
                style={{ float: "right" }}
              >
                {createCardPagination({
                  dataSource: BillConfig.dataSource,
                  handlePageInfoChange: pageClick.bind(this),
                })}
              </div>
            )}
          </NCDiv>
        </NCAffix>
        {/* 当多版本联查时加载 树卡区域 */}
        {isVersion && (
          <div className="tree-card">
            <DragWidthCom
              leftDom={treeDom} //左侧区域dom
              rightDom={rightDom} //右侧区域dom
              defLeftWid="20%" // 默认左侧区域宽度，px/百分百
            />
          </div>
        )}
        {/* 当为拉单时 */}
        {isPull && (
          <div className="nc-bill-transferList-content">
            {createTransferList({
              //表格组件id
              headcode: FormConfig.formId, // 卡片主表区域编码
              transferListId: common.getPullBillConfig.call(this).origin
                && common.getPullBillConfig.call(this).origin.leftTransferArea, // 转单卡片左侧列表树区域编码
              onTransferItemSelected: onTransferItemSelected.bind(this), // 转单缩略图被选中时的钩子函数
            })}
            <div className="transferList-content-right nc-bill-card">
              {rightDom}
            </div>
          </div>
        )}
        {!isVersion && !isPull && cardFormDom}
        {!isVersion && !isPull && TableConfig && cardFormTableDom}
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
            showmodal={showOriginalBalance}
            showOriginalData={showOriginalData}
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
            show={showFundPlan}
            sourceData={fundPlanData}
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

export default BaseCard;
