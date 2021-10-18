/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { createPage, ajax, base } from "nc-lightapp-front";

export default function(props) {
  let that = this;
  let app_code =
    props.getSearchParam("c") || props.getUrlParam("c") || "36010SUBLOAN";
  props.createUIDom(
    {
      pagecode: "36010SUBLOAN_C01", //页面id
      appcode: '36010SUBLOAN',
      oid: "1001Z61000000000HKPZ"
    },
    data => {
      if (data) {
        let { button, template } = data;
        if (button) {
          props.button.setButtons(button, () => {});
        }
        if (template) {
          modifierMeta(that, props, template);
          props.meta.setMeta(template, () => {});
          that.initData.call(that);
        }
      }
    }
  );
}

function modifierMeta(props, meta) {
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/