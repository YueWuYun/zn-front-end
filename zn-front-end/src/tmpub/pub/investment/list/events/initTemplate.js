/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { bodyButtonClick } from "./bodyButtonClick";
import {
  list_page_id,
  app_code,
  button_limit,
  list_table_id,
  disabled_btn
} from "../../cons/constant.js";
import { searchButtonClick, oprBtnVisible } from "../../../public/events";
export default function(props) {
  let appCode = props.getSearchParam("c") || props.getUrlParam("c") || app_code;
  props.createUIDom(
    {
      pagecode: list_page_id, //页面id
      appcode: appCode
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, props, meta);
          props.meta.setMeta(meta);
          this.setState({ showToast: false });
          searchButtonClick.call(this, this.props);
        }
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
          props.button.setButtonVisible({ Save: false, Cancel: false });
          props.button.setPopContent("DelLine", "确定要删除吗?");
          props.button.setButtonDisabled(disabled_btn, true);
        }
      }
    }
  );
}

function modifierMeta(props, meta) {
  meta[list_table_id].items.push({
    itemtype: "customer",
    attrcode: "opr",
    label: "操作",
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    itemtype: "customer",
    render: (text, record, index) => {
      let buttonAry = oprBtnVisible.call(this, record);
      return props.button.createOprationButton(buttonAry, {
        area: "list_inner",
        buttonLimit: button_limit,
        onButtonClick: (props, key) =>
          bodyButtonClick.call(this, props, key, record)
      });
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/