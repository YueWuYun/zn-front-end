/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
import { promptBox } from "nc-lightapp-front";
import { EmptyAreaValue } from "../../../../pub/utils/EmptyAreaValueUtil";
import { CARD_FORM_CODE, CARD_PAGE_CODE, CARD_TABLE_CODE1, URL_LIST } from "./../../cons/constant";
import { doAfterAjax } from "./../../utils/commonUtil";

export function afterEvent(
  props,
  moduleId,
  key,
  value,
  changedrows,
  i,
  s,
  g,
  isInit
) {
  console.log(key);
  let data = props.createHeadAfterEventData(
    CARD_PAGE_CODE,
    moduleId,
    [],
    moduleId,
    key,
    value
  );
  switch (key) {
    //财务组织
    case "pk_org":
      doPkOrgEvent.call(this, props, data, isInit);
      break;
    // 票据编号
    case "pk_register":
      doPKRegister.call(this, props, data, moduleId);
      break;
    // 付票时间
    case "paybilldate":
      doPaybilldate.call(this, props, data, moduleId);
      break;
    // 网银
    case "cyberbankflag":
      doCyberbankflag.call(this, props, data);
      break;
    // 组织本币汇率
    case "olcrate":
    // 组织本币汇率
    case "glcrate":
    // 组织本币汇率
    case "gllcrate":
      doOlcrate.call(this, props, data, moduleId);
      break;
    default:
      break;
  }
}

/**
 * 付票日期
 * @param {*} props
 * @param {*} data
 */
function doPaybilldate(props, data, moduleId) {
  let newvalue = data.newvalue.value;
  let oldvalue = data.oldvalue.value;

  /**
   * 没有变化 直接退出
   */
  if (newvalue == oldvalue) {
    return;
  } else if (newvalue != oldvalue) {
    // 成功回调
    let successCallback = function (res) {
      let setEditable = res.data.sameCurr;
      if (setEditable.indexOf("olcrate") > -1) {
        props.form.setFormItemsDisabled(moduleId, { olcrate: false });
      } else {
        props.form.setFormItemsDisabled(moduleId, { olcrate: true });
      }
      if (setEditable.indexOf("glcrate") > -1) {
        props.form.setFormItemsDisabled(moduleId, { glcrate: false });
      } else {
        props.form.setFormItemsDisabled(moduleId, { glcrate: true });
      }
      if (setEditable.indexOf("gllcrate") > -1) {
        props.form.setFormItemsDisabled(moduleId, { gllcrate: false });
      } else {
        props.form.setFormItemsDisabled(moduleId, { gllcrate: true });
      }
      //设置form的编辑属性
      if (res.data.card.head) {
        //页面渲染
        this.props.form.setAllFormValue({
          [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
        });
      }
    };

    // 后台查询
    doAfterAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback);
  }
}
/**
 * 票据编号：
 * 1.票据编号校验
 * 2.带出票据类型
 * 3.触发票据类型的编辑后事件
 * @param {*} props
 * @param {*} data
 */
function doPKRegister(props, data, moduleId) {
  let newvalue = data.newvalue.value;
  let oldvalue = data.oldvalue.value;

  /**
   * 没有变化 直接退出
   */
  if (newvalue == oldvalue) {
    return;
  } else if (newvalue != oldvalue) {
    //清空票面金额和票面备注
    this.props.form.setFormItemsValue(CARD_FORM_CODE, {
      money: { value: "" },
      "pk_register.registernote": { value: "" }
    });
    // 成功回调
    let successCallback = function (res) {
      //设置form的编辑属性
      if (res.data.card.head) {
        //页面渲染
        this.props.form.setAllFormValue({
          [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
        });
      }
      // 电子票据 网银字段可编辑
      if (res.data.ebill) {
        this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
          cyberbankflag: false
          // ，issamebank: false
        });
        this.props.form.setFormItemsValue(CARD_FORM_CODE, {
          cyberbankflag: { value: false }
        });
        if (res.data.sameBank) {
          this.props.form.setFormItemsValue(CARD_FORM_CODE, {
            issamebank: { value: false }
          });
        }
      } else {
        this.props.form.setFormItemsValue(CARD_FORM_CODE, {
          cyberbankflag: { value: false },
          issamebank: { value: false }
        });
        this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
          cyberbankflag: true,
          issamebank: true
        });
      }
      // 原币与本币相同
      let setEditable = res.data.sameCurr;
      if (setEditable.indexOf("olcrate") > -1) {
        props.form.setFormItemsDisabled(moduleId, { olcrate: false });
      } else {
        props.form.setFormItemsDisabled(moduleId, { olcrate: true });
      }
      if (setEditable.indexOf("glcrate") > -1) {
        props.form.setFormItemsDisabled(moduleId, { glcrate: false });
      } else {
        props.form.setFormItemsDisabled(moduleId, { glcrate: true });
      }
      if (setEditable.indexOf("gllcrate") > -1) {
        props.form.setFormItemsDisabled(moduleId, { gllcrate: false });
      } else {
        props.form.setFormItemsDisabled(moduleId, { gllcrate: true });
      }
    };

    // 后台查询
    doAfterAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback);
  }
}
/**
 * 网银勾选
 * @param {*} props
 * @param {*} data
 */
