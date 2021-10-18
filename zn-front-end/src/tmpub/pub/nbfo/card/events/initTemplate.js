/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { buttonVisible } from "./buttonVisible";
import { onInit, exdInit } from "./treeEvent.js";

export default function (props, json) {
  let appCode =
    props.getSearchParam("c") || props.getUrlParam("c") || this.appcode;
  props.createUIDom(
    {
      pagecode: this.pageId, //页面id
      appcode: appCode,
    },
    (data) => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          if (JSON.stringify(meta.gridrelation) === "{}") {
            meta.gridrelation = {
              // 只描述了 表和侧拉的关系
              bankaccount: {
                srcAreaCode: "bankaccount",
                tabRelation: ["bankaccount"],
              },
            };
          }
          meta = modifierMeta.call(this, meta);
          props.meta.renderTabs(meta, [this.tableId], [this.tableId], () => {
            if (this.appcode == "36010NBFO") {
              //给全局的所属组织赋默认值
              props.form.setFormItemsValue(this.formId, {
                pk_org: {
                  value: "GLOBLE00000000000000",
                  display: this.state.json["36010NBFO-000046"],
                },
              });
            } else if (this.appcode == "36010NBFOG") {
              //给集团和组织赋当前登陆的集团
              let { groupId, groupName } = this.businessInfo;
              if (groupId && groupName) {
                props.form.setFormItemsValue(this.formId, {
                  pk_org: { value: groupId, display: groupName },
                });
              }
            } else {
              //给组织赋当前组织

              // 全局上下文 其中包含当前组织
              this.setState({
                context: data.context,
              });
              let { pk_org, org_Name, pk_org_v, org_v_Name } = data.context;
              if (pk_org && pk_org != "GLOBLE00000000000000") {
                props.form.setFormItemsValue(this.formId, {
                  pk_org: { value: pk_org, display: org_Name },
                  pk_org_v: { value: pk_org_v, display: org_v_Name },
                });
              }
            }
          });

          exdInit.call(this, json); // 初始化全部子节点并处理
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button, () => {
            // props.button.setPopContent('delete', '确认要删除吗?');
            buttonVisible.call(this, props);
          });
        }
      }
    }
  );
}

function modifierMeta(meta) {
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/