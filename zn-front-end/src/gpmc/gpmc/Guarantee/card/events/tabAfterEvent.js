/*lKiRROu+lXJrYDtJ7C6J0vFJgHRjlzkVixNR7TYMD8kdBxIoPOYWgFVH5BWKIbsV*/
import { ajax, toast } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant";
import { resolveTabsChange } from "./page";
import { warrantyinfoCellEdit } from "./resolve";

/**
 * tab-table编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 * @param {*} oldvalue  旧值/新旧值集合
 * @param {*} index     当前index
 * @param {*} record    行数据
 * @param {*} type      表格内为line，弹窗为modal
 * @param {*} method    有blur有change
 */
export function tabAfterEvent(
  props,
  moduleId,
  key,
  value,
  oldvalue,
  index,
  record,
  type,
  method
) {
  let values = value && value.values;
  switch (key) {
    case "warrantortype": //保证信息页签 => 保证人类型
      warrantortype.call(this, props, value, index);
      break;
    case "warratio": //保证信息页签 => 保证比例
      setWaramount.call(
        this,
        props,
        moduleId,
        key,
        value,
        props.form.getFormItemsValue(this.formId, "guaamount").value,
        index
      );
      break;
    case "waramount": //保证信息页签 => 保证比例
      tabAfterEventEdit.call(this, props, moduleId, key, value);
      break;
    case "pledgeno": //抵押/质押信息页签 => 物权编号
      resolvePledgeno.call(
        this,
        props,
        values,
        index,
        moduleId,
        usinglcamountSum(props)
      );
      break;
    case "usinglcamount": //抵押/质押信息页签 => 本次抵押/质押价值
      // usinglcamount.call(this, props, value, record.values.usingamount.value, record.values.totalpledge.value, index);
      // 将表格中 本次抵押/质押价值 字段的总和传给后台进行运算
      tabAfterEventEdit.call(
        this,
        props,
        moduleId,
        usinglcamountKey(props),
        usinglcamountSum(props)
      );
      break;
    case "contractno": //反/担保信息页签 => 合同号
      contractno.call(this, props, values, index, value);
      break;
    case "warrantorfin": //保证人金融机构
    case "guaamount": //反/担保信息、集团担保明细页签 => 担保金额
    case "gualcamount": //集团担保明细页签 => 担保金额组织本币
    case "usedamount": //集团担保明细页签 => 担保已用金额
    case "orgusedamount": //集团担保明细页签 => 担保已用金额组织本币
    case "avaamount": //集团担保明细页签 => 可用担保金额
    case "orgavaamount": //集团担保明细页签 => 可用担保金额组织本币
      // guaamount.call(this, props, value, index, key);
      tabAfterEventEdit.call(this, props, moduleId, key, value);
      break;
  }
}

/**
 * 反/担保信息页签、集团担保明细页签字段编辑后事件
 * @param {*} props     	页面内置对象
 * @param {*} values  		参照带出的values
 * @param {*} index       	行号
 * @param {*} key       	key
 */
function guaamount(props, value, index, key) {
  let obj = {
    guaamount: this.state.json["36620GC-000005"] /* 国际化处理： 担保金额*/,
    gualcamount: this.state.json[
      "36620GC-000006"
    ] /* 国际化处理： 担保金额组织本币*/,
    usedamount: this.state.json[
      "36620GC-000007"
    ] /* 国际化处理： 担保已用金额*/,
    orgusedamount: this.state.json[
      "36620GC-000008"
    ] /* 国际化处理： 担保已用金额组织本币*/,
    avaamount: this.state.json["36620GC-000009"] /* 国际化处理： 可用担保金额*/,
    orgavaamount: this.state.json[
      "36620GC-000010"
    ] /* 国际化处理： 可用担保金额组织本币*/
  };
  if (value && +value <= 0) {
    toast({
      color: "warning",
      content: `${obj[key]}${this.state.json["36620GC-000020"]}0!`
    }); /* 国际化处理： 必须大于*/
    props.cardTable.setValByKeysAndIndex(this.tabCode, index, {
      [key]: { value: null, display: null }
    });
    return;
  }
}

/**
 * 财务组织和币种的编辑后事件
 * @param {*} props     	页面内置对象
 * @param {*} values  		参照带出的values
 * @param {*} index       	行号
 */
