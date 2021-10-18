/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from "nc-lightapp-front";
let { NCPopconfirm } = base;
import { tabs, appCode, btnLimit, card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { tabButtonClick } from "./tabButtonClick";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { afterEvent } from "../../card/events/afterEvent";
import { initData, getCardData } from "../../../public/cardEvent";
export default function(props) {
    props.createUIDom(
        {
            pagecode: card.pageCode, //页面id
            appcode: props.getUrlParam('c')
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
                    meta = modifierMeta.call(this, meta);
                    if (this.props.getUrlParam("id")) {
                        getCardData.call(
                            this,
                            this.cardUrl,
                            String(this.props.getUrlParam("id")),
                            true
                        );
                    }
                    props.meta.setMeta(meta);
                    orgVersionView(this.props, card.headCode);

                }
            }
        }
    );
}
function modifierMeta(meta) {

    return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/