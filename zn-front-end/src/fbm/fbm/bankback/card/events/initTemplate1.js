/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
/* 
银行领用 初始化联查卡片页面
 created by zhoulyu 
 update: 2019-10-12
*/
import { CARD } from "../../cons/constant";

export default function(props, templateCallback) {
  let app_code = props.getSearchParam("c");
  props.createUIDom(
    {
      pagecode: CARD.page_id_link,
      appcode: app_code
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          props.meta.setMeta(meta);
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