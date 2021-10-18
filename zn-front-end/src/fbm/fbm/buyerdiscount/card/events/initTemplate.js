/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
/* 
 应付票据贴现卡片模板
 created by：xiezhp 2019-11-5
 update: 
*/
import { base, ajax } from "nc-lightapp-front";
import { CARD, LIST, app_code } from "../../cons/constant";
import { buttonVisible } from "./buttonVisible";
import { afterEvent } from "./index";

export default function(props, templateCallback) {
  let appcode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: CARD.page_id, //页面id
      appcode: appcode
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, meta);
          props.meta.setMeta(meta);
          templateCallback.call(this, props, meta);
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
          buttonVisible.call(this, props);
        }
        props.form.openArea("baseinfo");
        templateCallback && templateCallback();
        if (data.context) {
          let context = data.context;
          if (props.getUrlParam("status") === "add") {
            //设置默认组织
            let { pk_org, org_Name, pk_org_v, org_v_Name } = context;
            if (pk_org) {
              props.form.setFormItemsValue(this.formId, {
                pk_org: { value: pk_org, display: org_Name },
                pk_org_v: { value: pk_org_v, display: org_v_Name }
              });
              afterEvent.call(
                this,
                props,
                this.formId,
                "pk_org",
                { display: org_Name, value: pk_org },
                { value: null }
              );
            }
          }
        }
      }
    }
  );
}

function modifierMeta(meta) {
  //表头参照过滤
  meta[this.formId].items.map(item => {
    //财务组织
    if (item.attrcode === "pk_org") {
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }

    //票据号码
    if (item.attrcode === "pk_register") {
      let props = this.props;
      item.queryCondition = () => {
        let pk_org =
          props.form.getFormItemsValue(CARD.form_id, "pk_org") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_org").value;
        let isagent =
          props.form.getFormItemsValue(CARD.form_id, "isagent") &&
          props.form.getFormItemsValue(CARD.form_id, "isagent").value;
        let pk_register =
          props.form.getFormItemsValue(CARD.form_id, "pk_register") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_register").value;

        return {
          pk_org: pk_org,
          isagent: isagent,
          pk_signorg: pk_register,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.buyerdiscount.filter.BuyerDiscoutRegisterFilter"
        };
      };
    }

    //银行账户
    if (item.attrcode == "discount_account") {
      item.showHistory = false;
      let props = this.props;
      return (item.queryCondition = () => {
        let pk_org =
          props.form.getFormItemsValue(CARD.form_id, "pk_org") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_org").value;
        let pk_discount_bank =
          props.form.getFormItemsValue(CARD.form_id, "pk_discount_bank") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_discount_bank").value;
        let pk_curr =
          props.form.getFormItemsValue(CARD.form_id, "pk_curr") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_curr").value;
        let multiLang = this.props.MutiInit.getIntl(this.moduleId); //this.moduleId
        return {
          pk_org: pk_org, // 组织
          pk_discount_bank: pk_discount_bank,
          pk_curr: pk_curr,
          iscurrentFilter: true,
          refnodename:
            multiLang &&
            multiLang.get("36180DT-000002") /* 国际化处理： 使用权参照*/,
          GridRefActionExt:
            "nccloud.web.fbm.base.filter.Bankacc4NCCRefModelFilter"
        };
      });
    }

    //银行
    if (item.attrcode == "pk_discount_bank") {
      item.showHistory = true;
      let props = this.props;
      return (item.queryCondition = () => {
        let pk_org =
          props.form.getFormItemsValue(CARD.form_id, "pk_org") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_org").value;
        let pk_currtype =
          props.form.getFormItemsValue(CARD.form_id, "pk_curr") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_curr").value;
        return {
          pk_org: pk_org, // 组织
          pk_currtype
        };
      });
    }

    // 利息计划项目
    if (item.attrcode == "interestplanitem") {
      let props = this.props;
      return (item.queryCondition = () => {
        let pk_org =
          props.form.getFormItemsValue(CARD.form_id, "pk_org") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_org").value;
        return {
          pk_org: pk_org // 组织
        };
      });
    }

    //持票单位
    if (item.attrcode == "holdunit") {
      let props = this.props;
      return (item.queryCondition = () => {
        let pk_org =
          props.form.getFormItemsValue(CARD.form_id, "pk_org") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_org").value;
        return {
          pk_org: pk_org
        };
      });
    }
    // 成本中心
    if (item.attrcode == "pk_costcenter") {
      let props = this.props;
      return (item.queryCondition = () => {
        let pk_org =
          props.form.getFormItemsValue(CARD.form_id, "pk_org") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_org").value;
        return {
          pk_org: pk_org
        };
      });
    }

    //自定义项参照
    if (item.attrcode.indexOf("def") > -1) {
      let props = this.props;
      item.queryCondition = p => {
        let pk_org =
          props.form.getFormItemsValue(CARD.form_id, "pk_org") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_org").value;
        let pk_group =
          props.form.getFormItemsValue(CARD.form_id, "pk_group") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_group").value;
        return {
          pk_org: pk_org,
          pk_group: pk_group
        };
      };
    }
  });

  //清算信息
  meta["signapplyinfo"].items.map(item => {
    // 内部结算账户
    if (item.attrcode == "pk_inbalaacc") {
      let props = this.props;
      return (item.queryCondition = () => {
        let pk_org =
          props.form.getFormItemsValue(CARD.form_id, "pk_org") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_org").value;
        let pk_curr =
          props.form.getFormItemsValue(CARD.form_id, "pk_curr") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_curr").value;
        let pk_usebillorg =
          props.form.getFormItemsValue(CARD.form_id, "pk_usebillorg") &&
          props.form.getFormItemsValue(CARD.form_id, "pk_usebillorg").value;
        return {
          pk_org: pk_org, // 受理资金组织
          pk_curr: pk_curr,
          pk_usebillorg: pk_usebillorg,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.buyerdiscount.filter.BuyerDiscountInbalaAccRefFilter"
        };
      });
    }
  });

  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/