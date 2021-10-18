/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { bodyButtonClick } from "./bodyButtonClick";
import { LIST, button_limit, API_URL } from "../../cons/constant.js";
import { ajax } from "nc-lightapp-front";

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
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          let disabledBtn = LIST.disabled_btn;
          props.button.setButtons(button);
          props.button.setPopContent(
            "delete",
            json["36010IR-000063"]
          ); /* 国际化处理： 确认要删除吗?*/
          props.button.setButtonDisabled(disabledBtn, true);
        }
        if (data.template) {
          let meta = data.template;
          getParseIntAndSetMeta.call(this, props, meta, json);
        }
      }
    }
  );
}

function getParseIntAndSetMeta(props, meta, json) {
  ajax({
    url: API_URL["queryParaint"],
    success: (res) => {
      props.setUrlParam({ paraInt: res.data && res.data.digits });
      meta = modifierMeta.call(
        this,
        props,
        meta,
        json,
        res.data && res.data.digits
      );
      props.meta.setMeta(meta);
    },
  });
}

function modifierMeta(props, meta, json, paraInt) {
  meta[this.searchId].items.map((item) => {
    if (item.attrcode === "pk_org") {
      item.isMultiSelectedEnabled = true;
    }
  });
  meta[LIST.table_id].pagination = true;
  meta[LIST.table_id].items = meta[LIST.table_id].items.map((item, key) => {
    // item.width = 150;
    if (item.attrcode == "yrate") {
      item.scale = paraInt;
    }
    if (item.attrcode == "rateid") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ cursor: "pointer" }} //textDecoration: 'underline',
            onClick={(e) => {
              e.stopPropagation();
              props.pushTo("/card", {
                status: "browse",
                id: record[LIST.primary_id].value,
                pagecode: this.pageId,
              });
            }}
          >
            {record.rateid && record.rateid.value}
          </a>
        );
      };
    }
    return item;
  });

  //添加操作列
  meta[LIST.table_id].items.push({
    itemtype: "customer",
    attrcode: "opr",
    label: json["36010IR-000064"] /* 国际化处理： 操作*/,
    width: 216,
    fixed: "right",
    className: "table-opr",
    visible: true,
    render: (text, record, index) => {
      let buttonAry = [
        "delete",
        "createVersion",
        "deleteVersion",
        "queryVersion",
      ];
      let openStatus = record.enablestate && record.enablestate.value;
      let VesionNo = record.serial_number && record.serial_number.value;
      let financeRateType =
        record.finance_rate_type && record.finance_rate_type.value;
      if (openStatus == "3") {
        //已停用
        buttonAry = [...buttonAry, "enable"];
      } else {
        buttonAry = [...buttonAry, "disable"];
      }
      if (VesionNo && VesionNo === "0") {
        // 没有创建过版本的数据可以有修改按钮
        buttonAry = [...buttonAry, "edit"];
      }
      // if(financeRateType){
      // 	// 没有创建过版本的数据可以有修改按钮
      // 	buttonAry = [ ...buttonAry, 'edit' ];
      // }
      return props.button.createOprationButton(buttonAry, {
        area: "list_inner",
        buttonLimit: button_limit,
        onButtonClick: (props, key) =>
          bodyButtonClick.call(this, key, record, index),
      });
    },
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/