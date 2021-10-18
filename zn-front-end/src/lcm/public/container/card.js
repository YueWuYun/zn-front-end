/*
    卡片页编辑后事件公共函数
*/
import {
  ajax,
  toast,
  cacheTools,
  cardCache,
  deepClone,
  promptBox,
  getBusinessInfo,
  pageTo
} from "nc-lightapp-front";
let {
  getCacheById,
  addCache,
  updateCache,
  getNextId,
  deleteCacheById,
  getCurrentLastId,
  setDefData
} = cardCache;

import {
  OPR_NAME,
  api,
  printFn,
  output,
  fileMgr,
  orgVersionView,
  compositeTurnOff,
  getPullBillConfig,
  getPullUrlParams
} from "./common";
import {
  clearAllData,
  initAddCard,
  initCopyCard
} from "./page";
import * as cardUtils from "./cardUtils";
import {
  baseCardInitTemplate,
  disableItemsSet,
  requiredItemsSet,
} from "../components/BaseCard/events";
import moment from "moment";
import {
  apiSaga
} from "src/tmpub/pub/util/apisaga/apisaga";
const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

/**
 * 重置meta
 */
export function metaReset() {
  let {
    BillConfig,
    meta: metaUtil
  } = this.props;
  if (!BillConfig.resetMeta) return;
  let meta = metaUtil.getMeta() || {};
  meta = BillConfig.initTemplate ?
    BillConfig.initTemplate.call(this, meta) :
    meta;
  metaUtil.setMeta(meta);
}

/**
 * 编辑后事件 获取卡片页要发送请求的数据
 * @param {String} areacode 区域编码
 * @param {String} key 字段key
 * @param {Object} value 更改后的新值
 * @param {Object} oldValue 更改后的旧值
 */
export function getCardAfterEventData(areacode, key, value, oldValue) {
  let {
    BillConfig,
    FormConfig,
    TabsConfig,
    cardTable: cardTableUtil,
  } = this.props;
  let data;
  if (TabsConfig && TabsConfig.tabOrder) {
    data = this.props.createTabsAfterEventData(
      BillConfig.pageId,
      FormConfig.formId,
      (TabsConfig && TabsConfig.tabOrder) || [],
      areacode,
      key,
      value,
      areacode
    );
    if (oldValue) {
      // 如果是子表编辑后事件 手动赋值oldvalue
      data.oldvalue = oldValue;
    }
  } else {
    data = this.props.createHeadAfterEventData(
      BillConfig.pageId,
      FormConfig.formId,
      "",
      areacode,
      key,
      value
    );
  }
  return JSON.parse(JSON.stringify(data));
}

/**
 * 模板初始化之后的回调函数
 * @param {Object} templateData 模板初始化数据
 */
export function templateInited(templateData) {
  // 业务状态
  let status = this.props.getUrlParam("status");
  // 页面id
  let id = this.props.getUrlParam("id");
  let {
    BillConfig
  } = this.props;
  // 请求数据
  let data = {
    pk: id,
    pageCode: BillConfig.pageId,
  };
  if (status === "browse") {
    // 如果是浏览态
    getCardData
      .call(this, BillConfig.API_URL.queryCard, data, true)
      .then((data) => {
        getCardDataCallback.call(this, data);
      });
  } else if (status === "add") {
    // 如果是新增页面
    // 初始化编辑性及数据 控制按钮显隐
    initAddCard.call(this, templateData).then(() => {
      initAddCardCallBack.call(this, data);
    });
  } else if (status === "edit") {
    // 如果是修改
    getCardData
      .call(this, BillConfig.API_URL.queryCard, data, true)
      .then((data) => {
        getCardDataCallback.call(this, data);
      });
  } else if (status === "confirmcollect") {
    // 如果是确认收款
    getCardData
      .call(this, BillConfig.API_URL.queryCard, data, true)
      .then((data) => {
        //  // 用户自定义主子表变更处理函数
        //  this.handleChange && this.handleChange.call(this);
        getCardDataCallback.call(this, data);
        let businessInfo = getBusinessInfo();
        let date = businessInfo.businessDate;
        let collectregistrant = businessInfo.userId;
        let collectregistrantname = businessInfo.userName;
        this.props.form.setFormItemsValue(FormConfig.formId, {
          actualcollectdate: {
            value: date,
            dispaly: date
          },
          collectregistrant: {
            value: collectregistrant,
            display: collectregistrantname,
          },
          collectregdate: {
            value: date,
            dispaly: date
          },
        });
      });
  } else if (status === "honour") {
    // 如果是承付
    getCardData
      .call(this, BillConfig.API_URL.queryCard, data, true)
      .then((data) => {
        //  // 用户自定义主子表变更处理函数
        //  this.handleChange && this.handleChange.call(this);
        getCardDataCallback.call(this, data);
        let businessInfo = getBusinessInfo();
        let date = businessInfo.businessDate;
        let userid = businessInfo.userId; // 当前用户id
        let username = businessInfo.userName; // 当前用户名称
        // 给卡片字段设置默认值
        this.props.form.setFormItemsValue("header", {
          commitdate: {
            value: date,
            dispaly: date
          }, // 承付日期
          paydate: {
            value: date,
            dispaly: date
          }, // 付款日期
          // 承付人
          commitperson: {
            value: userid,
            display: username,
          },
        });
      });
  } else if (status === "copy") {
    // 如果是复制页面
    initCopyCard.call(this).then(() => {
      getCardData
        .call(this, BillConfig.API_URL.copyCard, data, true)
        .then((data) => {
          // 用户自定义主子表复制处理函数
          this.handleCopy && this.handleCopy.call(this);
          getCardDataCallback.call(this, data);
        });
    });
  } else if (status === "change") {
    // 如果是变更
    getCardData
      .call(this, BillConfig.API_URL.queryCard, data, true)
      .then((data) => {
        // 用户自定义主子表变更处理函数
        this.handleChange && this.handleChange.call(this);
        getCardDataCallback.call(this, data);
      });
  } else if (status === "extension") {
    // 如果是展期
    getCardData
      .call(this, BillConfig.API_URL.queryCard, data, true)
      .then((data) => {
        // 用户自定义主子表展期处理函数
        this.handleExtension && this.handleExtension.call(this);
        getCardDataCallback.call(this, data);
      });
  }
}
/**
 * 模板初始化之后的回调函数
 * @param {Object} templateData 模板初始化数据
 * @param {Object} res 页面数据
 */
export function pullBillTemplateInited(templateData = null, res) {
  // 业务状态
  let status = this.props.getUrlParam("status");

  if (status === "browse") {
    // 如果是浏览态
    getPullBillData.call(this, res).then((data) => {
      getCardDataCallback.call(this, data);
    });
  } else if (status === "add") {
    // 如果是新增页面
    // 初始化编辑性及数据 控制按钮显隐
    getPullBillData.call(this, res).then((data) => {
      getCardDataCallback.call(this, data);
    });
  } else if (status === "edit") {
    // 如果是修改
    getPullBillData.call(this, res).then((data) => {
      getCardDataCallback.call(this, data);
    });
  } else if (status === "copy") {
    // 如果是复制
    initCopyCard.call(this).then(() => {
      getPullBillData.call(this, res).then((data) => {
        // 用户自定义主子表复制处理函数
        this.handleCopy && this.handleCopy.call(this);
        getCardDataCallback.call(this, data);
      });
    });
  } else if (status === "change") {
    // 如果是变更
    getPullBillData.call(this, res).then((data) => {
      // 用户自定义主子表变更处理函数
      this.handleChange && this.handleChange.call(this);
      getCardDataCallback.call(this, data);
    });
  } else if (status === "extension") {
    // 如果是展期
    getPullBillData.call(this, res).then((data) => {
      // 用户自定义主子表展期处理函数
      this.handleExtension && this.handleExtension.call(this);
      getCardDataCallback.call(this, data);
    });
  }
}

/**
 * 页面卸载前执行函数
 */
