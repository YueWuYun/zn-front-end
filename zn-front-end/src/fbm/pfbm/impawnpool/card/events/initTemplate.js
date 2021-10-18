/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { CARD, impawnbackAreaCode } from "../../cons/constant";
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
          // templateCallback.call(this, props, meta);
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
          buttonVisible.call(this, props, button);
        }
        props.form.openArea("billpoolinfo");
        props.form.openArea("withdrawstatus");
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
  //表头
  meta[this.formId].items.map(item => {
    if (item.attrcode.indexOf("def") > -1) {
      //自定义档案按照组织或者集团过滤
      item.queryCondition = p => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        let pk_group = this.props.form.getFormItemsValue(this.formId, "pk_group").value;
        return {
          pk_org: pk_org,
          pk_group: pk_group
        };
      };
    }
    if (item.attrcode === "pk_org") {
      //财务组织
      item.queryCondition = () => {
        return {
          funcode: this.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }

    if (item.attrcode === "impawnpersonid") {
      //质押人
      item.showHistory = true;
      item.queryCondition = () => {
        return {
          pk_org: this.props.form.getFormItemsValue(this.formId, "pk_org").value
        };
      };
    }
    //借款单位  客商参照需要传pk_org和pk_group
    if (item.attrcode == "debitunit") {
      item.queryCondition = () => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
        let pk_group = this.props.form.getFormItemsValue(
          this.formId,
          "pk_group"
        );
        return {
          pk_org: pk_org && pk_org.value,
          pk_group: pk_group && pk_group.value
        };
      };
    }
    //票据编号参照过滤
    if (item.attrcode == "pk_register") {
      item.queryCondition = () => {
        let pk_register =
          this.props.form.getFormItemsValue(this.formId, "pk_register") &&
          this.props.form.getFormItemsValue(this.formId, "pk_register").value;
        let pk_org =
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value;
        let pk_impawn =
          this.props.form.getFormItemsValue(this.formId, "pk_impawn") &&
          this.props.form.getFormItemsValue(this.formId, "pk_impawn").value;
        return {
          pk_register: pk_register,
          pk_org: pk_org,
          billpoolflag: "true",
          pk_impawn: pk_impawn,
          GridRefActionExt:
            "nccloud.web.fbm.pfbm.impawnpool.filter.ImpawnpoolBillFilter"
        };
      };
    }
  }); 
  // 网银信息
  meta['billpoolinfo'].items.map(item => {
    if (item.attrcode === "holderaccount") {
      //电票签约账户
      item.showHistory = true;
      item.queryCondition = () => {
        let data = this.props.form.getFormItemsValue(this.formId, "pk_org")
          .value;
        return {
          isenableelecbill: "Y",
          pk_org: data,
          GridRefActionExt:
            "nccloud.web.fbm.ref.filter.BankAccDefaultGridRefFilter"
        };
      };
    }
  });
  //表头
  meta[impawnbackAreaCode].items.map(item => {
    if (item.attrcode === "impawnbackpersonid") {
      //质押回收人
      item.showHistory = true;
      item.queryCondition = () => {
        return {
          pk_org: this.props.form.getFormItemsValue(this.formId, "pk_org").value
        };
      };
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/