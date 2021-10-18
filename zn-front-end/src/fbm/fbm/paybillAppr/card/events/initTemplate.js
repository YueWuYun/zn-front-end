/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { CARD_FORM_CODE, CARD_PAGE_CODE } from "./../../cons/constant";
import { afterEvent, buttonVisiable } from "./../events";

export function initTemplate(props, callback) {
  let appcode = props.getSearchParam("c") || props.getUrlParam("c");
  let that = this;
  props.createUIDom(
    {
      pagecode: CARD_PAGE_CODE, //页面id
      appcode: appcode //注册按钮的id
    },
    function(data) {
      if (data) {
        let status = props.getUrlParam("status");
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta(that, props, meta);
          props.meta.setMeta(meta);
          if (status === "browse") {
            // props.cardTable.setStatus(card_table_id, 'browse');
            let metaFromData = meta[CARD_FORM_CODE];
            metaFromData.items.forEach(val => {
              if (val.attrcode === "pk_org") {
                val.visible = false;
                val.disabled = true;
                return;
              } else if (val.attrcode === "pk_org_v") {
                val.visible = true;
                val.disabled = true;
                return;
              }
            });
          } else {
            // props.cardTable.setStatus(card_table_id, 'edit');
            meta[CARD_FORM_CODE].items.forEach(val => {
              if (val.attrcode === "pk_org") {
                val.visible = true;
                val.disabled = false;
                return;
              } else if (val.attrcode === "pk_org_v") {
                val.visible = false;
                val.disabled = false;
                return;
              }
            });
          }
          if (status === "add") {
            //单据有主组织，新增时,将其他字段设置为不可编辑.
            props.initMetaByPkorg();
            // let metaFromData = meta[CARD_FORM_CODE];
            // metaFromData.items.forEach(val => {
            //   if (val.attrcode === "pk_org") {
            //     // val.visible = true;
            //     val.disabled = false;
            //     return;
            //   }
            // });
            if (data.context) {
              let context = data.context;
              that.setState({
                curr_pk_org: context.pk_org,
                curr_orgname: context.org_Name,
                curr_pk_org_v: context.pk_org_v,
                curr_orgname_v: context.org_v_Name
              });
              that.props.form.setFormItemsValue(CARD_FORM_CODE, {
                pk_org: {
                  value: context.pk_org,
                  display: context.org_Name
                },
                pk_org_v: {
                  value: that.state.curr_pk_org_v,
                  display: that.state.curr_orgname_v
                }
              });
              if (context.pk_org) {
                let pk_org = {
                  value: context.pk_org,
                  display: context.org_Name
                };
                //默认主组织时 可先调用编辑后事件
                afterEvent.call(
                  that,
                  that.props,
                  CARD_FORM_CODE,
                  "pk_org",
                  pk_org,
                  null,
                  null,
                  null,
                  null,
                  true
                );
                that.props.resMetaAfterPkorgEdit();
                that.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                  pk_org: false
                });
              }
            }
          } else if (status === "copy") {
            let metaFromData = meta[CARD_FORM_CODE];
            metaFromData.items.forEach(val => {
              if (val.attrcode === "pk_org") {
                // val.visible = true;
                val.disabled = true;
                return;
              }
            });
          }
        }
        if (data.button) {
          let button = data.button;
          console.log(button);
          props.button.setButtons(button);
          buttonVisiable.call(that, props);
          // props.button.setPopContent('delete_inner', props.MutiInit.getIntl("36320FDA") && props.MutiInit.getIntl("36320FDA").get('36320FDA--000063'));/* 国际化处理： 确认要删除该信息吗？*/
          // props.button.setUploadConfig("ImportData", excelimportconfig);
        }
      }
    }
  );
}

// 付票登记的卡片页面的参照和过滤
function modifierMeta(that, props, meta) {
  //付票登记表
  meta[CARD_FORM_CODE].items.map(item => {
    //财务组织用户过滤
    if (item.attrcode == "pk_org") {
      // item.showHistory = false;
      item.queryCondition = () => {
        return {
          funcode: props.getSearchParam("c") || props.getUrlParam("c"),
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }
    //票据号码参照过滤
    if (item.attrcode == "pk_register") {
      item.queryCondition = () => {
        let pk_register = props.form.getFormItemsValue(
          CARD_FORM_CODE,
          "pk_register"
        );
        let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org");
        return {
          pk_org: pk_org && pk_org.value,
          pk_register: pk_register && pk_register.value,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.paybill.filter.PaybillFilterByOrg4NCC"
        };
      };
    }
    //收款单位参照过滤
    if (item.attrcode == "receiveunit") {
      item.queryCondition = () => {
        let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org");
        let pk_group = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_group");
        return {
          pk_group: pk_group && pk_group.value,
          pk_own_org: pk_org && pk_org.value,
          GridRefActionExt:
            "nccloud.web.fbm.fbm.paybill.filter.PaybillFilterByReceiveunit4NCC"
        };
      };
    }
    //部门过滤
    if (item.attrcode === "dept") {
      item.queryCondition = () => {
        let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org");
        return {
          pk_org: pk_org && pk_org.value
        };
      };
    }
  });

  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/