function handleUnmount() {
  let status = this.props.getUrlParam("status");

  if (status && status !== "browse") {
    // 如果为非浏览态
    window.onbeforeunload = (e) => {
      return this.state.baseMultiLangData["3617PUB-000025"];
      /* 国际化处理： 当前单据未保存, 您确定离开此页面？ */
    };
  } else {
    window.onbeforeunload = null;
  }
}

// 获取卡片数据成功后的回调函数
async function getCardDataCallback(data) {
  let status = this.props.getUrlParam("status");
  // 加载相应的页面卸载函数
  handleUnmount.call(this);

  // 设置页面状态
  setPageStatus.call(this, status);

  if (status && status !== "browse") {
    // 如果是编辑态

    // 恢复字段编辑性
    this.props.resMetaAfterPkorgEdit();

    // meta重置
    metaReset.call(this);

    // 多子表页签规则
    this.tableTabsRule.call(this, null, null, null, this.cardData);

    // 编辑性控制
    disableItemsSet.call(this, this.cardData);
    // 必输性控制
    requiredItemsSet.call(this, this.cardData);
  }

  // 按钮显示规则
  this.buttonVisible.call(this);
  // 子表复选框设置
  toogleTableCheckBox.call(this);
}

function initAddCardCallBack() {
  // 加载相应的页面卸载函数
  handleUnmount.call(this);

  // 按钮显示规则
  this.buttonVisible.call(this);
  // 多子表页签规则
  this.tableTabsRule.call(this, null, null, null, this.cardData);

  // 子表复选框设置
  toogleTableCheckBox.call(this);
}
/**
 * 卡片子表复选框显示控制
 */
function toogleTableCheckBox() {
  let {
    TableConfig,
    cardTable: cardTableUtil
  } = this.props; //禁用表格复选框
  // 业务状态
  let status = this.props.getUrlParam("status");

  TableConfig &&
    TableConfig.tableCode &&
    cardTableUtil.setAllCheckboxAble(
      TableConfig.tableCode,
      status !== "browse"
    );
}

/**
 * 获取拉单卡片数据
 * @param {Object} res - 相应数据
 */
export function getPullBillData(res) {
  let {
    BillConfig,
    FormConfig,
    TabsConfig,
    TableConfig,
    PullBillConfig,
    cardTable: cardTableUtil,
    transferTable: transferTableUtil,
    form: formUtil,
  } = this.props;

  return new Promise((resolve) => {
    if (res) {
      // 如果传入值
      let {
        data
      } = res;
      let {
        head,
        bodys
      } = data;
      if (head) {
        formUtil.setAllFormValue({
          [FormConfig.formId]: head[FormConfig.formId],
        });
      }
      if (bodys && TableConfig && TableConfig.tableCode) {
        cardTableUtil.setAllTabsData(bodys, TabsConfig.tabOrder, null, [
          ...TabsConfig.tabOrder,
          ...Object.keys(bodys),
        ]);
      }
      this.cardData = {
        card: data,
      };
      data && resolve && resolve(data);
      return;
    }
    let pks = this.props.getUrlParam("pks");
    if (typeof pks === "string") {
      // 如果是字符串 需要解析
      pks = JSON.parse(pks);
    }
    // 如果是浏览态
    let pkMapTs = new Map();
    pks &&
      pks.map((item) => {
        let {
          pk,
          ts
        } = item;
        //主键与tsMap
        pk && ts && pkMapTs.set(pk, ts);
      });

    // 拉单卡片页面配置
    let {
      origin
    } = getPullBillConfig.call(this);
    // 拉单卡片页请求地址 左侧转单卡片树区域编码
    let {
      ajaxUrl,
      leftTransferArea
    } = origin;
    ajax({
      url: ajaxUrl,
      data: {
        pkMapTs
      },
      success: (res) => {
        let {
          success,
          data
        } = res;
        if (success) {
          // 存放转单数据
          this.pullBillListData = data;
          // 设置左侧拉单树状列表数据
          transferTableUtil.setTransferListValue(leftTransferArea, data || {});
        }
      },
      error: (err) => {
        let msg = JSON.stringify(err.message);
        setPageStatus.call(this, "browse", () => {
          this.props.setUrlParam({
            id: "",
            status: "browse",
          });
          this.preId = "";
          clearAllData.call(this);
          this.buttonVisible.call(this);
          toast({
            color: "danger",
            content: msg,
          });
        });
      },
    });
  });
}

/**
 * 表单保存函数
 * @param {String} name - 保存类型
 * @param {String} url - 数据请求地址
 * @param {Boolean} isNoVerificate - 是否跳过自定义校验
 * */
export async function saveBill(name, url, isNoVerificate) {
  let {
    BillConfig,
    FormConfig,
    TabsConfig,
    TableConfig,
    cardTable: cardTableUtil,
  } = this.props;
  // 获取当前单据所有数据
  let data;
  if (TabsConfig && TabsConfig.tabOrder && TabsConfig.tabOrder.length > 0) {
    // 如果是多子表
    data = this.props.createTabsCardData(
      BillConfig.pageId,
      FormConfig.formId,
      TabsConfig.tabOrder
    );
  } else {
    // 如果只有主表
    data = this.props.createExtCardData(BillConfig.pageId, FormConfig.formId);
  }

  // 暂存本次操作的name 和 url
  this.name = name;
  this.url = url;

  // 保存前事件返回的最终要发送数据
  data = this.saveBefore.call(this, data);

  // 自定义校验
  let verificateFlag = isNoVerificate || this.handelVerificate.call(this, data);
  // 数据校验
  if (!verificateFlag) {
    // 如果校验未通过 则返回
    return;
  }

  // 子表必输项校验
  let requiredValidateFlag = requiredValidate.call(
    this,
    data,
    TabsConfig && TabsConfig.tabOrder
  );

  if (!requiredValidateFlag) {
    // 如果必输性校验未通过 则返回
    return;
  }

  // 验证公式校验
  formulaValidate.call(this, data).then(() => {
    // 发送保存请求
    handleSave.call(this, url, data).then(async (data) => {
      // 请求成功后
      let headData =
        data.head &&
        data.head[FormConfig.formId] &&
        data.head[FormConfig.formId].rows &&
        data.head[FormConfig.formId].rows[0] &&
        data.head[FormConfig.formId].rows[0].values;
      if (!headData) return;
      let ccMsg =
        headData && headData["ccmessage"] && headData["ccmessage"].value;
      // 授信提示
      ccMsg &&
        toast({
          color: "warning",
          content: ccMsg,
        });
      let tbbMsg =
        headData && headData["ntbmessage"] && headData["ntbmessage"].value;
      // 预算提示
      tbbMsg &&
        toast({
          color: "warning",
          content: tbbMsg,
        });

      // 单据id
      let id = headData[BillConfig.primaryId].value;

      // 成功消息提示
      toast({
        color: "success",
        content: `${this.state.baseMultiLangData[OPR_NAME[name]]}${
          this.state.baseMultiLangData[
          "3617PUB-000002"
          ] /* 国际化处理 [操作]成功 */
          }`,
      });
      // 更新缓存
      await updateCardCache.call(this, name, data);
      // 关闭弹框
      TableConfig &&
        TableConfig.tableCode &&
        cardTableUtil.closeModel(TableConfig.tableCode);

      // 设置页面参数
      this.props.setUrlParam({
        id,
        status: "browse",
      });
      // 设置页面状态为浏览态
      setPageStatus.call(this, "browse");

      // 保存后事件
      data = this.saveAfter.call(this, data);
      // 重置卡片数据
      resetCardData.call(this, data);
      if (name === "saveAdd") {
        // 如果操作是保存新增
        cardAdd.call(this);
      } else if (name === "saveCommit") {
        // 如果操作是保存提交
        cardCommit.call(this);
      } else {
        // 是否为拉单
        let isPull = this.props.getUrlParam("isPull");
        if (isPull) {
          hanldePullBillSaveAfter.call(this, data);
        } else {
          // 初始化页面主子表数据及属性
          templateInited.call(this);
        }
      }
    });
  });
}

