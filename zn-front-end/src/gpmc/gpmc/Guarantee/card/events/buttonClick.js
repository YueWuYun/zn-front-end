/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
  ajax,
  cardCache,
  deepClone,
  output,
  print,
  promptBox,
  toast,
  viewModel,
} from "nc-lightapp-front";
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import {
  baseReqUrl,
  javaUrl,
  printData,
  tabs,
  PK_CODE,
  TABLE_CODE,
} from "../../cons/constant.js";
import { afterEventEdit } from "./afterEvent";
import { buttonVisible } from "./buttonVisible";
import { afterSetData } from "./initPage";
import initTemplate from "./initTemplate";
import {
  getCardData,
  getCopyCardData,
  initMethod,
  resolveChange,
  resolveTabKey,
  resolveTabsChange,
} from "./page";
import {
  compareDebtorAndCreditor,
  resolveThreeType,
  warrantyinfoCellEdit,
  iscontraryDisabled,
} from "./resolve";

import { sagaApi } from "../../../../public/utils";
let { getCacheById, updateCache, addCache } = cardCache;
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
  // 当前单据的全部数据
  let pk =
    props.form.getFormItemsValue(this.formId, this.primaryId) &&
    props.form.getFormItemsValue(this.formId, this.primaryId).value;
  switch (id) {
    //头部 新增
    case "Add":
    case "Add_copy":
      add.call(this, props);
      break;
    //头部保存
    case "Save":
      saveBill.call(this, props, "save");
      break;
    //头部保存提交
    case "Savecommit":
      saveBill.call(this, props, "commit");
      break;
    //头部保存新增
    case "Saveadd":
      saveBill.call(this, props, "add");
      break;
    case "Edit":
      editOperation.call(this, props, "edit");
      break;
    case "Copy":
      copy.call(this, props, "copy", pk);
      break;
    case "Change":
      editOperation.call(this, props, "change");
      break;
    case "Delete":
      let version =
        props.form.getFormItemsValue(this.formId, "versionno") &&
        props.form.getFormItemsValue(this.formId, "versionno").value;
      promptBox({
        color: "warning",
        title:
          version > 1
            ? this.state.json["36620GC-000027"]
            : this.state.json[
                "36620GC-000028"
              ] /* 国际化处理： 删除历史版本,删除*/,
        content:
          version > 1
            ? this.state.json["36620GC-000029"]
            : this.state.json[
                "36620GC-000030"
              ] /* 国际化处理： 确定要删除历史版本吗?,确定要删除吗?*/,
        beSureBtnClick: this.btnOperation.bind(
          this,
          javaUrl[version > 1 ? "delversion" : "delete"],
          version > 1
            ? this.state.json["36620GC-000031"]
            : this.state.json["36620GC-000032"]
        ) /* 国际化处理： 删除历史版本成功,删除成功!*/,
      });
      break;
    // 头部 取消
    case "Cancel":
      promptBox({
        color: "warning",
        title: this.state.json["36620GC-000033"] /* 国际化处理： 取消*/,
        content: this.state.json[
          "36620GC-000034"
        ] /* 国际化处理： 确定要取消吗?*/,
        beSureBtnClick: cancel.bind(this, this.props),
      });
      break;
    //头部 提交
    case "Commit":
      this.btnOperation(
        javaUrl.commit,
        this.state.json["36620GC-000002"],
        pk
      ); /* 国际化处理： 提交成功!*/
      break;
    //头部 收回
    case "UnCommit":
      this.btnOperation(
        javaUrl.uncommit,
        this.state.json["36620GC-000035"],
        pk
      ); /* 国际化处理： 收回成功!*/
      break;
    //头部 终止
    case "Terminal":
      this.btnOperation(
        javaUrl.terminal,
        this.state.json["36620GC-000036"],
        pk
      ); /* 国际化处理： 终止成功!*/
      break;
    //头部 取消终止
    case "UnTerminal":
      this.btnOperation(
        javaUrl.unterminal,
        this.state.json["36620GC-000037"],
        pk
      ); /* 国际化处理： 取消终止成功!*/
      break;
    //头部 查看历史版本
    case "Version":
      props.setUrlParam({ status: "version", signal: "card" });
      this.initVersionTree();
      buttonVisible.call(this, props);
      this.forceUpdate();
      break;
    //头部 删除历史版本
    case "Delversion":
      promptBox({
        color: "warning",
        title: this.state.json["36620GC-000038"] /* 国际化处理： 删除当前版本*/,
        content: this.state.json[
          "36620GC-000039"
        ] /* 国际化处理： 确定要删除当前版本吗?*/,
        beSureBtnClick: this.btnOperation.bind(
          this,
          javaUrl.delversion,
          this.state.json["36620GC-000040"]
        ) /* 国际化处理： 删除当前版本成功!*/,
      });
      break;
    //头部 审批详情
    case "ApproveDetail":
      this.billInfo = { billId: pk };
      this.setState({ showApproveDetail: true });
      break;
    //头部 附件
    case "Attachment":
      fileMgr.call(this);
      break;
    //头部 打印
    case "Print":
      print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
        ...printData,
        oids: [pk],
      });
      break;
    //头部 输出
    case "Output":
      output({
        url: `${baseReqUrl}${javaUrl.print}.do`,
        data: {
          ...printData,
          outputType: "output",
          oids: [pk],
        },
      });
      break;
    //头部 刷新
    case "Refresh":
      getCardData.call(this, this.props.getUrlParam("id"), true, true, () => {
        toast({
          color: "success",
          content: this.state.json["36620GC-000093"],
        }); /* 国际化处理： 刷新成功 */
      });
      break;
    default:
      break;
  }
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
function add(props) {
  props.setUrlParam({ status: "add" });
  clearAll.call(this, props, null, tabs.tabShow);
  initTemplate.call(this, props);
}
/**
 * 修改前判断数据是否冻结
 * @param {*} props  页面内置对象
 */
