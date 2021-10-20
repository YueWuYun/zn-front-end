/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
import moment from "moment";
import { ajax, promptBox, toast } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant";
import { getCardData, initMethod } from "./page";
import {
  clearTabKeyData,
  compareDebtorAndCreditor,
  compareDebtorAndGuarantor,
  creditortype,
  debtortype,
  guarantortype,
  guatypeChangeResolve,
  resolveThreeType,
  warrantyinfoCellEdit
} from "./resolve";

/**
 * form编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 * @param {*} oldvalue  旧值/新旧值集合
 */
export function afterEvent(props, moduleId, key, value, oldvalue) {
  console.log(key, value, oldvalue, "key, value, oldvalue");
  switch (key) {
    case "pk_org": //财务组织
      //原本组织为空，则不弹框
      if (!oldvalue || !oldvalue.value) {
        //处理组织编辑后事件
        afterEventEdit.call(this, props, moduleId, key, value);
      } else {
        promptBox({
          color: "warning",
          title: this.state.json[
            "36620GC-000047"
          ] /* 国际化处理： 修改财务组织*/,
          content: this.state.json[
            "36620GC-000048"
          ] /* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/,
          beSureBtnClick: afterEventEdit.bind(
            this,
            props,
            moduleId,
            key,
            value
          ),
          cancelBtnClick: () =>
            props.form.setFormItemsValue(moduleId, {
              pk_org: oldvalue,
              pk_org_v: oldvalue
            })
        });
      }
      break;
    case "guastartdate": // 开始日期
    case "pk_currtype": //币种
      afterEventEdit.call(this, props, moduleId, key, value);
      break;
    case "contracttype": //合同类型
      resolveContracttype.call(this, props, value.value);
      break;
    case "guatype": //担保方式
      resolveGuatype.call(this, props, value.value);
      break;
    case "groupguaartee": //集团担保
      // 	props.cardTable.tabKeyShowSwitch({
      // 		detailinfo: {
      // 			show: value.value,
      // 			isClear: !value.value,
      // 			isCur: value.value
      // 		},
      // 	}, props.getUrlParam('status')=== 'add');
      break;
    case "creditortype": //债权人类型
      creditortype.call(this, props, value);
      break;
    case "fincreditor": //债权人金融机构
    case "partcreditor": //债权人外部单位
    case "increditor": //债权人内部单位
    case "owercreditor": //债权人本单位
      props.form.setFormItemsValue(moduleId, {
        creditor: { value: value.display, display: value.display } //债权人
      });
      compareDebtorAndCreditor.call(this);
      break;
    case "debtortype": //债务人类型
      debtortype.call(this, props, value);
      clearTabKeyData.call(this);
      break;
    case "partdebtor": //债务人外部单位
    case "owerdebtor": //债务人本单位
    case "indebtor": //债务人内部单位
      props.form.setFormItemsValue(moduleId, {
        debtor: { value: value.display, display: value.display } //债务人
      });
      // this.debtor = value.value;
      compareDebtorAndGuarantor.call(this);
      compareDebtorAndCreditor.call(this);
      clearTabKeyData.call(this);
      break;
    case "guarantortype": //担保人类型
      guarantortype.call(this, props, value);
      break;
    case "partguarantor": //担保人外部单位
    case "owerguarantor": //担保人本单位
    case "inguarantor": //担保人内部单位
    case "finguarantor": //担保人金融机构
      props.form.setFormItemsValue(moduleId, {
        guarantor: { value: value.display, display: value.display } //担保人
      });
      // this.guarantor = value.value;
      compareDebtorAndGuarantor.call(this);
      break;
    case "guaamount": //担保总金额
      resolveGuaamount.call(this, props, value, key, oldvalue, moduleId);
      break;
    case "guastartdate": //担保开始日期
      resolveDate.call(this, props, value.value, key, "guaenddate", -1);
      break;
    case "guaenddate": //担保结束日期
      resolveDate.call(this, props, value.value, key, "guastartdate", 1);
      break;
    case "startdate": //债务起始日期
      resolveDate.call(this, props, value.value, key, "enddate", -1);
      break;
    case "enddate": //债务终止日期
      resolveDate.call(this, props, value.value, key, "startdate", 1);
      break;
    case "olcrate": //组织本币汇率
    case "glcrate": //集团本币汇率
    case "gllcrate": //全局本币汇率汇率
      // resolveOlcrate.call(this, props, value.value || 0);
      afterEventEdit.call(this, props, moduleId, key, value); //处理组织本币汇率编辑后事件
      break;
    case "warocamount": //保证总金额
      resolveWarocamount.call(this, props, moduleId, key, value);
      break;
    default:
      break;
  }
}

/**
 * 组织本币汇率的编辑后事件
 * @param {*} props     	页面内置对象
 * @param {*} value  		value
 */
function resolveOlcrate(props, value) {
  let guaamount = props.form.getFormItemsValue(this.formId, "guaamount").value; //担保总金额
  let warocamount = props.form.getFormItemsValue(this.formId, "warocamount")
    .value; //保证原币总金额
  let moramount = props.form.getFormItemsValue(this.formId, "moramount").value; //抵押总金额
  let pleamount = props.form.getFormItemsValue(this.formId, "pleamount").value; //质押总金额
  let empty = { display: null, value: null };
  props.form.setFormItemsValue(this.formId, {
    gualcamount: guaamount
      ? { display: guaamount * value, value: guaamount * value }
      : empty, //担保本币总金额
    warlcamount: warocamount
      ? { display: warocamount * value, value: warocamount * value }
      : empty, //保证本币总金额
    plelcamount: pleamount
      ? { display: pleamount * value, value: pleamount * value }
      : empty, //质押本币总金额
    morlcamount: moramount
      ? { display: moramount * value, value: moramount * value }
      : empty //抵押本币总金额
  });
}

/**
 * 保证总金额的编辑后事件
 * @param {*} props     	页面内置对象
 * @param {*} value  		value
 */
function resolveWarocamount(props, moduleId, key, value) {
  let val = value.value || 0;
  if (+val < 0) {
    toast({
      content: this.state.json["36620GC-000049"],
      color: "warning"
    }); /* 国际化处理： 保证总金额不能为负数!*/
    props.form.setFormItemsValue(this.formId, {
      [key]: { value: null, display: null } // 为负数则重置保证总金额
    });
    return;
  }
  afterEventEdit.call(this, props, moduleId, key, value); //处理组织编辑后事件
  return;
}

/**
 * 日期的编辑后事件
 * @param {*} props     	页面内置对象
 * @param {*} moduleId  	value
 * @param {*} key       	操作的键
 * @param {*} compareKey    需要对比的键
 * @param {*} symbol     	符号
 */
function resolveDate(props, value, key, compareKey, symbol) {
  let compareVal = props.form.getFormItemsValue(this.formId, compareKey).value;
  let msgObj = {
    guastartdate: this.state.json[
      "36620GC-000050"
    ] /* 国际化处理： 开始日期不能大于结束日期*/,
    guaenddate: this.state.json[
      "36620GC-000051"
    ] /* 国际化处理： 结束日期不能小于开始日期*/,
    startdate: this.state.json[
      "36620GC-000052"
    ] /* 国际化处理： 起始日期不能大于终止日期*/,
    enddate: this.state.json[
      "36620GC-000053"
    ] /* 国际化处理： 终止日期不能小于起始日期*/
  };
  if (!value || !compareVal) {
    return;
  }
  value = value.substr(0, 10);
  compareVal = compareVal.substr(0, 10);
  if (symbol * (moment(value).valueOf() - moment(compareVal).valueOf()) < 0) {
    toast({ color: "warning", content: msgObj[key] });
    props.form.setFormItemsValue(this.formId, {
      [key]: { display: null, value: null }
    });
  }
}

/**
 * 财务组织和币种的编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 */
export function afterEventEdit(props, moduleId, key, value, async = false) {
  // 编辑后事件
  if (value.value) {
    if (key === "pk_org" && !async) {
      let status = props.getUrlParam("status");
      if (status === "add") {
        props.button.setButtonDisabled("addRow", false);
        props.form.EmptyAllFormValue(this.formId);
        props.cardTable.setAllTabsData(null, this.tabOrder);
        props.form.setFormItemsValue(this.formId, {
          //合同类型/* 国际化处理： 担保合同*/
          contracttype: {
            display: this.state.json["36620GC-000003"],
            value: "1"
          },
          //是否需要反担保/* 国际化处理： 是*/
          iscontrary: {
            display: this.state.json["36620GC-000022"],
            value: true
          },
          //担保方式/* 国际化处理： 混合*/
          guatype: {
            display: this.state.json["36620GC-000023"],
            value: "4"
          },
          // creditortype: {display: "本单位", value: "4"},       //债权人类型
          creditor: { display: value.display, value: value.display }, //债权人
          olcrate: { display: "", value: "1.00" }, //组织本币汇率
          pk_org: value,
          pk_org_v: value
        });
        props.form.setFormItemsDisabled(this.formId, {
          iscontrary: false
        });
        // 担保方式 设置为 混合 时 会执行 子表页签显示控制方法
        resolveGuatype.call(this, props, "4");
      } else {
        getCardData.call(this, props);
      }
    }
    let data = props.createTabsAfterEventData(
      this.pageId,
      this.formId,
      this.tabOrder,
      moduleId,
      key,
      value
    );
    // 解决首次财务组织编辑后事件传值问题
    data.oldvalue = {
      display: null,
      value: null
    };
    data.areacode = "header";
    ajax({
      url: `${baseReqUrl}${javaUrl.afterEvent}.do`,
      data,
      async,
      success: res => {
        if (res.success) {
          if (async) {
            this.pk_currtype =
              res.data &&
              res.data.head &&
              res.data.head[this.formId].rows[0].values.pk_currtype.value;
          } else {
            if (key === "pk_org") {
              props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
              resolveThreeType.call(
                this,
                props,
                res.data.head && res.data.head[this.formId]
              );
              let debtortype =
                res.data &&
                res.data.head &&
                res.data.head[this.formId].rows[0].values.debtortype.value;
              this.pk_currtype =
                res.data &&
                res.data.head &&
                res.data.head[this.formId].rows[0].values.pk_currtype.value;
              if (debtortype === "2") {
                let pk_org = res.data.head[this.formId].rows[0].values.pk_org;
                res.data.head[this.formId].rows[0].values.debtor = {
                  display: pk_org.display,
                  value: pk_org.display
                };
              }
            }
            props.form.setAllFormValue({
              [this.formId]:
                res.data && res.data.head && res.data.head[this.formId]
            });
            props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
            if (props.cardTable.getCurTabKey() === "warrantyinfo") {
              warrantyinfoCellEdit.call(this);
            }
          }
        }
      },
      error: res => {
        toast({ color: "warning", content: res.message });
        if (key === "pk_org") {
          props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
        }
      }
    });
  } else if (key === "pk_org") {
    //清空财务组织时需要清空所有值
    props.initMetaByPkorg();
    props.form.EmptyAllFormValue(this.formId);
    props.cardTable.setAllTabsData(null, this.tabOrder);
    props.button.setButtonDisabled(["addRow", "deleteRow", "copyRow"], true);
    initMethod.call(this, props);
    this.pk_currtype = null;
  }
}

/*
 *是否需要反担保
 * @param {*} props     页面内置对象
 * @param {*} val       值
 */

export function resolveIscontrary(props, val) {
  let meta = props.meta.getMeta();
  meta.contractinfo.name = val
    ? this.state.json["36620GC-000054"]
    : this.state.json["36620GC-000055"]; /* 国际化处理： 反担保信息,担保信息*/
  for (let item of meta.contractinfo.items) {
    if (item.attrcode === "contractno") {
      item.label = val
        ? this.state.json["36620GC-000056"]
        : this.state.json[
            "36620GC-000057"
          ]; /* 国际化处理： 反担保合同号,合同号*/
    } else if (item.attrcode === "guaamount") {
      item.label = val
        ? this.state.json["36620GC-000058"]
        : this.state.json[
            "36620GC-000005"
          ]; /* 国际化处理： 反担保金额,担保金额*/
    }
  }
  props.meta.setMeta(meta);
}

/*
 *是否需要反担保
 * @param {*} props     合同类型
 * @param {*} val       值
 */

function resolveContracttype(props, val) {
  let obj = {
    contractinfo: {
      isClear: true
    }
  };
  if (val === "2") {
    obj = {
      contractinfo: {
        show: true,
        isCur: true
      }
    };
    resolveIscontrary.call(this, props, false);
  }
  props.cardTable.tabKeyShowSwitch(obj, props.getUrlParam("status") === "add");
  props.form.setFormItemsValue(this.formId, {
    iscontrary: {
      display: this.state.json["36620GC-000025"],
      value: false
    } /* 国际化处理： 否*/
  });
  props.form.setFormItemsDisabled(this.formId, {
    iscontrary: val === "2"
  });
}

/*
 * 担保方式
 * @param {*} props     合同类型
 * @param {*} val       值
 */

function resolveGuatype(props, val) {
  let obj = null;
  switch (val) {
    case "1":
      obj = {
        warrantyinfo: {
          show: true,
          isCur: true
        },
        guarantyinfo: {
          isClear: true
        },
        pledgeinfo: {
          isClear: true
        }
      };
      break;
    case "2":
      obj = {
        warrantyinfo: {
          isClear: true
        },
        guarantyinfo: {
          show: true,
          isCur: true
        },
        pledgeinfo: {
          isClear: true
        }
      };
      break;
    case "3":
      obj = {
        warrantyinfo: {
          isClear: true
        },
        guarantyinfo: {
          isClear: true
        },
        pledgeinfo: {
          show: true,
          isCur: true
        }
      };
      break;
    case "4":
      obj = {
        warrantyinfo: {
          show: true,
          isCur: true
        },
        guarantyinfo: {
          show: true
        },
        pledgeinfo: {
          show: true
        }
      };
      break;
  }
  // 担保方式变更规则
  guatypeChangeResolve.call(this, val);
  props.cardTable.tabKeyShowSwitch(
    obj,
    props.getUrlParam("status") === "add" ||
      props.getUrlParam("status") === "copy"
  );
}

/**
 * 担保总金额编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} value     当前值
 * @param {*} key       key
 */
export function resolveGuaamount(props, value, key, oldvalue = {}, moduleId) {
  let val = Number(value.value) || 0;
  if (props.getUrlParam("status") === "change") {
    let usedamount =
      props.form.getFormItemsValue(this.formId, "usedamount").value || 0; //已用担保总金额
    if (+val < +usedamount) {
      toast({
        color: "warning",
        content: this.state.json["36620GC-000060"]
      }); /* 国际化处理： 变更时, 担保总金额不能小于已用担保总金额!*/
      props.form.setFormItemsValue(this.formId, {
        [key]: oldvalue // 担保总金额
      });
      return;
    }
  }
  if (val < 0) {
    toast({
      content: this.state.json["36620GC-000061"],
      color: "warning"
    }); /* 国际化处理： 担保总金额不能为负数!*/
    props.form.setFormItemsValue(this.formId, {
      [key]: { value: null, display: null } // 为负数则重置担保总金额
    });
    return;
  }
  afterEventEdit.call(this, props, moduleId, key, value); //处理组织编辑后事件
  return;
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/