/**
 * 字段必输性验证
 * @param {Object} data - 被校验数据
 * @param {Array} tabOrder - 子表页签集合
 */
export function requiredValidate(data, tabOrder) {
  let {
    FormConfig,
    TableConfig,
    form: formUtil,
    cardTable: cardTableUtil,
  } = this.props;
  let checkFormFlag = true;
  let checkTableFlag = true;
  // 主表字段必输项校验
  checkFormFlag = formUtil.isCheckNow(FormConfig.formId);
  if (!checkFormFlag) return false;
  // 子表字段必输项校验
  if (TableConfig && tabOrder) {
    for (let key of tabOrder) {
      // 过滤已经删除的数据
      let tempData = data.bodys[key].rows.filter((item) => item.status !== "3");
      if (tempData && tempData.length > 0) {
        // 如果子表有数据
        checkTableFlag = checkTableFlag && cardTableUtil.checkTabRequired(key);
      }
    }
  }
  if (!checkTableFlag) return false;
  return true;
}

/**
 * @param {Object} data - 单据数据
 * 编辑公式校验函数
 */
export function formulaValidate(data) {
  return new Promise((resolve) => {
    let {
      TableConfig
    } = this.props;
    TableConfig &&
      TableConfig.tabOrder &&
      TableConfig.tabOrder.length &&
      this.props.validateToTabSave ?
      this.props.validateToTabSave(
        data,
        () => {
          resolve && resolve();
        },
        (TableConfig && TableConfig.tableTypeObj) || {},
        ""
      ) :
      this.props.validateToSave(
        data,
        () => {
          resolve && resolve();
        },
        (TableConfig && TableConfig.tableTypeObj) || {},
        ""
      );
  });
}

/**
 * 拉单单据保存后事件
 * @param {String} id - 单据主键
 * @param {Object} data - 单据数据
 */

function hanldePullBillSaveAfter(data) {
  let {
    BillConfig,
    FormConfig,
    PullBillConfig,
    transferTable: transferTableUtil,
  } = this.props;
  let headData =
    data.head &&
    data.head[FormConfig.formId] &&
    data.head[FormConfig.formId].rows &&
    data.head[FormConfig.formId].rows[0] &&
    data.head[FormConfig.formId].rows[0].values;
  if (!headData) {
    console.error("your response format is wrong!!!");
    return;
  }
  let {
    origin,
    target
  } = getPullBillConfig.call(this);
  let {
    transferTablePk
  } = target;
  let {
    leftTransferArea
  } = origin;
  // 被下游关联的上游单据主键  后台保存成功返回的数据并不是全部数据
  let finishedPk = headData[transferTablePk] && headData[transferTablePk].value;

  // 更新拉单卡片页面左侧列表数据
  this.pullBillListData[this.pullListIndex] = data;
  // 保存
  if (finishedPk) {
    transferTableUtil.savePk(BillConfig.dataSource, [finishedPk]);
  }
  // 左侧树形卡片数据个数
  let num = transferTableUtil.getTransformFormAmount(leftTransferArea);
  if (num > 1) {
    // 更新拉单卡片页面左侧列表当前选中数据
    transferTableUtil.setTransferListValueByIndex(
      leftTransferArea,
      data,
      this.pullListIndex
    );
    transferTableUtil.setTransformFormStatus(leftTransferArea, {
      status: true,
      isNext: this.pullListIndex !== num - 1,
      isTriggerSelected: true,
      onChange: (current, next, currentIndex) => {

      },
    });
  } else {
    // 初始化页面主子表数据及属性
    templateInited.call(this);
  }
}

/**
 * 获取编辑后事件接口数据
 * @param {*} data - 必传。整单数据
 */
export function getAfterEventRes(data) {
  return new Promise((resolve, reject) => {
    let {
      BillConfig
    } = this.props;
    ajax({
      url: BillConfig.API_URL.afterEvent,
      async: false,
      data,
      success: (res) => {
        resolve(res);
      },
      error: (res) => {
        toast({
          color: "danger",
          content: res.message,
        });
        reject(res);
      },
    });
  });
}

/**
 * 根据开始日期和期间获取结束日期
 * @param {String} begin - 开始日期
 * @param {Number} period - 期间
 * @param {String} periodUnit - 期间单位
 */
export function getEndDate(begin, period, periodUnit) {
  if (!begin || !period || !periodUnit) return;
  let result;
  const transUnit = {
    DAY: "days", //日
    MONTH: "months", //月
    QUARTER: "quarters", //季
    YEAR: "years", //年
  };
  if (periodUnit == "HALFYEAR") {
    // 如果是半年
    result = moment(begin)
      .add(+period * 6, "months")
      .format(dateTimeFormat);
  } else {
    result = moment(begin)
      .add(period, transUnit[periodUnit])
      .format(dateTimeFormat);
  }
  return result;
}

/**
 * 银团信息插行
 * @param {*} props - 页面内置对象
 * @param {*} index - 行号
 */
export function insertBankType(props, index) {
  let {
    FormConfig,
    TableConfig
  } = this.props;
  let olcrate = props.form.getFormItemsValue(FormConfig.formId, "olcrate"); //组织本币汇率
  props.cardTable.addRow(TableConfig.tableCode, index, {
    banktype: {
      display: this.state.baseMultiLangData["3617PUB-000036"],
      value: "JOIN",
    } /* 国际化处理： 参与行*/ ,
    olcsynrate: {
      value: olcrate && olcrate.value ? olcrate.value : null,
    },
  });
}

/**
 * 对复制行的数据进行粘贴处理
 * @param {*} props          页面内置对象
 * @param {*} currTableId    当前选中tab-table的code
 * @param {*} selectArr      选中的数据
 * @param {*} index          行下标
 * 其中： tabs.tableId[currTableId]代表当前table的主键id的可以
 */
export function copyResolve(props, currTableId, selectArr, index) {
  let {
    TableConfig,
    cardTable: cardTableUtil
  } = this.props;
  cardTableUtil.insertRowsAfterIndex(currTableId, selectArr, index);
  cardTableUtil.setValByKeyAndIndex(
    currTableId,
    index,
    TableConfig.tableId[currTableId], {
      value: null,
    }
  );
  this.setState({
      isPaste: false,
    },
    () => {
      this.buttonVisible.call(this);
      cardTableUtil.setStatus(currTableId, "edit");
    }
  );
}

/**
 * 凭证联查单据
 * @param {*} props        页面内置对象
 * @param {*} moduleName   节点名
 */
export function linkVoucher(props, moduleName) {
  //src修改为scene
  let src = props.getUrlParam("scene");
  if (src) {
    //fip代表会计平台
    if ("fip" == src) {
      voucherLinkBill.call(this, moduleName);
    }
  }
}

/**
 * 凭证联查单据
 *
 * @param {*} moduleName - 模块名称 用于拼接url
 */
export function voucherLinkBill(moduleName) {
  let {
    BillConfig,
    TableConfig,
    cardTable: cardTableUtil,
    table: tableUtil,
  } = this.props;
  let checkedData = [];
  //缓存中的key为’checkedData’,
  checkedData = cacheTools.get("checkedData");
  if (checkedData && checkedData.length > 0) {
    ajax({
      url: `/nccloud/cdmc/${moduleName}/voucherlinkedbill.do`,
      data: {
        operatingLogVO: checkedData,
        pageCode: BillConfig.pageId,
      },
      success: (res) => {
        let {
          success,
          data
        } = res;
        if (success) {
          if (data) {
            let rowlenght = data[TableConfig.tableCode].rows;
            if (rowlenght.length == 1) {
              let record = rowlenght[0];
              //1条数据跳转到卡片页面
              this.props.pushTo("/card", {
                status: "browse",
                id: record.values[BillConfig.primaryId] &&
                  record.values[BillConfig.primaryId].value,
                scene: "linksce",
                pagecode: BillConfig.pageCode,
              });
            } else {
              //多条数据
              TableConfig &&
                tableUtil.setAllTableData(
                  TableConfig.tableId,
                  data[TableConfig.tableCode]
                );
            }
          } else {
            cardTableUtil.setAllTableData(TableConfig.tableId, {
              rows: [],
            });
          }
        }
      },
    });
  }
}