export function editOperation(props, type) {
  let pk =
    props.form.getFormItemsValue(this.formId, this.primaryId) &&
    props.form.getFormItemsValue(this.formId, this.primaryId).value;
  let data = { pk: pk, fieldPK: PK_CODE, tableName: TABLE_CODE };
  sagaApi.call(this, {
    data: data,
    success: (res) => {
      if (props.form.getFormItemsValue(this.formId, "saga_frozen")) {
        props.form.setFormItemsValue(this.formId, {
          saga_frozen: { value: "0" },
        });
      }
      if (props.form.getFormItemsValue(this.formId, "saga_status")) {
        props.form.setFormItemsValue(this.formId, {
          saga_status: { value: "0" },
        });
      }
      edit.call(this, props, type);
    },
  });
}
/**
 * 修改
 * @param {*} props  页面内置对象
 */
export function edit(props, status) {
  props.setUrlParam({ status });
  buttonVisible.call(this, props);
  props.cardTable.toggleTabTable(this.tabCode);
  orgVersionView(this.props, this.formId); //组织版本视图
  if (status === "edit") {
    resolveThreeType.call(this, props, props.form.getAllFormValue(this.formId));
    props.form.setFormItemsDisabled(this.formId, {
      pk_org: true,
    });
    warrantyinfoCellEdit.call(this);
    iscontraryDisabled.call(this);
  } else {
    let guatype = props.form.getFormItemsValue(this.formId, "guatype");
    setGlobalStorage(
      "localStorage",
      "guatype",
      JSON.stringify(guatype),
      () => {}
    );
    resolveChange.call(this, guatype.value);
    if (status === "change") {
      //变更时需要做的事情
      resolveTabsChange.call(this);
      // 当此合同为变更状态时通担保方式为混合担保不可以编辑，为其它方式可以编辑
      if (guatype.value - 0 !== 4) {
        props.form.setFormItemsDisabled(this.formId, {
          guatype: false,
        });
      }
    }
  }
  let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
  afterEventEdit.call(this, props, this.formId, "pk_org", pk_org, true);
}
/**
 * 复制
 * @param {*} props  页面内置对象
 */
