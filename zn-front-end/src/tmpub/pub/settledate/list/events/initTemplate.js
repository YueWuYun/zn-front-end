/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { list, card, appCode, btnLimit } from "../../cons/constant.js";
import { searchBtnOperation } from "../../../public/container/list/search";
import { listBodyBtnClick } from "../../../public/container/list/listBodyBtnClick.js";

export default function(props, json, inlt) {
  let app_code = props.getSearchParam("c") || props.getUrlParam("c") || appCode;
  props.createUIDom(
    {
      pagecode: this.pageId, //页面id
      appcode: app_code
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, props, meta, json);
          props.meta.setMeta(meta);
          this.setState({ showToast: false });
          searchBtnOperation.call(this, props);
        }
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
          props.button.setPopContent(
            "delete",
            json["36010ISDC-000021"]
          ); /* 国际化处理： 确认要删除吗?*/
          props.button.setButtonDisabled(list.disabled_btn, true);
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
                pagecode: card.pageCode,
                sysMark: record.advanceddata.value
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
    label: json["36010ISDC-000015"] /* 国际化处理： 操作*/,
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    render: (text, record, index) => {
      let buttonAry = [];
      let status = record.enablestate && record.enablestate.value;
      switch (status) {
        case "0":
          buttonAry = ["stop", "edit", "delete"];
          break;
        case "1":
          buttonAry = ["start", "edit", "delete"];
          break;
      }
      return props.button.createOprationButton(buttonAry, {
        area: list.bodyCode,
        buttonLimit: btnLimit,
        onButtonClick: (props, key) => listBodyBtnClick.call(this, key, record)
      });
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/