/**
 * 卡片翻页按钮
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pk
 */
export function pageClick(props, pk) {
  let preId = props.getUrlParam("id");
  // 保存上一个id
  this.preId = preId;
  // 设置页面id
  props.setUrlParam({
    id: pk,
  });
  // 重新刷新页面数据及按钮状态
  templateInited.call(this);
}

/**
 * 重置卡片数据
 */
export function resetCardData(data) {
  let {
    BillConfig,
    FormConfig,
    TableConfig,
    TabsConfig,
    form: formUtil,
    cardTable: cardTableUtil,
  } = this.props;
  let id = this.props.getUrlParam("id");
  // if (!id) return;
  // 设置主表数据
  if (data.head && data.head[FormConfig.formId]) {
    formUtil.setAllFormValue({
      [FormConfig.formId]: data.head[FormConfig.formId],
    });
  }
  // 设置子表数据
  if (TableConfig) {
    if (data.bodys) {
      cardTableUtil.setAllTabsData(
        data.bodys,
        TabsConfig.tabOrder,
        null,
        TableConfig.tableShow
      );
    } else {
      cardTableUtil.setAllTabsData({}, TabsConfig.tabOrder, null, []);
    }
  }
  // 设置单据编号
  this.setState({
    billNo: data.head[FormConfig.formId].rows[0].values[BillConfig.billNo].value,
  });
}

/**
 * 试算结果利息清单弹窗渲染数据
 */
export function renderTrycalData() {
  let {
    trycalData,
    FormConfig,
    TabsConfig,
    form: formUtil,
    cardTable: cardTableUtil,
  } = this.props;
  if (trycalData) {
    if (trycalData && trycalData.head) {
      formUtil.setAllFormValue({
        [FormConfig.formId]: trycalData.head[FormConfig.formId],
      });
      this.setState({
        billNo: formUtil.getFormItemsValue(FormConfig.formId, "vbillno").value,
      });
    }
    if (trycalData && trycalData.bodys) {
      cardTableUtil.setAllTabsData(
        trycalData.bodys,
        TabsConfig.tabOrder,
        null,
        Object.keys(trycalData.bodys)
      );
    }
  }
}

/**
 * 删除子表数据
 * @param {*} props 父组件传入参数集合
 * @param {*} key 子表页签key值
 */
export function delTabData(props, key) {
  let {
    cardTable: cardTableUtil
  } = this.props;
  // 获取子表数据
  let data = cardTableUtil.getTabData(key);
  // 删除后数据
  let result = [];
  for (let item of data.rows) {
    if (item.status !== "2") {
      // 不是新增数据
      if (["0", "1"].includes(item.status)) {
        //原有数据修改状态并保留
        item.status = "3";
      }
      result.push(item);
    }
  }
  // 重新赋值子表数据
  data.rows = result;
  cardTableUtil.setTabData(key, data);
}
/**
 * 获取编辑前事件接口
 */
export function getBeforeEventCurrtype(props, key) {
  //  组织本币汇率、集团本币汇率、全局本币汇率
  let {
    FormConfig,
    BillConfig
  } = this.props;
  // 财务组织
  let pk_org = props.form.getFormItemsValue(FormConfig.formId, "pk_org");
  pk_org = pk_org && pk_org.value;
  let pk_currtype;
  let CurrtypeData;
  if (BillConfig.rateType) {
    let rateItems = BillConfig.rateType;
    if (key in rateItems) {
      // 币种
      pk_currtype = props.form.getFormItemsValue(
        FormConfig.formId,
        rateItems[key]["currType"]
      );
      pk_currtype = pk_currtype && pk_currtype.value;
      CurrtypeData = {
        pk_org: pk_org,
        pk_currtype: pk_currtype,
        ratekey: rateItems[key].rateType,
      };
    }
  } else {
    const currType = ["olcrate", "glcrate", "gllcrate"];
    if (currType.includes(key)) {
      // 源币
      pk_currtype = props.form.getFormItemsValue(
        FormConfig.formId,
        "pk_currtype"
      );
      pk_currtype = pk_currtype && pk_currtype.value;
      let rateType = "";
      if (key === "olcrate") {
        rateType = "rate";
      } else if (key === "glcrate") {
        rateType = "grouprate";
      } else if (key === "gllcrate") {
        rateType = "globalrate";
      }
      CurrtypeData = {
        pk_org: pk_org,
        pk_currtype: pk_currtype,
        ratekey: rateType,
      };
    }
  }
  if (CurrtypeData) {
    return getNewCurrtype(CurrtypeData);
  } else {
    return true;
  }
}
// 获取最新的汇率数据
const getNewCurrtype = (data) => {
  let isOK = true;
  ajax({
    url: "/nccloud/lcm/openapply/operatecurrtrate.do",
    async: false,
    data,
    success: (res) => {
      if (res.success) {
        isOK = res.data;
      }
    }
  });
  return isOK;
};

/**
 * 卡片获取单据详情
 * @param {String} url - 请求路径 必输
 * @param {Object} data - 请求数据 必输
 * @param {Boolean} isRefresh - 是否刷新 非必输 默认false
 */
export function getCardData(url, data, isRefresh = false) {
  return new Promise((resolve) => {
    // 单据id
    let {
      pk: id
    } = data;
    if (!id) {
      // 如果id不存在 返回
      return;
    }
    let {
      BillConfig,
      FormConfig,
      TabsConfig,
      TableConfig,
      cardTable: cardTableUtil,
      form: formUtil,
    } = this.props;
    let cardData = getCacheById(id, BillConfig.dataSource);
    if (cardData && !isRefresh) {
      // 如果有缓存且非刷新，查询缓存，渲染卡片数据
      this.cardData = {
        card: cardData,
      };
      resetCardData.call(this, cardData);
      resolve && resolve(cardData);
      return;
    }
    // 页面状态
    let status = this.props.getUrlParam("status");
    ajax({
      url,
      data,
      success: (res) => {
        let {
          success,
          data
        } = res;
        let {
          head,
          bodys
        } = data;
        if (head) {
          formUtil.setAllFormValue({
            [FormConfig.formId]: head[FormConfig.formId],
          });
        }
        if (bodys && TableConfig && TableConfig.tableCode) {
          cardTableUtil.setAllTabsData(bodys, TabsConfig.tabOrder, null, [
            ...TabsConfig.tabOrder,
            ...Object.keys(bodys),
          ]);
        }
        this.cardData = {
          card: data,
        };
        // 更新列表缓存
        isRefresh &&
          status === "browse" &&
          updateCardCache.call(this, "update", data);

        success && data && resolve && resolve(data);
      },
      error: (err) => {
        let msg = JSON.stringify(err.message);
        setPageStatus.call(this, "browse", () => {
          this.props.setUrlParam({
            id: "",
            status: "browse",
          });
          this.preId = "";
          clearAllData.call(this);
          this.buttonVisible.call(this);
          toast({
            color: "danger",
            content: msg,
          });
        });
      },
    });
  });
}

/**
 * 加载查看版本页面
 * @param {*} url - 请求地址
 * @param {*} data - 请求数据
 * @param {*} callback - 回调函数
 */
export function initVersionTree(url, data, callback) {
  ajax({
    url,
    data,
    success: (res) => {
      let {
        success,
        data
      } = res;
      if (success) {
        let treeData = this.props.syncTree.createTreeData(data.data.rows);
        callback && callback(treeData);
      }
    },
  });
}

/**
 * 保存单据函数
 * @param {String} url - 请求地址
 * @param {Object} data - 请求数据
 */
export function handleSave(url, data) {
  // resolve为保存成功后回调函数
  return new Promise((resolve) => {
    // 发送网络请求
    ajax({
      url,
      //   async: false,
      data,
      success: (res) => {
        let {
          success,
          data
        } = res;
        if (success && data) {
          // 调用保存成功后事件
          resolve && resolve(data);
        }
      },
    });
  });
}

