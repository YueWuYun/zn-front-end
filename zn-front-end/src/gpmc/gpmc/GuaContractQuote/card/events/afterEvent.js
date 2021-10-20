/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
import { ajax, toast, promptBox } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant.js";
import moment from "moment";

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
            "36620GBM-000016"
          ] /* 国际化处理： 修改财务组织*/,
          content: this.state.json[
            "36620GBM-000017"
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
              pk_org_v: oldvalue,
            }),
        });
      }
      break;
    case "startdate": // 债务开始日期
    case "pk_currtype": //币种
    case "olcrate": //组织本币汇率
    case "glcrate": //集团本币汇率
    case "gllcrate": //全局本币汇率汇率
    case "quoteamount": //占用担保金额
    case "amount": //债务金额
      resolveAmount.call(this, props, moduleId, key, value);
      break;
    case "startdate": //债务开始日期
      resolveDate.call(this, props, value.value, key, "enddate", -1);
      break;
    case "enddate": //债务结束日期
      resolveDate.call(this, props, value.value, key, "startdate", 1);
      break;
    case "amount": //债务金额
      resolveAmount.call(this, props, moduleId, key, value);
      break;
  }
}

/**
 * 财务组织、币种、金额等编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 */
export function afterEventEdit(props, moduleId, key, value, async = false) {
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
      value: null,
    };
    ajax({
      url: `${baseReqUrl}${javaUrl.afterEvent}.do`,
      data,
      async,
      success: (res) => {
        if (res.success) {
          if (async) {
            this.pk_currtype =
              res.data &&
              res.data.head &&
              res.data.head[this.formId].rows[0].values.pk_currtype.value;
            let pk_currtype = props.form.getFormItemsValue(
              this.formId,
              "pk_currtype"
            ).value;
          } else {
            if (key === "pk_org") {
              props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
              this.pk_currtype =
                res.data &&
                res.data.head &&
                res.data.head[this.formId].rows[0].values.pk_currtype.value;
            }
            props.form.setAllFormValue({
              [this.formId]:
                res.data && res.data.head && res.data.head[this.formId],
            });
          }
        }
      },
      error: (res) => {
        if (key === "pk_org") {
          props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
        }
        toast({ color: "warning", content: res.message });
      },
    });
  } else if (key === "pk_org") {
    props.initMetaByPkorg();
    props.form.EmptyAllFormValue(this.formId);
    this.pk_currtype = null;
  }
}

/**
 * 组织本币汇率/占用担保金额/债务金额的编辑后事件
 * @param {*} props     	页面内置对象
 * @param {*} value  		value
 */
function resolveAmount(props, moduleId, key, value) {
  let obj = {
    olcrate: this.state.json["36620GBM-000018"] /* 国际化处理： 组织本币汇率*/,
    quoteamount: this.state.json[
      "36620GBM-000019"
    ] /* 国际化处理： 占用担保金额*/,
    amount: this.state.json["36620GBM-000020"] /* 国际化处理： 债务金额*/,
  };
  let arr = ["olcrate", "quoteamount", "amount"];
  let val = value.value || 0;
  if (arr.includes(key) && val < 0) {
    toast({
      color: "warning",
      content: `${obj[key]}${this.state.json["36620GBM-000023"]}0!`,
    }); /* 国际化处理： 不能小于*/
    props.form.setFormItemsValue(this.formId, {
      [key]: { display: 0, value: 0 }, //债务本币金额
    });
    return;
  }
  afterEventEdit.call(this, props, moduleId, key, value);
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
    startdate: this.state.json[
      "36620GBM-000021"
    ] /* 国际化处理： 开始日期不能大于结束日期*/,
    enddate: this.state.json[
      "36620GBM-000022"
    ] /* 国际化处理： 结束日期不能小于开始日期*/,
  };
  if (!value || !compareVal) {
    return;
  }
  value = value.substr(0, 10);
  compareVal = compareVal.substr(0, 10);
  if (symbol * (moment(value).valueOf() - moment(compareVal).valueOf()) < 0) {
    toast({ color: "warning", content: msgObj[key] });
    props.form.setFormItemsValue(this.formId, {
      [key]: { display: null, value: null },
    });
  }
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/