export function copy(props, status, pk) {
  props.setUrlParam({ status });
  buttonVisible.call(this, props);
  props.cardTable.toggleTabTable(this.tabCode);
  getCopyCardData.call(this, pk, false, false);
  orgVersionView(this.props, this.formId); //组织版本视图
  // if (status === "copy") {
  //   resolveThreeType.call(this, props, props.form.getAllFormValue(this.formId));
  // }
}
/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
  let id = props.getUrlParam("id");
  props.setUrlParam({ status: "browse" });
  if (id) {
    getCardData.call(this, id, false, true);
  } else {
    clearAll.call(
      this,
      props,
      () => initMethod.call(this, props),
      tabs.tabShow
    );
  }
}

/**
 * 保存
 * @param {*} props  页面内置对象
 * @param {*} type   save保存、add保存新增、commit保存提交
 */
function saveBill(props, type) {
  let creditortype = props.form.getFormItemsValue(this.formId, "creditortype")
    .value;
  let debtortype = props.form.getFormItemsValue(this.formId, "debtortype")
    .value;
  let guatype = props.form.getFormItemsValue(this.formId, "guatype").value;
  let iscontrary = props.form.getFormItemsValue(this.formId, "iscontrary")
    .value;
  if (this.guarantor === this.debtor && iscontrary) {
    toast({
      color: "warning",
      content: this.state.json["36620GC-000041"],
    }); /* 国际化处理： 债务人单位和担保人单位相同时, 不需要反担保!*/
    return;
  }
  if (compareDebtorAndCreditor.call(this)) {
    return;
  }
  if (creditortype === "4" && debtortype === "2") {
    toast({
      color: "warning",
      content: this.state.json["36620GC-000024"],
    }); /* 国际化处理： 债权人类型和债务人类型不能同时选择本单位!*/
    return;
  }
  let meta = props.meta.getMeta();
  let tabRelation = deepClone(meta.gridrelation[this.tabCode].tabRelation);

  let warrantyinfo = props.cardTable.getTabVisibleRows("warrantyinfo"); //保证信息数据
  let guarantyinfo = props.cardTable.getTabVisibleRows("guarantyinfo"); //抵押信息数据
  let pledgeinfo = props.cardTable.getTabVisibleRows("pledgeinfo"); //质押信息数据
  if (guatype === "4") {
    //担保方式为混合时，三个页签至少有一个不为空即可
    if (!warrantyinfo.length && !guarantyinfo.length && !pledgeinfo.length) {
      toast({
        color: "warning",
        content: this.state.json["36620GC-000042"],
      }); /* 国际化处理： 担保方式为混合时, 保证信息、抵押信息和质押信息不能同时为空!*/
      return;
    }
    if (tabRelation.indexOf("warrantyinfo") > -1 && !warrantyinfo.length) {
      tabRelation.splice(tabRelation.indexOf("warrantyinfo"), 1);
    }
    if (tabRelation.indexOf("guarantyinfo") > -1 && !guarantyinfo.length) {
      tabRelation.splice(tabRelation.indexOf("guarantyinfo"), 1);
    }
    if (tabRelation.indexOf("pledgeinfo") > -1 && !pledgeinfo.length) {
      tabRelation.splice(tabRelation.indexOf("pledgeinfo"), 1);
    }
  }
  if (!warrantyinfo.length) {
    // 如果保证信息页签数据为空 清空保证总金额 保证本币总金额
    props.form.setFormItemsValue(this.formId, {
      warocamount: { value: null, display: null }, // 保证总金额
      warlcamount: { value: null, display: null }, // 保证本币总金额
    });
  } else if (!guarantyinfo.length) {
    // 如果抵押信息页签数据为空 清空抵押总金额 抵押本币总金额
    props.form.setFormItemsValue(this.formId, {
      moramount: { value: null, display: null }, // 抵押总金额
      morlcamount: { value: null, display: null }, // 抵押本币总金额
    });
  } else if (!pledgeinfo.length) {
    // 如果质押信息页签数据为空 清空质押总金额 质押本币总金额
    props.form.setFormItemsValue(this.formId, {
      pleamount: { value: null, display: null }, // 质押总金额
      plelcamount: { value: null, display: null }, // 质押本币总金额
    });
  }
  let flafTab = props.cardTable.checkTabRequired(tabRelation); //tab是否校验通过，必输项等
  let flagForm = props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
  if (!flagForm || !flafTab) {
    return;
  }
  let data = props.createTabsCardData(this.pageId, this.formId, this.tabOrder);
  if (
    tabRelation.includes(this.tabCode) &&
    data.bodys[this.tabCode] &&
    data.bodys[this.tabCode].rows.length
  ) {
    let all = 0;
    for (let item of data.bodys[this.tabCode].rows) {
      if (item.status !== "3") {
        all += Number(item.values.warratio.value) || 0;
      }
      let warrantortype = item.values.warrantortype.value; //保证人类型
      let warrantorin = item.values.warrantorin.value; //担保人内部单位
      let warrantorou = item.values.warrantorou.value; //担保人合作伙伴
      let warrantorfin = item.values.warrantorfin.value; //保证人金融机构
      if (
        !(
          (warrantortype === "1" && warrantorou) ||
          (warrantortype === "3" && warrantorfin) ||
          (warrantortype === "2" && warrantorin)
        )
      ) {
        toast({
          color: "warning",
          content: this.state.json["36620GC-000043"],
        }); /* 国际化处理： 表_保证信息中, 保证人类型为合作伙伴时保证人合作伙伴不能为空, 保证人类型为内部单位时保证人内部单位不能为空, 保证人类型为金融机构时保证人金融机构不能为空!*/
        return;
      }
    }
  }
  // 担保总金额
  let guaamount = this.props.form.getFormItemsValue(this.formId, "guaamount");
  guaamount = Number(guaamount && guaamount.value);
  guaamount = isNaN(guaamount) ? 0 : guaamount;
  // 保证金额总和
  let warrantyinfoSum = 0;
  warrantyinfo.map((item) => {
    // 保证金额
    let { waramount } = item.values;
    waramount = Number(waramount && waramount.value);
    waramount = isNaN(waramount) ? 0 : waramount;
    warrantyinfoSum += waramount;
  });
  // 抵押金额总和
  let guarantyinfoSum = 0;
  guarantyinfo.map((item) => {
    // 本地抵押价值
    let { usinglcamount } = item.values;
    usinglcamount = Number(usinglcamount && usinglcamount.value);
    usinglcamount = isNaN(usinglcamount) ? 0 : usinglcamount;
    guarantyinfoSum += usinglcamount;
  });

  // 质押金额总和
  let pledgeinfoSum = 0;
  pledgeinfo.map((item) => {
    // 本地质押价值
    let { usinglcamount } = item.values;
    usinglcamount = Number(usinglcamount && usinglcamount.value);
    usinglcamount = isNaN(usinglcamount) ? 0 : usinglcamount;
    pledgeinfoSum += usinglcamount;
  });

  if (guaamount > warrantyinfoSum + guarantyinfoSum + pledgeinfoSum) {
    let content = "";
    if (guatype === "1" && guaamount > warrantyinfoSum) {
      // 如果担保方式为保证 保证金额总和小于担保总金额
      content = this.state.json[
        "36620GC-000095"
      ]; /* 国际化处理： 保证总金额小于担保总金额，是否要继续操作？*/
    } else if (guatype === "2" && guaamount > guarantyinfoSum) {
      // 如果担保方式为抵押 抵押金额总和小于担保总金额
      content = this.state.json[
        "36620GC-000097"
      ]; /* 国际化处理： 抵押总金额小于担保总金额，是否要继续操作？*/
    } else if (guatype === "3" && guaamount > pledgeinfoSum) {
      // 如果担保方式质押证 质押金额总和小于担保总金额
      content = this.state.json[
        "36620GC-000099"
      ]; /* 国际化处理： 质押总金额小于担保总金额，是否要继续操作？*/
    } else if (guatype === "4") {
      // 如果担保方式为混合 保证+抵押+质押总金额总和小于担保总金额
      content = this.state.json[
        "36620GC-000101"
      ]; /* 国际化处理： 保证金额、抵押金额、质押金额之和小于担保总金额，是否要继续操作？*/
    }
    promptBox({
      color: "warning",
      content,
      beSureBtnClick: () => {
        props.validateToSave(
          data,
          () => saveOperation.call(this, props, data, type),
          tabs.tableTypeObj,
          ""
        );
      },
    });
    return;
  }
  props.validateToSave(
    data,
    () => saveOperation.call(this, props, data, type),
    tabs.tableTypeObj,
    ""
  );
}