/**
 * 更新卡片缓存数据
 */
export function updateCardCache(name, data) {
  let {
    BillConfig,
    FormConfig
  } = this.props;
  let id =
    data.head[FormConfig.formId].rows[0].values[BillConfig.primaryId].value;

  // 缓存数据
  let cardData = getCacheById(id, BillConfig.dataSource);
  let status = this.props.getUrlParam("status");
  if (name === "delete" || name === "return") {
    // 删除某条数据缓存
    deleteCacheById(BillConfig.primaryId, id, BillConfig.dataSource);
  } else if (name === "save" || name === "saveCommit" || name === "saveAdd") {
    // 如果是保存操作
    if (status === "add" || status === "copy") {
      // 如果是新增或者复制
      if (!cardData) {
        // 如果无缓存数据 且为非删除 或 非 退回操作 增加该卡片页数据到缓存中
        addCache(id, data, FormConfig.formId, BillConfig.dataSource);
      }
    } else {
      // 如果是其他状态 则已有缓存数据 进行更新
      updateCache(
        BillConfig.primaryId, // 单据主键
        id, // 单据id
        data, // 单据数据
        FormConfig.formId, // 单据主表区域编码
        BillConfig.dataSource // 应用节点缓存key 卡片和列表共用
      );
    }
  } else {
    // 如果是其他状态 则已有缓存数据 进行更新
    updateCache(
      BillConfig.primaryId, // 单据主键
      id, // 单据id
      data, // 单据数据
      FormConfig.formId, // 单据主表区域编码
      BillConfig.dataSource // 应用节点缓存key 卡片和列表共用
    );
  }
}

/**
 * 卡片页按钮操作
 *
 * @param {*} name - 操作名称
 * @param {*} data - 请求数据
 * @param {*} other - 其他参数
 */
export function baseOperation({
  name,
  data = {},
  ...other
}) {
  let {
    BillConfig,
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    callback,
    successBefore,
    successAfter
  } = other;
  let pk =
    formUtil.getFormItemsValue(FormConfig.formId, BillConfig.primaryId).value ||
    this.props.getUrlParam("id");
  let ts =
    formUtil.getFormItemsValue(FormConfig.formId, "ts") &&
    formUtil.getFormItemsValue(FormConfig.formId, "ts").value;
  let pkMapTs = new Map();
  //主键与tsMap
  if (pk && ts) {
    pkMapTs.set(pk, ts);
  }
  this.setState({
    curPk: pk,
  });
  data = {
    ...data,
    pks: [pk],
    pkMapTs,
    pageCode: BillConfig.pageId,
  };
  // 复制data参数
  let orgsdata = data;
  api.call(this, {
    name,
    data,
    success: (res) => {
      let {
        success,
        data
      } = res;
      if (success) {
        successBefore && successBefore(res);
        if (
          res.data.workflow === "approveflow" ||
          res.data.workflow === "workflow"
        ) {
          // 提交即指派
          this.setState({
            compositedata: res.data,
            compositedisplay: true,
          });
        } else if (res.data.confirmFlag) {
          // 返回确认标志为true 弹出提示信息
          orgsdata = Object.assign(orgsdata, res.data);
          cardHandleConfirmMsg.call(this, orgsdata, other);
        } else {
          toast({
            color: "success",
            content: `${this.state.baseMultiLangData[OPR_NAME[name]]}${
              this.state.baseMultiLangData["3617PUB-000002"]
              }`,
          }); /* 国际化处理： [操作]成功*/
          /* 提交即审批增加预算提示信息 */
          if (name === "commit") {
            // 请求成功后
            let headData =
              data.head &&
              data.head[FormConfig.formId] &&
              data.head[FormConfig.formId].rows &&
              data.head[FormConfig.formId].rows[0] &&
              data.head[FormConfig.formId].rows[0].values;
            let tbbMsg =
              headData &&
              headData["ntbmessage"] &&
              headData["ntbmessage"].value;
            // 预算提示
            tbbMsg &&
              toast({
                color: "warning",
                content: tbbMsg,
              });
          }
          updateCardCache.call(this, name, data);
          if (name === "delete" || name === "return") {
            // 如果是删除操作 或退回操作
            // 删除缓存中该数据并获取下一条数据id
            let nextId = getNextId(pk, BillConfig.dataSource);
            if (nextId) {
              // 如果存在下一条数据 重新获取卡片页数据
              this.props.setUrlParam({
                id: nextId,
              });
            } else {
              // 删除的是最后一个的操作 清空页面数据 并置空id
              this.props.setUrlParam({
                id: "",
              });
              this.preId = "";
              clearAllData.call(this);
              this.buttonVisible.call(this);
            }
          }
        }
        successAfter && successAfter(data);
        // 删除的是最后一个的操作 清空页面数据 并置空id
        let isPull = this.props.getUrlParam("isPull");
        // 初始化页面主子表数据及属性
        !isPull &&
          templateInited.call(this);
      }
    },
  });
}

/**
 * @param {*} value 某数据
 * 提交即指派
 */
export function getAssginUsedr(value) {
  cardCommit.call(this, {
    data: {
      userObj: value,
    },
    successAfter: () => {
      compositeTurnOff.call(this);
    },
  });
}

/**
 * 删除操作
 */
export function cardDelete() {
  baseOperation.call(this, {
    name: "delete",
    successAfter: (data) => {
      let {
        getUrlParam,
        transferTable: transferTableUtil,
        FormConfig,
        BillConfig
      } = this.props;
      // 是否为拉单
      let isPull = getUrlParam("isPull");
      if (!isPull) return;
      // 拉单卡片页面配置
      let {
        origin
      } = getPullBillConfig.call(this);
      // 拉单卡片页请求地址 左侧转单卡片树区域编码
      let {
        leftTransferArea
      } = origin;
      let headData =
        data &&
        data.head &&
        data.head[FormConfig.formId] &&
        data.head[FormConfig.formId].rows &&
        data.head[FormConfig.formId].rows[0] &&
        data.head[FormConfig.formId].rows[0].values;
      if (!headData) return;
      // 单据id
      let id = headData[BillConfig.primaryId].value;
      // 存放转单数据
      this.pullBillListData = this.pullBillListData.filter((item) => {
        return item.head[FormConfig.formId].rows[0].values[BillConfig.primaryId].value !== id;
      });
      if (this.pullBillListData.length > 0) {
        // 设置左侧拉单树状列表数据
        transferTableUtil.setTransferListValue.call(this, leftTransferArea, this.pullBillListData || {});
      } else {
        // 设置卡片返回标志位，用于列表页判断是否刷新列表
        setDefData("isPullBack", BillConfig.dataSource, true);
        let {
          name
        } = getPullUrlParams.call(this);
        let {
          target
        } = getPullBillConfig.call(this);
        let {
          url
        } = target;
        pageTo.pushTo(url, {
          pks: null,
          id: "",
          status: "",
          isPull: true,
          name,
        });
        return;
      }
    }
  });
}

/**
 * 关闭操作
 */
export function cardClose() {
  baseOperation.call(this, {
    name: "close",
  });
}

/**
 * 新增操作
 */
export function cardAdd() {
  let id = this.props.getUrlParam("id");
  // 暂存当前卡片id
  this.preId = id ? id : "";
  this.props.setUrlParam({
    status: "add",
    id: "",
  });

  baseCardInitTemplate.call(this, templateInited.bind(this));
}

/**
 * 修改操作
 */

