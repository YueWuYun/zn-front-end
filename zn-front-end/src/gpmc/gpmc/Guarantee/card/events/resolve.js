/*JX2Onshpv32dm+kh00wwT/0EOUao5Y/Y/p0GlmZVfUDWretWncgtp/MXDOHIoU6O*/
import { toast } from "nc-lightapp-front";

/**
 * 债权人类型编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} value     当前值
 * @param {*} flag      标记
 */
export function creditortype(props, value, flag = false) {
  // let aa1= [
  //     {display: "金融机构", value: "1"},
  //     {display: "外部单位", value: "2"},
  //     {display: "内部单位", value: "3"},
  //     {display: "本单位", value: "4"}
  // ];
  let val = value.value;
  let valObj = { display: null, value: null };
  let debtortype = props.form.getFormItemsValue(this.formId, "debtortype")
    .value;
  if (val === "4" && debtortype === "2") {
    toast({
      color: "warning",
      content: this.state.json["36620GC-000024"]
    }); /* 国际化处理： 债权人类型和债务人类型不能同时选择本单位!*/
  }
  // if (debtortype === "2") {
  //     this.debtor = props.form.getFormItemsValue(this.formId, "pk_org");
  //     compareDebtorAndGuarantor.call(this);
  // }
  let disabledObj = {
    fincreditor: val !== "1", //债权人金融机构
    partcreditor: val !== "2", //债权人外部单位
    increditor: val !== "3", //债权人内部单位
    owercreditor: true //债权人本单位
  };
  if (!flag) {
    let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
    props.form.setFormItemsDisabled(this.formId, disabledObj);
    props.form.setFormItemsValue(this.formId, {
      fincreditor: valObj, //债权人金融机构
      partcreditor: valObj, //债权人外部单位
      increditor: valObj, //债权人内部单位
      owercreditor: val === "4" ? pk_org : valObj, //债权人本单位
      creditor:
        val === "4"
          ? { display: pk_org.display, value: pk_org.display }
          : valObj //债权人
    });
    resolveRequiredMeta.call(
      this,
      props,
      this.formId,
      Object.assign({}, disabledObj, { owercreditor: val !== "4" })
    );
  }
  return disabledObj;
}

/**
 * 债务人类型编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} value     当前值
 * @param {*} flag      标记
 */
export function debtortype(props, value, flag = false) {
  // let aa2= [
  //     {display: "外部单位", value: "1"},
  //     {display: "本单位", value: "2"},
  //     {display: "内部单位", value: "3"},
  // ];
  let val = value.value;
  let valObj = { display: null, value: null };
  let creditortype = props.form.getFormItemsValue(this.formId, "creditortype")
    .value;
  if (val === "2" && creditortype === "4") {
    toast({
      color: "warning",
      content: this.state.json["36620GC-000024"]
    }); /* 国际化处理： 债权人类型和债务人类型不能同时选择本单位!*/
  }

  let disabledObj = {
    partdebtor: val !== "1", //债务人外部单位
    owerdebtor: true, //债务人本单位
    indebtor: val !== "3" //债务人内部单位
  };
  if (!flag) {
    let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
    props.form.setFormItemsDisabled(this.formId, disabledObj);
    props.form.setFormItemsValue(this.formId, {
      partdebtor: valObj, //债务人外部单位
      owerdebtor: val === "2" ? pk_org : valObj, //债务人本单位
      indebtor: valObj, //债务人内部单位
      debtor:
        val === "2"
          ? { display: pk_org.display, value: pk_org.display }
          : valObj //债务人
    });
    if (val === "2") {
      // this.debtor = pk_org.value;
      compareDebtorAndGuarantor.call(this);
    }
    //比划担保人单位和债务人单位是否相同，以此达到取消是否需要反担保字段的选中
    resolveRequiredMeta.call(
      this,
      props,
      this.formId,
      Object.assign({}, disabledObj, { owerdebtor: val !== "2" })
    );
  }
  return disabledObj;
}

/**
 * 担保人类型编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} value     当前值
 * @param {*} flag      标记
 */
export function guarantortype(props, value, flag = false) {
  // let aa3= [
  //     {display: "外部单位", value: "1"},
  //     {display: "本单位", value: "2"},
  //     {display: "内部单位", value: "3"},
  //     {display: "金融机构", value: "4"}
  // ];
  let val = value.value;
  let valObj = { display: null, value: null };
  let disabledObj = {
    partguarantor: val !== "1", //担保人外部单位
    owerguarantor: true, //担保人本单位
    inguarantor: val !== "3", //担保人内部单位
    finguarantor: val !== "4" //担保人金融机构
  };
  if (!flag) {
    let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
    props.form.setFormItemsDisabled(this.formId, disabledObj);
    props.form.setFormItemsValue(this.formId, {
      partguarantor: valObj, //担保人外部单位
      owerguarantor: val !== "2" ? valObj : pk_org, //担保人本单位
      inguarantor: valObj, //担保人内部单位
      finguarantor: valObj, //担保人金融机构
      guarantor:
        val !== "2"
          ? valObj
          : { display: pk_org.display, value: pk_org.display } //担保人
    });
    //比划担保人单位和债务人单位是否相同，以此达到取消是否需要反担保字段的选中
    if (val === "2") {
      // this.guarantor = pk_org.value;
      compareDebtorAndGuarantor.call(this);
    }
    resolveRequiredMeta.call(
      this,
      props,
      this.formId,
      Object.assign({}, disabledObj, { owerguarantor: val !== "2" })
    );
  }
  return disabledObj;
}

/**
 * 债权人/债务人/担保人类型统一处理
 * @param {*} props     页面内置对象
 * @param {*} code      区域
 * @param {*} obj       字段集合
 */
