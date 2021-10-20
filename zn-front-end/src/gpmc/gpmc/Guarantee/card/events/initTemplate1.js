/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { tabs, card, appCode_link, btnLimit } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { getCardData } from "./page";
import { tabButtonClick } from "./tabButtonClick";

export default function(props) {
  let appCode =
    props.getSearchParam("c") || props.getUrlParam("c") || appCode_link;
  props.createUIDom(
    {
      pagecode: card.pageCode_link, //页面id
      appcode: appCode
    },
    data => {
      console.log(data, "data");
      if (data) {
        if (data.button) {
          props.button.setButtons(data.button);
          buttonVisible.call(this, props);
        }
        if (data.template) {
          let meta = data.template;
          let id = props.getUrlParam("id");
          meta = modifierMeta.call(this, props, meta);
          props.meta.renderTabs(meta, this.tabOrder, tabs.tabShow);
          if (id) {
            getCardData.call(this, id, true);
          }
        }
      }
    }
  );
}

function modifierMeta(props, meta) {
  for (let item of Object.keys(meta.gridrelation)) {
    meta[item].items.push({
      attrcode: "opr",
      label: this.state.json["36620GC-000021"] /* 国际化处理： 操作*/,
      itemtype: "customer",
      fixed: "right",
      className: "table-opr",
      visible: true,
      width: "210px",
      render: (text, record, index) => {
        let status = this.props.getUrlParam("status");
        if (!["add", "edit", "change", "copy"].includes(status)) {
          //浏览态
          let buttonAry = [record.expandRowStatus ? "fold" : "unfold"];
          return this.props.button.createOprationButton(buttonAry, {
            area: tabs.bodyCode,
            buttonLimit: btnLimit,
            onButtonClick: (props, key) =>
              tabButtonClick.call(this, props, key, text, record, index)
          });
        } else {
          return null;
        }
      }
    });
  }
  return meta;
}

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/