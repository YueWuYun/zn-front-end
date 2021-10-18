/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { CARD, API_URL } from "../../cons/constant";
import { buttonVisible } from "./buttonVisible";
import { afterEvent } from "./afterEvent";
import { ajax } from "nc-lightapp-front";
import { initData } from "./page";

export default function(props, templateCallback) {
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
          getParaintAndSetMeta.call(
            this,
            props,
            meta,
            templateCallback,
            data.context && data.context.pk_org
          );
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
          buttonVisible.call(this, props, button);
        }
        if (data.context) {
          let { pk_org, org_Name, pk_org_v, org_v_Name } = data.context;
          this.setState({
            context: data.context
          });
          if (props.getUrlParam("status") === "add") {
            //设置默认组织
            if (props.pageType === "org") {
              //组织
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
    }
  );
}

function modifierMeta(meta, paraInt) {
  let rate = ["yrate", "mrate", "rate"];
  let overRate = ["yoverrate", "moverrate", "overrate"];
  if (this.props.pageType === "org") {
    meta.head.items.map(item => {
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
    });
  }
  // 精度校准
  for (let item of meta["interest"].items) {
    if ([...rate, ...overRate].includes(item.attrcode)) {
      item.scale = paraInt.digits;
    }
  }
  for (let item of meta["rationrate"].items) {
    if ([...rate, ...overRate].includes(item.attrcode)) {
      item.scale = paraInt.digits;
    }
  }
  for (let item of meta["advancerate"].items) {
    if ([...rate].includes(item.attrcode)) {
      item.scale = paraInt.digits;
    }
  }
  return meta;
}

function getParaintAndSetMeta(props, meta, templateCallback, pkOrg) {
  ajax({
    url: API_URL["queryParaint"],
    success: res => {
      if (res.data) {
        const { data } = res;
        props.setUrlParam({ paraInt: data && data.digits });
        meta = modifierMeta.call(this, meta, data && data);
        props.meta.renderTabs(meta, CARD.tab_order);
        initData.call(this, pkOrg, data && data);
        templateCallback && templateCallback.call(this);
      }
    }
  });
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/