export function cardEdit() {
  let {
    FormConfig,
    BillConfig
  } = this.props;
  let pk =
    this.props.form.getFormItemsValue(FormConfig.formId, BillConfig.primaryId)
    .value || this.props.getUrlParam("id");
  let data = {
    pk: pk,
    fieldPK: BillConfig.primaryId,
    tableName: BillConfig.tableName,
  };
  apiSaga.call(this, {
    data,
    success: (res) => {
      //   let { FormConfig, form: formUtil } = this.props;
      this.props.setUrlParam({
        status: "edit",
      });
      templateInited.call(this);
      //成功进入编辑态，事务已经解冻，需将saga_frozen和saga_status设置为0
      if (this.props.form.getFormItemsValue(this.formId, "saga_frozen")) {
        this.props.form.setFormItemsValue(this.formId, {
          saga_frozen: {
            value: "0",
          },
        });
      }
      if (this.props.form.getFormItemsValue(this.formId, "saga_status")) {
        this.props.form.setFormItemsValue(this.formId, {
          saga_status: {
            value: "0",
          },
        });
      }
    },
  });
}

/**
 * 发票登记（到单和交单可以公用）
 */
export function NoteRegister() {
  baseOperation.call(this, {
    name: "invoice",
  });
}
/**
 * 取消承付操作
 */
export function cardCancelHonour() {
  baseOperation.call(this, {
    name: "cancelhonour",
  });
}
/**
 * 承付操作
 *
 */
export function cardHonour() {
  let {
    form: formUtil,
    FormConfig,
    BillConfig
  } = this.props;

  let pk =
    this.props.form.getFormItemsValue(FormConfig.formId, BillConfig.primaryId)
    .value || this.props.getUrlParam("id");
  let data = {
    pk: pk,
    fieldPK: BillConfig.primaryId,
    tableName: BillConfig.tableName,
  };
  apiSaga.call(this, {
    data,
    success: (res) => {
      // 设置页面业务状态
      this.props.setUrlParam({
        status: "honour",
      });
      templateInited.call(this);
    },
  });
}

/**
 * 取消确认收款操作
 */
export function cardCancelConfirmCollect() {
  baseOperation.call(this, {
    name: "cancelconfirmcollect",
  });
}

/**
 * 确认收款操作
 *
 */
export function cardConfirmCollect() {
  let {
    form: formUtil,
    FormConfig,
    BillConfig
  } = this.props;

  let pk =
    this.props.form.getFormItemsValue(FormConfig.formId, BillConfig.primaryId)
    .value || this.props.getUrlParam("id");
  let data = {
    pk: pk,
    fieldPK: BillConfig.primaryId,
    tableName: BillConfig.tableName,
  };
  apiSaga.call(this, {
    data,
    success: (res) => {
      // 设置页面业务状态
      this.props.setUrlParam({
        status: "confirmcollect",
      });
      templateInited.call(this);
    },
  });
}

/**
 * 卡片设置编辑性
 * @param {*} status  编辑状态 edit和browse两种状态
 */
export function setPageStatus(status, callback) {
  let {
    FormConfig,
    TableConfig,
    form: formUtil,
    cardTable: cardTableUtil,
  } = this.props;
  formUtil.setFormStatus(
    FormConfig.formId,
    status === "browse" ? "browse" : "edit"
  );
  TableConfig &&
    cardTableUtil.setStatus(
      TableConfig.tableCode,
      status === "browse" ? "browse" : "edit"
    );
  orgVersionView(this.props, FormConfig.formId, status === "browse");
  callback && callback();
}

// 展期操作
export function cardExtension() {
  let {
    FormConfig,
    BillConfig
  } = this.props;
  let pk =
    this.props.form.getFormItemsValue(FormConfig.formId, BillConfig.primaryId)
    .value || this.props.getUrlParam("id");
  let data = {
    pk: pk,
    fieldPK: BillConfig.primaryId,
    tableName: BillConfig.tableName,
  };
  apiSaga.call(this, {
    data,
    success: (res) => {
      // 设置页面业务状态
      this.props.setUrlParam({
        status: "extension",
      });
      templateInited.call(this);
      //成功进入编辑态，事务已经解冻，需将saga_frozen和saga_status设置为0
      if (this.props.form.getFormItemsValue(this.formId, "saga_frozen")) {
        this.props.form.setFormItemsValue(this.formId, {
          saga_frozen: {
            value: "0",
          },
        });
      }
      if (this.props.form.getFormItemsValue(this.formId, "saga_status")) {
        this.props.form.setFormItemsValue(this.formId, {
          saga_status: {
            value: "0",
          },
        });
      }
    },
  });
}
/**
 * 保存操作
 */
export function cardSave() {
  let {
    BillConfig
  } = this.props;
  saveBill.call(this, "save", BillConfig.API_URL.save);
}

/**
 * 保存新增操作
 */
export function cardSaveAdd() {
  let {
    BillConfig
  } = this.props;
  saveBill.call(this, "saveAdd", BillConfig.API_URL.save);
}

/**
 * 保存提交操作
 *
 */
export function cardSaveCommit() {
  let {
    BillConfig
  } = this.props;
  saveBill.call(this, "saveCommit", BillConfig.API_URL.save);
}

/**
 * 取消操作
 */
export function cardCancel() {
  let {
    BillConfig,
    FormConfig,
    TableConfig,
    form: formUtil,
    cardTable: cardTableUtil,
    setUrlParam,
    getUrlParam,
    transferTable: transferTableUtil,
  } = this.props;
  let isPull = getUrlParam("isPull"); // 是否为拉单
  // 单据如果是拉单场景时，取消时返回之前拉单列表页
  if (isPull) {
    let isPush = getUrlParam("isPush"); // 是否为推单
    if (isPush) {
      this.props.setUrlParam({
        id: "",
      });
      setUrlParam({
        status: "browse",
      });
      // 将复制状态置为false
      this.setState({
        isPaste: false,
      });
      // 设置主子表状态为浏览态
      setPageStatus.call(this, "browse");
      clearAllData.call(this);
      //清空单据编号
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBillCode: false,
      });
      // 控制按钮显隐
      this.buttonVisible.call(this);
      return;
    }
    // 单据id
    let id = formUtil.getFormItemsValue(FormConfig.formId, "pk_srcbill").value;
    // 拉单卡片页面配置
    let {
      origin
    } = getPullBillConfig.call(this);
    // 拉单卡片页请求地址 左侧转单卡片树区域编码
    let {
      leftTransferArea
    } = origin;
    // 存放转单数据
    this.pullBillListData = this.pullBillListData.filter((item) => {
      return item.head[FormConfig.formId].rows[0].values["pk_srcbill"].value !== id;
    });
    if (this.pullBillListData.length > 0) {
      // 设置左侧拉单树状列表数据
      transferTableUtil.setTransferListValue.call(this, leftTransferArea, this.pullBillListData || {});
    } else {
      // 设置卡片返回标志位，用于列表页判断是否刷新列表
      setDefData("isPullBack", BillConfig.dataSource, true);
      let {
        name
      } = getPullUrlParams.call(this);
      let {
        target
      } = getPullBillConfig.call(this);
      let {
        url
      } = target;
      pageTo.pushTo(url, {
        pks: null,
        id: "",
        status: "",
        isPull: true,
        name,
      });
      return;
    }
  }
  setUrlParam({
    status: "browse",
  });
  // 将复制状态置为false
  this.setState({
    isPaste: false,
  });
  // 设置主子表状态为浏览态
  setPageStatus.call(this, "browse");
  // 获取卡片页面id
  let id = getUrlParam("id");
  // 请求数据
  let data = {
    pk: id,
    pageCode: BillConfig.pageId,
  };
  if (id) {
    // 清空主表数据
    formUtil.cancel(FormConfig.formId);
    // 清空子表数据
    TableConfig &&
      TableConfig.tableCode &&
      cardTableUtil.resetTableData(TableConfig.tableCode);
    // 重新赋值卡片数据

    templateInited.call(this);
  } else {
    // 没有id查缓存中最后一条数据
    let lastId = getCurrentLastId(BillConfig.dataSource);
    let curId = this.preId ? this.preId : lastId;
    this.props.setUrlParam({
      id: curId,
    });
    data.pk = curId;
    if (curId) {
      templateInited.call(this);
    } else {
      clearAllData.call(this);
      //清空单据编号
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBillCode: false,
      });
      // 控制按钮显隐
      this.buttonVisible.call(this);
    }
  }
}

