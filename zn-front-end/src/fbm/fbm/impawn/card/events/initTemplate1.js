/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { CARD } from "../../cons/constant";

export default function(props, templateCallback) {
  let app_code = props.getSearchParam("c");
  props.createUIDom(
    {
      pagecode: CARD.page_id_link, //页面id
      appcode: app_code
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          props.meta.setMeta(meta);
          templateCallback.call(this, props, meta);
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
        }
        templateCallback && templateCallback();
      }
    }
  );
}

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/