/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/
import { appCodeA, card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { getCardData } from "../../../public/cardEvent";
export default function(props) {
    props.createUIDom(
        {
            pagecode: card.pageCodeA //页面id
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
                    props.meta.renderTabs(meta, this.tabOrder, this.tabShow);
                    if (this.props.getUrlParam("id")) {
                        getCardData.call(
                            this,
                            this.cardUrl,
                            String(this.props.getUrlParam("id")),
                            true
                        );
                    }
                }
            }
        }
    );
}

/*8tKvpLXjO/RsfMOatvZzzFun1aoC/QMuQAtoqKp+Jha36m+cEHP5Xem7YlRM4BeP*/