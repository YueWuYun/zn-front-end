/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/
/* 
银行领用审批中心跳转单据初始化模板
 created by：zhoulyu 
 update: 2019-10-12
*/
import { approve_app_code, CARD } from "../../cons/constant";

export default function(props, templateCallback) {
  props.createUIDom(
    {
      pagecode: CARD.page_id_approve,
      appcode: approve_app_code
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

/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/