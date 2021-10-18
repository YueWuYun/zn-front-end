/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { bodyButtonClick } from "./bodyButtonClick";
import { list, btnLimit, accList, accCard } from "../../cons/constant.js";
import { searchBtnClick } from "../events";
import { CARD } from "../../../interestrate/cons/constant";

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
          meta = modifierMeta.call(this, props, meta, json);
          props.meta.setMeta(meta);
          searchBtnClick.call(this, props);
        }
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
          props.button.setButtonDisabled(list.disabled_btn, true);
          props.button.setPopContent(
            "Delete_i",
            json["36010NBFO-000005"]
          ); /* 国际化处理： 确定要删除吗?*/
        }
      }
    }
  );
}

function modifierMeta(props, meta, json) {
  meta[this.tableId].pagination = true;
  meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
    if (item.attrcode == "code") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ cursor: "pointer" }}
            onClick={e => {
              e.stopPropagation();
              props.pushTo("/card", {
                status: "browse",
                id: record[this.primaryId].value,
                appcode: this.appcode,
                name: record.name.value,
                namePk: props.getUrlParam("namePk")
                  ? props.getUrlParam("namePk")
                  : props.getUrlParam("nonbankPk"),
                pagecode: CARD.page_id
              });
            }}
          >
            {record && record.code && record.code.value}
          </a>
        );
      };
    }
    return item;
  });

  //添加操作列
  meta[this.tableId].items.push({
    itemtype: "customer",
    attrcode: "opr",
    label: json["36010NBFO-000023"] /* 国际化处理： 操作*/,
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    render: (text, record, index) => {
      let buttonAry = [];
      let enableState = record.enable_state && record.enable_state.value;
      if (enableState === "1") {
        buttonAry = ["Revise_i", "Delete_i", "Disenable_i"];
      } else {
        buttonAry = ["Revise_i", "Delete_i", "Enable_i"];
      }
      return props.button.createOprationButton(buttonAry, {
        area: accList.bodyCode,
        buttonLimit: btnLimit,
        onButtonClick: (props, key) => bodyButtonClick.call(this, key, record)
      });
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/