function contractno(props, values, index) {
  let valObj = { display: null, value: null };
  if (!values) {
    props.cardTable.setValByKeysAndIndex(this.tabCode, index, {
      owerguarantor: valObj, //担保人本单位
      partguarantor: valObj, //担保人合作单位
      inguarantor: valObj, //担保人内部单位
      owerdebtor: valObj, //债务人本单位
      partdebtor: valObj, //债务人合作伙伴
      indebtor: valObj, //债务人内部单位
      pk_currtype: valObj, //币种
      guaamount: valObj //担保金额
    });
    return;
  }
  let {
    pk_currtype,
    currname,
    guaamount,
    owerguarantor,
    owerguarantorname,
    partguarantor,
    partguarantorname,
    inguarantor,
    inguarantorname,
    partdebtor,
    partdebtorname,
    indebtor,
    indebtorname,
    owerdebtor,
    owerdebtorname
  } = values;
  props.cardTable.setValByKeysAndIndex(this.tabCode, index, {
    owerguarantor: {
      display: owerguarantorname.value,
      value: owerguarantor.value
    }, //担保人本单位
    partguarantor: {
      display: partguarantorname.value,
      value: partguarantor.value
    }, //担保人合作单位
    inguarantor: {
      display: inguarantorname.value,
      value: inguarantor.value
    }, //担保人内部单位
    owerdebtor: { display: owerdebtorname.value, value: owerdebtor.value }, //债务人本单位
    partdebtor: { display: partdebtorname.value, value: partdebtor.value }, //债务人合作伙伴
    indebtor: { display: indebtorname.value, value: indebtor.value }, //债务人内部单位
    pk_currtype: { value: pk_currtype.value, display: currname.value }, //币种
    guaamount: { value: guaamount.value, display: guaamount.value } //担保金额
  });
  // setTimeout(() => tabAfterEventEdit.call(this, props, moduleId, key, value), 10);
}

/**
 * 物权编号编辑后事件
 * @param {*} props     	页面内置对象
 * @param {*} values  		参照带出的values
 * @param {*} index       	行号
 * @param {*} moduleId      区域id
 */
function resolvePledgeno(props, values, index, moduleId) {
  values = values || {};
  let owers = [
    {},
    { display: this.state.json["36620GC-000011"], value: "1" },
    { display: this.state.json["36620GC-000012"], value: "2" },
    { display: this.state.json["36620GC-000013"], value: "3" }
  ]; /* 国际化处理： 本单位,外部单位,集团内*/
  let {
    partnerid = {},
    partnername = {},
    iunitinid = {},
    iunitinname = {},
    ownunit = {},
    ownunitname = {},
    propertyname = {},
    maxpledge = {},
    totalpledge = {},
    currname = {},
    pk_currtype = {},
    owner = {}
  } = values;
  let empty = { display: null, value: null };
  let isClear = Object.keys(values).length;
  let usinglcamountData = isClear
    ? {
        display: null,
        value: Number(maxpledge.value || 0) - Number(totalpledge.value || 0)
      }
    : props.cardTable.getValByKeyAndIndex(this.tabCode, index, "usinglcamount");

  props.cardTable.setValByKeysAndIndex(this.tabCode, index, {
    pledgename: isClear ? propertyname : empty, //物权名称
    owner: isClear ? owers[owner.value] : empty, //所有者属性
    partnerid: isClear
      ? { value: partnerid.value, display: partnername.value }
      : empty, //权属单位外部单位
    iunitinid: isClear
      ? { value: iunitinid.value, display: iunitinname.value }
      : empty, //权属单位集团内
    ownunit: isClear
      ? { value: ownunit.value, display: ownunitname.value }
      : empty, //权属单位本单位
    usingamount: isClear ? maxpledge : empty, //可抵/质押价值
    totalpledge: isClear ? totalpledge : empty, //累计抵/质押
    pk_currtype: isClear
      ? { display: currname.value, value: pk_currtype.value }
      : empty, //币种
    usinglcamount: usinglcamountData //本次抵/质押价值
  });
  // setTimeout(() => usinglcamount.call(this, props), 10); (已弃用)
  // 触发 本次抵/质押价值 字段的编辑后事件为 主表回写最新数据
  setTimeout(
    () =>
      tabAfterEventEdit.call(
        this,
        props,
        moduleId,
        usinglcamountKey(props),
        usinglcamountSum(props)
      ),
    10
  );
}

// 保证信息页签 => 保证人类型编辑后事件
function warrantortype(props, val, index) {
  let valObj = { display: null, value: null };
  props.cardTable.setValByKeysAndIndex(this.tabCode, index, {
    warrantorin: valObj, //担保人内部单位
    warrantorfin: valObj, //保证人金融机构
    warrantorou: valObj //担保人合作伙伴
  });
  let editObj = {
    warrantorin: val == "2",
    warrantorfin: val == "3",
    warrantorou: val == "1"
  };
  props.cardTable.setEditabByIndex(this.tabCode, index, editObj);
}

