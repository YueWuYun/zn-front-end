/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { appCode } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";

export default function (props, json) {
  let app_code = props.getSearchParam("c") || props.getUrlParam("c") || appCode;
  props.createUIDom(
    {
      pagecode: this.pageId, //页面id
      appcode: app_code,
    },
    (data) => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          if (JSON.stringify(meta.gridrelation) === "{}") {
            meta.gridrelation = {
              // 只描述了 表和侧拉的关系
              settleDateDetail: {
                srcAreaCode: "settleDateDetail",
                tabRelation: ["settleDateDetail"],
              },
            };
          }
          meta = modifierMeta.call(this, meta, json);
          props.meta.renderTabs(meta, [this.tableId], [this.tableId], null);
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
          buttonVisible.call(this, props);
          props.button.setButtonDisabled(["deleteRow", "copyRow"], true);
        }
      }
    }
  );
}

function modifierMeta(meta, json) {
  // meta[this.tableId].items.push({
  //     attrcode: "opr",
  //     label: json["36010ISDC-000015"] /* 国际化处理： 操作*/,
  //     itemtype: "customer",
  //     fixed: "right",
  //     className: "table-opr",
  //     visible: true,
  //     width: "210px",
  //     render: (text, record, index) => {
  //         let { isPaste } = this.state;
  //         let buttonAry =
  //             this.props.getUrlParam("status") === "browse"
  //                 ? []
  //                 : isPaste
  //                 ? ["copyThisRow"]
  //                 : ["copy", "insert"];
  //         return this.props.button.createOprationButton(buttonAry, {
  //             area: card.tableBody,
  //             buttonLimit: btnLimit,
  //             onButtonClick: (props, key) =>
  //                 tabButtonClick.call(this, props, key, text, record, index)
  //         });
  //     }
  // });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/