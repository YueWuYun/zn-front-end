/*CeVnHyz3mE0DtbDpJxyRtV2xQ3WydCYkOo0KWRxi+SSxX9bTfEn5Dc615DlLU6Mw*/
import { oprBtnVisible, listButtonVisible } from "./events";
import { bodyButtonClick } from "./editListOprButton";

/**
 * 基础档案整表编辑页面initTemplate
 * @author dongyue7
 */

export default function(props, afterSetMeta, beforeSetMeta, json) {
  let appCode =
    props.getSearchParam("c") || props.getUrlParam("c") || this.appId;
  props.createUIDom(
    {
      pagecode: this.pageId, //页面id
      appcode: appCode
    },
    data => {
      if (data) {
        let { button, template } = data;
        if (button) {
          props.button.setButtons(button);
          props.button.setButtonDisabled("Delete", true);
        }
        if (template) {
          let meta = modifierMeta.call(
            this,
            props,
            template,
            beforeSetMeta,
            json
          );
          props.meta.setMeta(meta, () => {
            listButtonVisible.call(this, props);
            afterSetMeta && afterSetMeta.call(this, meta, json);
          });
        }
      }
    }
  );
}

function modifierMeta(props, meta, beforeSetMeta, json) {
  meta[this.tableId].items.push({
    itemtype: "customer",
    attrcode: "opr",
    label: json["36010PUBLIC-000007"] /* 国际化处理： 操作*/,
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    itemtype: "customer",
    render: (text, record, index) => {
      let values = record.values;
      let buttonAry = oprBtnVisible.call(
        this,
        values[this.sysMark].value,
        values[this.enableFlag].value,
        this.pageId
      );
      return props.button.createOprationButton(buttonAry, {
        area: "list_inner",
        buttonLimit: 3,
        onButtonClick: (props, key) =>
          bodyButtonClick.call(this, props, key, record, index)
      });
    }
  });
  let newMeta = beforeSetMeta && beforeSetMeta.call(this, meta, json);
  if (newMeta) meta = newMeta;
  return meta;
}

/*CeVnHyz3mE0DtbDpJxyRtV2xQ3WydCYkOo0KWRxi+SSxX9bTfEn5Dc615DlLU6Mw*/