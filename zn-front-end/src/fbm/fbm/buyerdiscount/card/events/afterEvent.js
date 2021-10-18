/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
/* 
 应付票据贴现卡片编辑后事件
 created by：xiezhp 2019-11-5
 update: 
*/
import { base, ajax, promptBox } from "nc-lightapp-front";
import { setHeadItemProp } from "../../../../pub/utils/FBMAfterEditUtil.js";
import { cardEvent } from "../../../../public/container/index";
import { EmptyAreaValue } from "../../../../pub/utils/EmptyAreaValueUtil";

export function afterEvent(props, moduleId, key, value, oldValue) {
  let eventDatas = this.props.createHeadAfterEventData(
    this.pageId,
    this.formId,
    "",
    moduleId,
    key,
    value
  );
  let eventData = {
    eventPosition: "head",
    eventType: "card",
    eventData: JSON.stringify(eventDatas)
  };

  //财务组织
  if (key === "pk_org") {
    // 原数据为空，直接请求
    if (!oldValue.value) {
      changeOrg.call(this, value, eventData);
    } else if (value.value !== oldValue.value) {
      let lang = this.props.MutiInit.getIntl(this.moduleId);
      promptBox({
        color: "warning",
        title: lang && lang.get("36180PDT-000000") /* 国际化处理： 确认*/,
        content:
          lang &&
          lang.get(
            "36180PDT-000001"
          ) /* 国际化处理： 切换组织将会清空您录入的信息，请确认?*/,
        beSureBtnClick: () => {
          changeOrg.call(this, value, eventData);
        },
        cancelBtnClick: () => {
          props.form.setFormItemsValue(this.formId, { pk_org: oldValue });
        }
      });
    }
  }

  //票据号码
  else if (key === "pk_register") {
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, props, res);
      });
    }
    if (!value.value) {
      // 清空票据信息
      EmptyAreaValue.call(this, "baseinfo", this.formId, "pk_register.");
    }
  }

  // 贴现银行账户，需要给银行赋值
  else if (key === "discount_account") {
    if (!value || !value.refpk) {
      props.form.setFormItemsValue(this.formId, {
        pk_discount_bank: { value: "", display: "" }
      });
      return;
    }
    let bankpk = value.values["bd_bankdoc.pk_bankdoc"];
    let bankname = value.values["bd_bankdoc.name"].value;
    bankpk["display"] = bankname;
    // 给银行赋值
    props.form.setFormItemsValue(this.formId, { pk_discount_bank: bankpk });
  }

  //银行
  else if (key == "pk_discount_bank") {
    // 银行账户清空
    props.form.setFormItemsValue(this.formId, { discount_account: null });
  }

  //代理
  else if (key == "isagent") {
    if (value.value) {
      props.form.openArea("signapplyinfo");
    } else {
      props.form.closeArea("signapplyinfo");
    }
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, props, res);
      });
    }
  } else if (
    key == "discountinterest" ||
    key == "discountdelaydaynum" ||
    key == "ddiscountdate" ||
    key == "discountyrate" ||
    key == "ratedaynum" ||
    key == "olcrate" ||
    key == "glcrate" ||
    key == "gllcrate" 
  ) {
    if (value.value !== oldValue.value) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        setAfterEditFormValue.call(this, props, res);
      });
    }
  }
}

//修改财务组织
function changeOrg(value, eventData) {
  cardEvent.changeOrg.call(this, value).then(() => {
    if (value.value) {
      cardEvent.getAfterEventData.call(this, eventData).then(res => {
        this.props.form.setAllFormValue({
          [this.formId]: res.data.card.head[this.formId]
        });
      });
    }
  });
}

//根据获取到的数据设值
function setAfterEditFormValue(props, res) {
  let { success, data } = res;
  let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
  let { head, bodys } = card;

  props.form.setAllFormValue({
    [this.formId]: res.data.card.head[this.formId]
  });
  setHeadItemProp(props, this.formId, headItemProps);
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/