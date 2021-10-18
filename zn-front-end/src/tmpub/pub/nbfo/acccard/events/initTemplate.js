/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { buttonVisible } from "./buttonVisible";
import { getBusinessInfo } from "nc-lightapp-front";

export default function(props, json) {
  let appCode =
    props.getSearchParam("c") || props.getUrlParam("c") || this.appcode;
  props.createUIDom(
    {
      pagecode: this.pageId, //页面id
      appcode: appCode
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          props.meta.setMeta(meta, () => {
            setOrgValue.call(this, data.context);
          });
          if (props.getUrlParam("status") === "add") {
            props.cardTable.addRow(this.tableId, 0, null, true);
          }
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
          props.button.setPopContent(
            "Delete_i",
            json["36010NBFO-000013"]
          ); /* 国际化处理： 确认要删除吗?*/
          props.button.setButtonDisabled(["Endefault_i", "deleterow_i"], true);
          buttonVisible.call(this, props);
        }
      }
    }
  );
}

/**
 * 为不同组织单据设置 对应组织默认值
 * @param {*} context 模版返回的全局上下文
 */

function setOrgValue(context) {
  let props = this.props;
  if (context) {
    let { pk_org, org_Name, pk_org_v, org_v_Name } = context;
    if (props.pageType === "global") {
      // 全局
      props.form.setFormItemsValue(this.formId, {
        pk_org: {
          value: "GLOBLE00000000000000",
          display: this.state.json["36010NBFO-000045"]
        } /* 国际化处理： 全局 */
      });
    } else if (props.pageType === "group") {
      // 集团
      let { groupId, groupName } = getBusinessInfo();
      props.form.setFormItemsValue(this.formId, {
        pk_org: { value: groupId, display: groupName }
      });
    } else {
      // 组织
      if (pk_org && pk_org != "GLOBLE00000000000000") {
        props.form.setFormItemsValue(this.formId, {
          pk_org: { value: pk_org, display: org_Name },
          pk_org_v: { value: pk_org_v, display: org_v_Name }
        });
      }
    }
  }
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/