/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
import { ajax, promptBox, toast } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant.js";
import { resolveMeasurable } from "./page";

/**
 * 编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 * @param {*} oldvalue  旧值/新旧值集合
 */
export default function afterEvent(props, moduleId, key, value, oldvalue) {
  console.log(key, value, oldvalue, "key, value, oldvalue");
  switch (key) {
    case "pk_org": //财务组织
      if (!oldvalue || !oldvalue.value) {
        //处理组织编辑后事件
        afterEventEdit.call(this, props, moduleId, key, value);
      } else {
        promptBox({
          color: "warning",
          title: this.state.json[
            "36620GP-000021"
          ] /* 国际化处理： 修改财务组织*/,
          content: this.state.json[
            "36620GP-000022"
          ] /* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/,
          beSureBtnClick: () => {
            props.form.EmptyAllFormValue(this.formId);
            afterEventEdit.bind(this, props, moduleId, key, value);
          },
          cancelBtnClick: () =>
            props.form.setFormItemsValue(moduleId, {
              pk_org: oldvalue,
              pk_org_v: oldvalue
            })
        });
      }
      break;
    case "registerdate": // 登记日期
    case "pk_currtype": //币种
    case "olcrate": //组织本币汇率
    case "glcrate": //集团本币汇率
    case "gllcrate": //全局本币汇率汇率
      afterEventEdit.call(this, props, moduleId, key, value); //处理币种编辑后事件
      break;
    case "owner": //所有者属性
      resolveOwner.call(this, props, value, true);
      break;
    case "measurable": //是否可计量
      resolveMeasurable.call(this, !value.value, true);
      break;
    case "p_price": //单价
    case "p_count": //数量
    case "curprice": //当前评估值
    case "firstprice": //最初评估价值
    case "originprice": //原值
    case "debtmny": //债务金额
      resolveOriginPrice.call(this, props, moduleId, key, value);
      break;
    case "pledgerate": //质(抵)押率
      resolvePledgerate.call(this, props, moduleId, key, value);
      break;
    case "guagptype": // 物权担保分类选择“抵押物权”时，“资产编号”字段可以编辑
      props.form.setFormItemsDisabled(this.formId, {
        assetno: value.value === "2"
      });
      // 担保物权分类 为 质押物权时 清空 资产编号的内容
      if (value.value === "2") {
        props.form.setFormItemsValue(this.formId, {
          assetno: { value: null }
        });
      }
      break;
    case "assetno": // 选完资产编码后，需要将资产卡片上的“本币原值”、“坐标位置”带到担保物权页面上
      afterEventEdit.call(this, props, moduleId, key, value); // 处理资产编码编辑后事件
      break;
    default:
      break;
  }
}

/**
 * 所有者属性编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} value     当前值
 * @param {*} flag      标记
 */
export function resolveOwner(props, value, flag = false) {
  // let aa2= [
  //     {display: "合作伙伴", value: "2"},
  //     {display: "本单位", value: "1"},
  //     {display: "集团内", value: "3"},
  // ];
  let val = value.value;
  let valObj = { display: null, value: null };
  let disabledObj = {
    partnerid: val !== "2", //权属单位合作伙伴
    iunitinid: val !== "3", //权属单位集团内
    ownunit: val !== "1", //权属单位本单位
    userange: val !== "1" //使用范围
  };
  if (flag) {
    let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
    let userange = props.form.getFormItemsValue(this.formId, "userange");
    props.form.setFormItemsDisabled(
      this.formId,
      Object.assign({}, disabledObj, { ownunit: true })
    );
    props.form.setFormItemsValue(this.formId, {
      partnerid: valObj, //权属单位合作伙伴
      iunitinid: valObj, //权属单位集团内
      ownunit: val !== "1" ? valObj : pk_org, //权属单位本单位
      userange:
        val !== "1"
          ? { display: this.state.json["36620GP-000023"], value: "1" }
          : userange //使用范围/* 国际化处理： 本单位可用*/
    });
    resolveRequiredMeta.call(this, props, this.formId, disabledObj);
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
  if (meta[code]) {
    for (let item of meta[code].items) {
      if (arrKeys.includes(item.attrcode)) {
        item.required = !obj[item.attrcode];
      }
    }
    props.meta.setMeta(meta);
  }
}

/**
 * 质(抵)押率编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 */
function resolvePledgerate(props, moduleId, key, value) {
  let flag = true;
  if (value.value > 100) {
    flag = false;
    toast({
      color: "warning",
      content: this.state.json["36620GP-000024"]
    }); /* 国际化处理： 质(抵)押率不能超过100%!*/
  }
  if (value.value < 0) {
    flag = false;
    toast({
      color: "warning",
      content: this.state.json["36620GP-000025"]
    }); /* 国际化处理： 质(抵)押率不能小于0!*/
  }

  if (!flag) {
    props.form.setFormItemsValue(moduleId, {
      pledgerate: { display: null, value: null } //质（抵）押率％
    });
    return;
  }
  afterEventEdit.call(this, props, moduleId, key, value); //处理币种编辑后事件
}

/**
 * 财务组织、币种、金额等编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 */
export function afterEventEdit(props, moduleId, key, value) {
  if (value.value) {
    let data = props.createHeadAfterEventData(
      this.pageId,
      this.formId,
      "",
      moduleId,
      key,
      value
    );
    // 解决首次财务组织编辑后事件传值问题
    data.oldvalue = {
      display: null,
      value: null
    };
    ajax({
      url: `${baseReqUrl}${javaUrl.afterEvent}.do`,
      data,
      async: false,
      success: res => {
        if (res.success) {
          if (key === "pk_org") {
            props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
            let measurable = resolveMeasurable.call(
              this,
              !res.data.head[this.formId].rows[0].values.measurable.value,
              false,
              false
            );
            let owers = res.data.head[this.formId].rows[0].values.owner;
            let owner = resolveOwner.call(this, props, owers);
            props.form.setFormItemsDisabled(
              this.formId,
              Object.assign({}, measurable, owner, {
                ownunit: owers.value === "1"
              })
            );
          }
          props.form.setAllFormValue({
            [this.formId]:
              res.data && res.data.head && res.data.head[this.formId]
          });
        }
      },
      error: res => {
        if (key === "pk_org") {
          props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
        }
        toast({ color: "warning", content: res.message });
      }
    });
  } else if (key === "pk_org") {
    props.initMetaByPkorg();
    props.form.EmptyAllFormValue(this.formId);
  }
}

/**
 * 单价/数量/当前评估值/最初评估价值/原值的编辑后
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 */
function resolveOriginPrice(props, moduleId, key, value) {
  debugger;
  let obj = {
    p_price: this.state.json["36620GP-000026"] /* 国际化处理： 单价*/,
    p_count: this.state.json["36620GP-000027"] /* 国际化处理： 数量*/,
    curprice: this.state.json["36620GP-000028"] /* 国际化处理： 当前评估值*/,
    firstprice: this.state.json[
      "36620GP-000029"
    ] /* 国际化处理： 最初评估价值*/,
    originprice: this.state.json["36620GP-000030"] /* 国际化处理： 原值*/
  };
  if (value.value < 0) {
    toast({
      color: "warning",
      content: `${obj[key]}${this.state.json["36620GP-000031"]}!`
    }); /* 国际化处理： 不能为负数*/
    props.form.setFormItemsValue(moduleId, {
      [key]: { display: null, value: null }
    });
    return;
  }
  //afterEventEdit.call(this, props, moduleId, key, value); //处理币种编辑后事件
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/