// 保证信息页签 => 保证比例编辑后事件
function setWaramount(props, moduleId, key, warratio, guaamount, index) {
  if (!warratio) {
    return;
  }
  if (warratio && +warratio <= 0) {
    toast({
      color: "warning",
      content: this.state.json["36620GC-000014"]
    }); /* 国际化处理： 保证比例必须大于0!*/
    props.cardTable.setValByKeysAndIndex(this.tabCode, index, {
      warratio: { value: null, display: null }
      // waramount: {value: null, display: null},
    });
    return;
  }
  if (+warratio > 100) {
    toast({
      color: "warning",
      content: this.state.json["36620GC-000015"]
    }); /* 国际化处理： 保证比例不能大于100%!*/
    props.cardTable.setValByKeysAndIndex(this.tabCode, index, {
      warratio: { value: null, display: null }
      // waramount: {value: null, display: null},
    });
    return;
  }
  tabAfterEventEdit.call(this, props, moduleId, key, warratio);
}
// 编辑后事件
function tabAfterEventEdit(props, moduleId, key, value) {
  let data = props.createTabsAfterEventData(
    this.pageId,
    this.formId,
    this.tabOrder,
    moduleId,
    key,
    typeof value === "string" ? { value, display: value } : value
  );
  if (key == usinglcamountKey(props)) {
    data.changedrows = [{ newvalue: { value, display: value } }];
  }
  // let eventData = props.createTabsAfterEventData(cardPageId, 'form_info', tabs.tabOrder, moduleId, key, value); //编辑后事件整单数据
  ajax({
    url: `${baseReqUrl}${javaUrl.afterEvent}.do`,
    data,
    async: true,
    success: res => {
      if (res.success) {
        props.form.setAllFormValue({
          [this.formId]: res.data && res.data.head && res.data.head[this.formId]
        });
        props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
        if (props.getUrlParam("status") === "change") {
          //变更时需要做的事情
          resolveTabsChange.call(this);
        }
        // 子表保证信息 中 保证人金融机构 字段
        if (key === "warrantorfin" || key === "warratio") {
          warrantyinfoCellEdit.call(this);
        }
      }
    },
    error: res => {
      toast({ color: "warning", content: res.message });
    }
  });
}

//抵押/质押信息页签 => 本次抵押/质押价值编辑后事件 （已弃用）
function usinglcamount(props, value, usingamount, totalpledge, index) {
  usingamount = usingamount || 0;
  totalpledge = totalpledge || 0;
  let currTab = props.cardTable.getCurTabKey();
  if (value && +value <= 0) {
    toast({
      color: "warning",
      content:
        currTab === "pledgeinfo"
          ? this.state.json["36620GC-000016"]
          : this.state.json["36620GC-000017"]
    }); /* 国际化处理： 本次质押价值必须大于0!,本次抵押价值必须大于0!*/
    props.cardTable.setValByKeysAndIndex(this.tabCode, index, {
      usinglcamount: { value: null, display: null }
    });
    return;
  }
  if (value && +value > usingamount - totalpledge) {
    toast({
      color: "warning",
      content:
        currTab === "pledgeinfo"
          ? this.state.json["36620GC-000018"]
          : this.state.json["36620GC-000019"]
    }); /* 国际化处理： 本次质押价值不可以超过可质押价值 - 累计已质押价值!,本次抵押价值不可以超过可抵押价值 - 累计已抵押价值!*/
    props.cardTable.setValByKeysAndIndex(this.tabCode, index, {
      usinglcamount: { value: null, display: null }
    });
    return;
  }
  let data = props.cardTable.getTabColValue(currTab, "usinglcamount");
  let olcrate =
    Number(props.form.getFormItemsValue(this.formId, "olcrate").value) || 1;
  let sum = data.reduce((pre, curr) => pre + (Number(curr.value) || 0), 0);
  props.form.setFormItemsValue(this.formId, {
    [currTab === "pledgeinfo" ? "pleamount" : "moramount"]: {
      value: sum,
      display: null
    }, //主表中的抵押/质押总金额
    [currTab === "pledgeinfo" ? "plelcamount" : "morlcamount"]: {
      value: sum * olcrate,
      display: null
    } //主表中的抵押/质押本币总金额
  });
}
// 子表中本次抵押/质押价值 总和处理
const usinglcamountSum = props => {
  let currTab = props.cardTable.getCurTabKey();
  let allUsinglcamountData = props.cardTable.getTabColValue(
    currTab,
    "usinglcamount"
  );
  // 将表格中所有 "usinglcamount" 字段的值进行累加
  return (
    allUsinglcamountData.reduce(
      (pre, curr) => pre + (Number(curr.value) || 0),
      0
    ) + ""
  );
};

// 子表中本次抵押/质押价值 值区分
const usinglcamountKey = props => {
  let currTab = props.cardTable.getCurTabKey();
  if (currTab === "pledgeinfo") {
    return "pusinglcamount";
  }
  return "usinglcamount";
};

//左侧选择列选择框回调
export function buttonDisabled(props) {
  let selected = props.cardTable.getCheckedRows(this.tabCode);
  props.button.setButtonDisabled(["deleteRow", "copyRow"], !selected.length);
}

/*lKiRROu+lXJrYDtJ7C6J0vFJgHRjlzkVixNR7TYMD8kdBxIoPOYWgFVH5BWKIbsV*/