/**
 * 复制操作
 */
export function cardCopy() {
  // 设置页面业务状态
  this.props.setUrlParam({
    status: "copy",
  });
  templateInited.call(this);
}
/**
 * 提交操作
 */
export function cardCommit(params) {
  baseOperation.call(this, {
    name: "commit",
    successAfter: (data) => {
      let isPull = this.props.getUrlParam("isPull");
      if (isPull) {
        hanldePullBillSaveAfter.call(this, data);
      }
    },
    ...params,
  });
}

/**
 * 收回操作
 *
 */
export function cardUncommit() {
  baseOperation.call(this, {
    name: "uncommit",
    successAfter: (data) => {
      let isPull = this.props.getUrlParam("isPull");
      if (isPull) {
        hanldePullBillSaveAfter.call(this, data);
      }
    },
  });
}

/**
 * 终止操作
 */
export function cardTerminate(flag) {
  let extParam = new Map();
  extParam.set("confirmFlag", flag);
  let data = {
    extParam
  };
  // args["data"] = data;
  baseOperation.call(this, {
    name: "terminate",
    data
  });
}

/**
 * 取消终止操作
 */
export function cardUnterminate() {
  baseOperation.call(this, {
    name: "unterminate",
  });
}

/**
 * 变更操作
 *
 */
export function cardChange() {
  let {
    FormConfig,
    BillConfig
  } = this.props;
  let pk =
    this.props.form.getFormItemsValue(FormConfig.formId, BillConfig.primaryId)
    .value || this.props.getUrlParam("id");
  let data = {
    pk: pk,
    fieldPK: BillConfig.primaryId,
    tableName: BillConfig.tableName,
  };
  apiSaga.call(this, {
    data,
    success: (res) => {
      // 设置页面业务状态
      this.props.setUrlParam({
        status: "change",
      });
      templateInited.call(this);
      //成功进入编辑态，事务已经解冻，需将saga_frozen和saga_status设置为0
      if (this.props.form.getFormItemsValue(this.formId, "saga_frozen")) {
        this.props.form.setFormItemsValue(this.formId, {
          saga_frozen: {
            value: "0",
          },
        });
      }
      if (this.props.form.getFormItemsValue(this.formId, "saga_status")) {
        this.props.form.setFormItemsValue(this.formId, {
          saga_status: {
            value: "0",
          },
        });
      }
    },
  });
}

/**
 * 查看版本操作
 *
 */
export function cardViewVersion() {
  initVersionTree.call(this);
  this.setState({
    cardVersion: true,
  });
}

/**
 * 删除版本操作
 *
 */
export function cardDeleteVersion() {
  baseOperation.call(this, {
    name: "deleteversion",
  });
}

/**
 * 刷新操作
 *
 */
export function cardRefresh() {
  // 获取卡片页面id
  let id = this.props.getUrlParam("id");
  let {
    BillConfig
  } = this.props;
  // 请求数据
  let data = {
    pk: id,
    pageCode: BillConfig.pageId,
  }; // 如果是浏览态
  getCardData
    .call(this, BillConfig.API_URL.queryCard, data, true)
    .then((data) => {
      getCardDataCallback.call(this, data);
      toast({
        color: "success",
        content: this.state.baseMultiLangData[
          "3617PUB-000021"
        ] /*国际化处理  刷新成功 */ ,
      });
    });
}

/**
 * 打印操作
 *
 * @param {*} pks - 主键数组
 */
export function cardPrint(pks) {
  printFn.call(this, pks);
}

/**
 * 输出操作
 *
 * @param {*} pks - 主键数组
 */
