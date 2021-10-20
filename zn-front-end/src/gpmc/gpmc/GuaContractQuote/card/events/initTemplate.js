/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { appCode } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { afterEventEdit } from "./afterEvent";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";

export default function (props) {
  let appCode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: this.pageId, //页面id
      appcode: appCode,
    },
    (data) => {
      if (data) {
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button, () => {
            props.button.setPopContent(
              "delete",
              this.state.json["36620GBM-000005"]
            ); /* 国际化处理： 确认要删除吗?*/
          });
          buttonVisible.call(this, props, button);
        }
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, meta, props);
          props.meta.setMeta(meta);
          orgVersionView(props, this.formId);
        }
        if (data.context && props.getUrlParam("status") === "add") {
          let { pk_org, pk_org_v, org_Name, org_v_Name } = data.context;
          if (data.context.pk_org) {
            props.form.setFormItemsValue(this.formId, {
              pk_org: { display: org_Name, value: pk_org },
              pk_org_v: { display: org_v_Name, value: pk_org_v },
            });
            afterEventEdit.call(this, props, this.moduleId, "pk_org", {
              display: org_Name,
              value: pk_org,
            });
          } else {
            props.initMetaByPkorg();
          }
        }
      }
    }
  );
}

function modifierMeta(meta, props) {
  meta[this.formId].items.map((item) => {
    //发送发组织，接收方组织：根据用户权限过滤
    if (item.attrcode == "pk_org") {
      item.queryCondition = () => {
        return {
          funcode: props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }
    //担保合约
    if (item.attrcode == "guacontractid") {
      item.queryCondition = () => {
        let pk_org = props.form.getFormItemsValue(this.formId, "pk_org").value;
        let pk_currtype = props.form.getFormItemsValue(
          this.formId,
          "pk_currtype"
        ).value;
        return {
          pk_org,
          pk_currtype,
          isquote: true,
        };
      };
    }
    //债务类型
    if (item.attrcode == "debttype") {
      item.queryCondition = () => ({
        type: "1",
      });
    }
    if (item.attrcode.indexOf("vdef") > -1) {
      item.queryCondition = (p) => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
        pk_org = pk_org && pk_org.value;
        let pk_group = this.props.form.getFormItemsValue(
          this.formId,
          "pk_group"
        );
        pk_group = pk_group && pk_group.value;
        return {
          pk_org,
          pk_group,
        };
      };
    }
  });
  // 主表操作信息
  meta.card_operate.items.map((item) => {
    if (item.attrcode.indexOf("vdef") > -1) {
      item.queryCondition = (p) => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
        pk_org = pk_org && pk_org.value;
        let pk_group = this.props.form.getFormItemsValue(
          this.formId,
          "pk_group"
        );
        pk_group = pk_group && pk_group.value;
        return {
          pk_org,
          pk_group,
        };
      };
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/