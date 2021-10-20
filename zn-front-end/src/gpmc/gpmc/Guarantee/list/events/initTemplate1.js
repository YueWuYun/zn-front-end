/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { list, appCode_link } from "../../cons/constant.js";

export default function(props) {
  let appCode_link = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: list.pageCode_link, //页面code
      appcode: appCode_link
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, props, meta);
          props.meta.setMeta(meta);
        }
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
        }
      }
    }
  );
}

function modifierMeta(props, meta) {
  meta[this.tableId].pagination = true;
  meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
    if (item.attrcode == "contractno") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ color: "#007ace", cursor: "pointer" }}
            onClick={() => {
              props.pushTo("/card", {
                status: "browse",
                id: record[this.primaryId].value,
                pagecode: "36620GCL_CARD",
                scene: "linksce_card",
                gua: this.props.getUrlParam("id")
              });
            }}
          >
            {record && record.contractno && record.contractno.value}
          </a>
        );
      };
    }
    return item;
  });
  return meta;
}

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/