export function cardOutput(pks) {
  output.call(this, pks);
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
export function cardFileMgr(billId, billNo) {
  fileMgr.call(this, billId, billNo);
}

/**
 * 制证操作
 *
 */
export function cardMakeVoucher() {
  baseOperation.call(this, {
    name: "makeVoucher",
  });
}

/**
 * 取消制证操作
 *
 */
export function cardCancelVoucher() {
  baseOperation.call(this, {
    name: "cancelVoucher",
  });
}

/**
 * 记账操作
 *
 */
export function cardBookkeeping() {
  let {
    FormConfig,
    form: formUtil
  } = this.props;

  // 放款节点 数据来源字段
  let datasrc_1 = formUtil.getFormItemsValue(FormConfig.formId, "datacomefrom");
  datasrc_1 = datasrc_1 && datasrc_1.value;
  // 还本节点 数据来源字段
  let datasrc_2 = formUtil.getFormItemsValue(FormConfig.formId, "datasrc");
  datasrc_2 = datasrc_2 && datasrc_2.value;
  // 付息节点 数据来源字段
  let datasrc_3 = formUtil.getFormItemsValue(FormConfig.formId, "datasrc");
  datasrc_3 = datasrc_3 && datasrc_3.value;

  if (
    datasrc_1 === "SYSTEM" ||
    datasrc_2 === "SYSTEM" ||
    datasrc_3 === "SYSTEM"
  ) {
    // 如果是系统生成  显示资金计划项目弹框
    this.setState({
      budgetprojectShow: true,
    });
  } else {
    baseOperation.call(this, {
      name: "bookkeeping",
    });
  }
}

/**
 * 取消记账操作
 *
 */
export function cardUnbookkeeping() {
  baseOperation.call(this, {
    name: "unbookkeeping",
  });
}

/**
 * 子表肩部复制行按钮，修改 isPaste 状态
 */
export function copyRow() {
  this.setState({
    isPaste: true
  });
}

/**
 * 子表肩部取消按钮，修改 isPaste 状态
 */
export function cancelRow() {
  this.setState({
    isPaste: false
  });
}

/**
 * 子表肩部粘贴至末行按钮
 */
export function copyLastLine() {
  let {
    TableConfig,
    cardTable: cardTableUtil
  } = this.props;
  let index = cardTableUtil.getNumberOfRows(TableConfig.tableCode);
  pasteRow.call(this, index - 1);
  this.setState({
    isPaste: false
  });
}

/**
 * 子表行内粘贴至此按钮
 */
export function copyAtLine(record, index) {
  pasteRow.call(this, index);
  this.setState({
    isPaste: false
  });
}

/**
 * 对复制行的数据进行粘贴处理
 * @param {*} index          行下标
 * 其中： tabs.tableId[currTableId]代表当前table的主键id的可以
 */
export function pasteRow(index) {
  let {
    TableConfig,
    cardTable: cardTableUtil
  } = this.props;
  let currTableId = TableConfig && TableConfig.tableCode;
  let selectArr = getPasteRows.call(this);
  cardTableUtil.insertRowsAfterIndex(currTableId, selectArr, index);
  TableConfig.tableId && cardTableUtil.setValByKeyAndIndex(
    currTableId,
    index,
    TableConfig.tableId[currTableId], {
      value: null,
    }
  );

  this.setState({
      isPaste: false,
    },
    () => {
      this.buttonVisible.call(this);
      cardTableUtil.setStatus(currTableId, "edit");
    }
  );
}

/**
 * 获取粘贴行数据
 */
function getPasteRows() {
  let {
    TableConfig,
    TabsConfig,
    cardTable: cardTableUtil
  } = this.props;
  let activeKey = cardTableUtil.getCurTabKey();
  let checkedRows = cardTableUtil.getCheckedRows(TableConfig.tableCode);
  // 获取activekey在Tableconfig对应的顺序 清空主键值
  if(TabsConfig && TabsConfig.tabPrimaryIdOrder && TabsConfig.tabOrder && checkedRows){
   let index = cardUtils.getArrayIndex(TabsConfig.tabOrder,activeKey);
   let primaryId = TabsConfig.tabPrimaryIdOrder[index];
   checkedRows.map((item) =>{
     item.data.values[primaryId].display = null;
     item.data.values[primaryId].value = null;
    }  
   );
  }
  let selectRowCopy = deepClone(checkedRows);
  let selectArr = selectRowCopy.map((item) => {
    item.data.selected = false;
    return item.data;
  });
  return selectArr;
}

/**
 * 浏览态 展开收起表体
 * @param {Object} record - 某行内数据
 */
export function toggleRowView(record) {
  let {
    TableConfig,
    cardTable: cardTableUtil
  } = this.props;
  cardTableUtil.toggleTabRowView &&
    cardTableUtil.toggleTabRowView(TableConfig.tableCode, record);
}

/**
 * 编辑态 展开侧拉编辑modal框
 * @param {Object} record - 某行内数据
 * @param {Number} index - 该行内数据索引
 */
export function openTabModal(record, index) {
  let status = this.props.getUrlParam("status");
  let {
    TableConfig,
    cardTable: cardTableUtil
  } = this.props;
  // 设置侧拉弹框按钮显隐
  cardUtils.toogleSideModalBtns.call(this, record, index);
  cardTableUtil.openTabModel &&
    cardTableUtil.openTabModel(
      TableConfig.tableCode,
      status && status !== "browse",
      record,
      index
    );
}

/**
 * 切换modal框总数据
 * @param {Number} tempIndex - 当前操作数据索引
 */
export function tabModalToNextData(key, tempIndex) {
  let record = null;
  let index = -1;
  let {
    TableConfig,
    cardTable: cardTableUtil
  } = this.props;
  // 当前活动页签
  let curTabKey = cardTableUtil.getCurTabKey();
  // 当前区域数据
  let tableValues = cardTableUtil.getTabData(curTabKey).rows;
  // 过滤掉删除态数据
  tableValues = tableValues.filter((record, index) => record.status !== "3");

  // 当前子表数据行数
  let rowsNum = cardTableUtil.getNumberOfRows(TableConfig.tableCode, false);
  if (key === "modalAdd") {
    // 如果是增行操作
    record = tableValues[rowsNum - 1];
    index = rowsNum - 1;
  } else if (key === "modalDel") {
    // 如果是删行操作
    if (tempIndex === 0) {
      // 如果删除的是第1行数据 返回
      return;
    }

    if (tempIndex === rowsNum) {
      // 如果操作的是最后一行数据
      if (tableValues && rowsNum) {
        // 如果还有非删除态数据 则将当前modal操作数据置为标题中最后一条数据
        record = tableValues[tempIndex - 1];
        index = tempIndex - 1;
      }
    } else {
      return;
    }
  }

  let status = this.props.getUrlParam("status");
  // 设置侧拉弹框按钮显隐
  cardUtils.toogleSideModalBtns.call(this, record, index);
  cardTableUtil.openTabModel &&
    cardTableUtil.openTabModel(
      TableConfig.tableCode,
      status && status !== "browse",
      record,
      index
    );
  // 设置选中行
  cardTableUtil.focusRowByIndex(TableConfig.tableCode, index);
}

/**
 * 插行时 更新编码字段
 * @param {String} key - 编码字段key
 * @param {Number} rowsNum - 当前子表数据总数
 * */

export function updateOrderCode(key, rowsNum) {
  let {
    TableConfig,
    cardTable: cardTableUtil
  } = this.props;
  for (let i = 0; i < rowsNum; i++) {
    // 遍历每行数据
    (function (i) {
      let orderCode =
        parseInt(i) <= 9 ?
        `00${i + 1}` :
        parseInt(i) <= 99 && parseInt(i) > 9 ?
        `0${i + 1}` :
        `${i + 1}`;
      cardTableUtil.setValByKeyAndIndex(TableConfig.tableCode, i, key, {
        display: orderCode,
        value: orderCode,
      });
    }.call(this, i));
  }
}
/**
 * 插行时 更新编码字段 针对放款计划的插行做修改
 * @param {String} key - 编码字段key
 * @param {Number} rowsNum - 当前子表数据总数
 * */

export function updatePlanOrderCode(key, minNum, prefix, paycode) {
  let {
    TableConfig,
    cardTable: cardTableUtil
  } = this.props;
  // 获取放款计划所有行数据
  let tableValues = cardTableUtil.getTabData("repayinfo").rows;
  let i = minNum;
  tableValues.map((item, index) => {
    let payvalue = item.values.paycode.value;
    if (payvalue === paycode) {
      let orderCode =
        parseInt(i) <= 9 ?
        `00${i + 1}` :
        parseInt(i) <= 99 && parseInt(i) > 9 ?
        `0${i + 1}` :
        `${i + 1}`;
      cardTableUtil.setValByKeyAndIndex(TableConfig.tableCode, index, key, {
        display: prefix + orderCode,
        value: prefix + orderCode,
      });
      i++;
    }
  });
}
/**
 * 卡片注销确认按钮
 * @param {*} args - listOperation的参数
 */
export function cardLogoutConfirm(args) {
  debugger;
  let {
    form: formUtil
  } = this.props;
  // 注销日期confirm
  let stopdate = formUtil.getFormItemsValue("header_logout", "stopdate");
  // 注销原因
  let stopreason = formUtil.getFormItemsValue("header_logout", "stopreason");
  let stopdateValue = stopdate && stopdate.value;
  let stopreasonValue = stopreason && stopreason.value;
  let extParam = new Map();
  extParam.set("stopdate", stopdateValue);
  extParam.set("stopreason", stopreasonValue);
  let {
    data
  } = args;
  data = {
    extParam,
    ...data
  };
  args["data"] = data;
  baseOperation.call(this, {
    name: "logout",
    ...args
  });
}

/**
 * 批改、注销 提示信息处理
 * @param {String} name - name联查名称
 * @param {Object} orgsdata - 参数数据
 * @param {Object} orgsdata - 后台返回数据
 */
export function cardHandleConfirmMsg(orgsdata, other) {
  orgsdata && orgsdata.extParam && orgsdata.extParam.set("confirmFlag", true);
  // 设置提示框显示
  promptBox({
    color: "warning",
    content: orgsdata.warnInfo,
    beSureBtnClick: () => {
      // 关闭注销弹框
      this.setState({
        registerCancleShow: false
      });
      cardLogoutConfirm.call(this, {
        data: orgsdata,
        other,
      });
    },
  });
}
/**
 * 退出拉单函数
 * @param {Object} name - 操作名称
 */
export function cardHandleCancelPullBill(name) {
  let status = this.props.getUrlParam("status");
  if (status && status != "browse") {
    promptBox({
      color: "warning",
      title: this.state.baseMultiLangData["3617PUB-000056"] /* 国际化处理： 退出转单*/ ,
      content: this.state.baseMultiLangData[
        "3617PUB-000057"
      ] /* 国际化处理：有未保存的单据，确定要退出转单吗?*/ ,
      beSureBtnClick: () => {
        this.props.pushTo("/list");
      }
    });
  } else {
    this.props.pushTo("/list");
  }
}

/**
 * 校验输入的比例 范围 在 -100% ~ 100%之间
 * @param {*} key
 * @param {*} value
 */
export function checkFloatingRatio(key, value) {
  if (value.value) {
    if (
      (value.value - 0 > 0 && value.value - 0 > 100) ||
      (value.value - 0 < 0 && value.value - 0 < -100)
    ) {
      toast({
        color: "warning",
        content: this.state.baseMultiLangData[
          "3617PUB-000060"
        ] /* 国际化处理 输入的比例范围应为-100%~100% */ ,
      });
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

/**
 * 子表删除时需要触发子表对应字段编辑后事件的方法
 *  @param {String} key 需要触发子表编辑后的字段
 */
export function cardTableDeleteRowTriggerAfterEvent(key) {
  // 编辑后事件可能会涉及网络请求异步函数
  let {
    cardTable: cardTableUtil
  } = this.props;
  let areacode = cardTableUtil.getCurTabKey();
  let cardData = getCardAfterEventData.call(
    this,
    areacode,
    key, {
      value: null
    }, {
      value: null
    }
  );
  // 如果该函数有定义 且对值进行了设置 则需要发送编辑后事件请求
  getAfterEventRes.call(this, cardData).then(({
    data
  }) => {
    // 重置卡片数据
    resetCardData.call(this, data);
  });
}