export function saveOperation(props, data, type) {
  let isAdd = props.getUrlParam("status") === "add";
  ajax({
    url: `${baseReqUrl}${javaUrl.save}.do`,
    data,
    success: (res) => {
      if (res.success) {
        if (res.data) {
          let id =
            res.data.head[this.formId].rows[0].values[this.primaryId].value;
          let ts = res.data.head[this.formId].rows[0].values.ts.value;
          this.idTs = { id, ts };
          toast({
            color: "success",
            content: this.state.json["36620GC-000046"],
          }); /* 国际化处理： 保存成功*/
          // 缓存
          if (isAdd) {
            addCache(id, res.data, this.formId, this.dataSource);
            // addCache(id, res.data, this.formId, this.cache);
          } else {
            updateCache(
              this.primaryId,
              id,
              res.data,
              this.formId,
              this.dataSource
            );
            // updateCache(this.primaryId, id, res.data, this.formId, this.cache);
          }
          if (props.getUrlParam("status") === "change") {
            props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
          }
          if (type === "add") {
            props.setUrlParam({
              id,
              status: "add",
            });
            add.call(this, props);
          } else {
            props.setUrlParam({
              id,
              status: "browse",
            });
            props.form.setAllFormValue({
              [this.formId]: res.data.head[this.formId],
            });
            let resolut = resolveTabKey.call(this, res.data);
            props.cardTable.setAllTabsData(
              resolut.data.bodys,
              this.tabOrder,
              afterSetData.bind(this, props, resolut.keys),
              resolut.keys
            );
            if (type === "commit") {
              this.btnOperation(
                javaUrl.commit,
                this.state.json["36620GC-000002"],
                res.data.head[this.formId].rows[0].values[this.primaryId].value
              ); /* 国际化处理： 提交成功!*/
            } else {
              buttonVisible.call(this, props);
            }
          }
          props.cardTable.closeModel(this.tabCode);
        }
        orgVersionView(this.props, this.formId); //组织版本视图
      }
    },
  });
}

/**
 * 清空所有的数据
 * @param {*} props     页面内置对象
 * @param {*} callback  回调函数
 */
export function clearAll(props, callback, tabShow = []) {
  props.form.EmptyAllFormValue(this.formId);
  props.cardTable.setAllTabsData(null, this.tabOrder, null, tabShow);
  buttonVisible.call(this, props);
  orgVersionView(this.props, this.formId); //组织版本视图
  callback && callback();
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 */
export function setEditStatus(status) {
  this.props.form.setFormStatus(this.formId, status);
  this.props.cardTable.setStatus(this.tabCode, status);
}

/**
 * 附件管理
 */
function fileMgr() {
  let billNo = this.props.form.getFormItemsValue(this.formId, "vbillno").value;
  let billId = this.props.form.getFormItemsValue(this.formId, this.primaryId)
    .value;
  this.showUploader = !this.showUploader;
  this.billInfo = { billId, billNo };
  this.forceUpdate();
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/