/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { appCode, card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { initData, getCardData } from "../../../public/cardEvent";
export default function(props) {
    props.createUIDom(
        {
            pagecode: card.pageCode_link, //页面id
            appcode: appCode
        },
        data => {
            if (data) {
                //console.log(data);
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    buttonVisible.call(this, props, button);
                }
                if (data.template) {
                    let meta = data.template;
                    //console.warn(meta);
                    props.meta.renderTabs(
                        meta,
                        this.tabOrder,
                        this.tabShow,
                        initData.bind(this, this.props)
                    );
                    // 试算结果利息清单弹窗渲染数据
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

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/