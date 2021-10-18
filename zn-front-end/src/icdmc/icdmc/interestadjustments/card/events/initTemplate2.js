/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/
import { card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";

export default function(props) {
    let appCode_appro = props.getSearchParam("c") || props.getUrlParam("c");
    props.createUIDom(
        {
            pagecode: card.pageCode_appro, //页面id
            appcode: appCode_appro
        },
        data => {
            if (data) {
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    buttonVisible.call(this, props, button);
                }
                if (data.template) {
                    let meta = data.template;
                    props.meta.setMeta(meta);
                }
            }
        }
    );
}

/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/