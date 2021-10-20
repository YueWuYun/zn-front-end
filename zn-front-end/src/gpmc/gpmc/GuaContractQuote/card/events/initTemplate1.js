/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";

export default function (props) {
  let appcode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: card.pageCode_link, //页面id
      appcode: appcode,
    },
    (data) => {
      if (data) {
        if (data.button) {
          props.button.setButtons(data.button);
          buttonVisible.call(this, props);
        }
        if (data.template) {
          props.meta.setMeta(data.template);
        }
      }
    }
  );
}

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/