function doCyberbankflag(props, data) {
  let newvalue = data.newvalue.value;
  let oldvalue = data.oldvalue.value;

  /**
   * 没有变化 直接退出
   */
  if (newvalue == oldvalue) {
    return;
  } else if (newvalue != oldvalue) {
    // 电子票据选择才可以编辑是否是同行
    if (newvalue) {
      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        issamebank: false
      });
    } else {
      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        issamebank: true
      });
    }
  }
}
/**
 * 组织本币汇率
 * 原币与本币相同时，默认1.00，不可编辑；原币本币不同时，汇率可编辑
 * @param {*} props
 * @param {*} data
 */
function doOlcrate(props, data, moduleId) {
  let newvalue = data.newvalue.value;
  let oldvalue = data.oldvalue.value;

  /**
   * 没有变化 直接退出
   */
  if (newvalue == oldvalue) {
    return;
  } else if (newvalue != oldvalue) {
    // 成功回调
    let successCallback = function (res) {
      let setEditable = res.data.sameCurr;
      if (setEditable.indexOf("olcrate") > -1) {
        props.form.setFormItemsDisabled(moduleId, { olcrate: false });
      } else {
        props.form.setFormItemsDisabled(moduleId, { olcrate: true });
      }
      if (setEditable.indexOf("glcrate") > -1) {
        props.form.setFormItemsDisabled(moduleId, { glcrate: false });
      } else {
        props.form.setFormItemsDisabled(moduleId, { glcrate: true });
      }
      if (setEditable.indexOf("gllcrate") > -1) {
        props.form.setFormItemsDisabled(moduleId, { gllcrate: false });
      } else {
        props.form.setFormItemsDisabled(moduleId, { gllcrate: true });
      }
      //设置form的编辑属性
      if (res.data.card.head) {
        //页面渲染
        this.props.form.setAllFormValue({
          [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
        });
      }
    };

    // 后台查询
    doAfterAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback);
  }
}

/**
 * 财务组织的编辑后事件
 * @param {*} props
 */
function doPkOrgEvent(props, data, isInit) {
  let newvalue = data.newvalue.value;
  let oldvalue = data.oldvalue.value;
  if (isInit) {
    changeOrgConfirm.call(this, data);
    return;
  }
  /**
   * 没有变化 直接退出
   */
  if (newvalue == oldvalue) {
    return;
  } else if (newvalue != oldvalue) {
    /**
     * 有变化，分为两种
     * 1. 原来就没有值：
     * 	1.1  走后台编辑后事件
     * 	1.2  设置页面的值
     *  1.3  控制某些字段的编辑性
     *
     * 2. 原来有值：
     *  2.1 清空原来的值
     *  2.2 弹窗交互，询问确认操作
     *  2.3 确认后走后台编辑后事件
     */
    if (!oldvalue) {
      // 直接查询后台
      changeOrgConfirm.call(this, data);
    } else {
      // 弹窗交互
      promptBox({
        color: "warning",
        title:
          this.props.MutiInit.getIntl("36180PBR") &&
          this.props.MutiInit.getIntl("36180PBR").get(
            "36180PBR-000000"
          ) /* 国际化处理： 确认修改*/,
        content:
          this.props.MutiInit.getIntl("36180PBR") &&
          this.props.MutiInit.getIntl("36180PBR").get(
            "36180PBR-000001"
          ) /* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/,
        beSureBtnClick: changeOrgConfirm.bind(this, data)
      });
    }
  }
}

/**
 * 组织编辑后 确认事件
 * @param {*} data
 */
function changeOrgConfirm(data) {
  let newvalue = data.newvalue.value;
  if (newvalue == null || newvalue == "undefined") {
    this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
    this.props.initMetaByPkorg();
    return;
  }

  // 成功回调
  let successCallback = function (res) {
    //选择主组织以后，恢复其他字段的编辑性
    this.props.resMetaAfterPkorgEdit();
    // 组织可编辑
    this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { pk_org: false });
    //设置form的编辑属性
    if (res.data.card.head) {
      //页面渲染
      this.props.form.setAllFormValue({
        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
      });
    }
  };

  //清空票据基本信息
  EmptyAreaValue.call(this, CARD_TABLE_CODE1, CARD_FORM_CODE, "pk_register.");
  //清空票面金额和票面备注
  this.props.form.setFormItemsValue(CARD_FORM_CODE, {
    money: { value: "" },
    "pk_register.registernote": { value: "" }
  });

  // 后台查询
  doAfterAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback);
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/