export function resolveRequiredMeta(props, code, obj) {
  let arrKeys = Object.keys(obj);
  let meta = props.meta.getMeta();
  for (let item of meta[code].items) {
    if (arrKeys.includes(item.attrcode)) {
      item.required = !obj[item.attrcode];
    }
  }
  props.meta.setMeta(meta);
}

/**
 * 债权人/债务人/担保人类型统一处理
 * @param {*} props     页面内置对象
 * @param {*} data      当前值集合
 */
export function resolveThreeType(props, data) {
  let values = data.rows[0].values;
  let creditor = creditortype.call(this, props, values.creditortype, true);
  let debtor = debtortype.call(this, props, values.debtortype, true);
  let guarantor = guarantortype.call(this, props, values.guarantortype, true);
  props.form.setFormItemsDisabled(
    this.formId,
    Object.assign({}, creditor, debtor, guarantor)
  );
  resolveRequiredMeta.call(
    this,
    props,
    this.formId,
    Object.assign({}, creditor, debtor, guarantor, {
      owercreditor: values.creditortype !== "4",
      owerdebtor: values.debtortype !== "2",
      owerguarantor: values.guarantortype !== "2"
    })
  );
}

/**
 * 保证信息子表编辑性控制 warrantyinfo
 */
export function warrantyinfoCellEdit() {
  let rowData = this.props.cardTable.getVisibleRows("warrantyinfo");
  if (rowData.length > 0) {
    rowData.forEach((item, index) => {
      let warrantortype =
        item.values.warrantortype && item.values.warrantortype.value;
      if (warrantortype) {
        let editObj = {
          warrantorin: warrantortype === "2", // 内部单位
          warrantorfin: warrantortype === "3", // 金融机构
          warrantorou: warrantortype === "1" // 外部单位
        };
        this.props.cardTable.setEditabByIndex(this.tabCode, index, editObj);
      }
    });
  }
}

/**
 * 设置主表 是否需要反担保 编辑性
 */
export function iscontraryDisabled() {
  // 合同类型
  let contracttype = this.props.form.getFormItemsValue(
    this.formId,
    "contracttype"
  );
  contracttype = contracttype && contracttype.value;
  this.props.form.setFormItemsDisabled(this.formId, {
    iscontrary: contracttype === "2" // 是否为反担保合同
  });
}

/**
 * 担保人单位和债务人单位相同则取消是否需要反担保字段的选中
 */
export function compareDebtorAndGuarantor() {
  this.debtor = this.props.form.getFormItemsValue(this.formId, "debtor").value;
  this.guarantor = this.props.form.getFormItemsValue(
    this.formId,
    "guarantor"
  ).value;
  // 担保人单位和债务人单位相同则取消是否需要反担保字段的选中
  if (this.guarantor === this.debtor) {
    this.props.form.setFormItemsValue(this.formId, {
      iscontrary: {
        display: this.state.json["36620GC-000025"],
        value: false
      } //是否需要反担保/* 国际化处理： 否*/
    });
    this.props.form.setFormItemsDisabled(this.formId, { iscontrary: true });
  } else {
    this.props.form.setFormItemsDisabled(this.formId, {
      iscontrary: false
    });
  }
}
/**
 * 债务人单位与债权人相同则提示文案
 */
export function compareDebtorAndCreditor() {
  this.creditor = this.props.form.getFormItemsValue(
    this.formId,
    "creditor"
  ).value;
  this.debtor = this.props.form.getFormItemsValue(this.formId, "debtor").value;
  if (
    this.creditor !== null &&
    this.debtor !== null &&
    this.creditor == this.debtor
  ) {
    toast({
      color: "warning",
      content: this.state.json["36620GC-000081"]
    }); /* 国际化处理： 债权人和债务人不能为同一单位!*/
    return true;
  } else {
    return false;
  }
}

/**
 * 主表债务人变化时，要清空担保信息页签数据
 */
export function clearTabKeyData() {
  let meta = this.props.meta.getMeta();
  let tabRelation = meta.gridrelation[this.tabCode].tabRelation;
  let { delTabData } = this.props.cardTable;
  if (tabRelation.includes("guarantyinfo")) {
    //当前有担保信息页签则清空数据
    delTabData && delTabData("guarantyinfo");
  }
  if (tabRelation.includes("pledgeinfo")) {
    //当前有担保信息页签则清空数据
    delTabData && delTabData("pledgeinfo");
  }
  if (tabRelation.includes("contractinfo")) {
    //当前有担保信息页签则清空数据
    delTabData && delTabData("contractinfo");
  }
}
// 担保方式变更规则
export function guatypeChangeResolve(key) {
  let valObj = { display: null, value: null };
  let keysObj = {
    // 保证一系列字段
    // 保证总金额
    warocamount: valObj,
    // 保证本币总金额
    warlcamount: valObj,
    // 保证集团本币总金额
    wargroamount: valObj,
    // 保证全局本币总金额
    wargloamount: valObj,
    // 抵押一系列字段
    // 抵押总金额
    moramount: valObj,
    // 抵押本币总金额
    morlcamount: valObj,
    // 抵押集团本币总金额
    gromoramount: valObj,
    // 抵押全局本币总金额
    glomoramount: valObj,
    // 质押一系列字段
    // 质押总金额
    pleamount: valObj,
    // 质押本币总金额
    plelcamount: valObj,
    // 质押集团本币总金额
    gropleamount: valObj,
    // 质押全局本币总金额
    glopleamount: valObj
  };
  if (key - 0 !== 4) {
    this.props.form.setFormItemsValue(this.formId, keysObj);
  }
}

/*JX2Onshpv32dm+kh00wwT/0EOUao5Y/Y/p0GlmZVfUDWretWncgtp/MXDOHIoU6O*/