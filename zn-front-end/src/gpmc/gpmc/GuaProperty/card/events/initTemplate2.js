/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/
import { card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";

export default function(props) {
    let appCode_appro = props.getSearchParam("c") || props.getUrlParam("c");
    let scene = this.props.getUrlParam("scene");
    let pageCode = card.pageCode_appro;
    if (scene === "linksce") pageCode = props.getUrlParam("pagecode");
    props.createUIDom(
        {
            pagecode: pageCode, //页面id
            appcode: appCode_appro
        },
        data => {
            if (data) {
                console.log(data, "data");
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

/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/