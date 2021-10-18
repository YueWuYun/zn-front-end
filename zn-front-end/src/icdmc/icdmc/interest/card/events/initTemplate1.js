/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { appCode, card, btnLimit } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { initData, getCardData } from "../../../public/cardEvent";
import { tabButtonClick } from "./tabButtonClick";
export default function(props) {
    props.createUIDom(
        {
            pagecode: card.pageCode, //页面id
            appcode: appCode
        },
        data => {
            if (data) {
                //console.log(data);
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    buttonVisible.call(this, props, button);
                    //单条联查时 才会进入此initTemplete 设置没有返回按钮
                    props.BillHeadInfo.setBillHeadInfoVisible({
                        showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                    });
                    
                }
                if (data.template) {
                    let meta = data.template;
                    //console.warn(meta);
                    meta = modifierMeta.call(this, meta);
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
function modifierMeta(meta) {
    for (let item of Object.keys(meta.gridrelation)) {
        meta[item].items.push({
            attrcode: "opr",
            label: this.state.json['36360FCIB-000003'],/* 国际化处理： 操作*/
            fixed: "right",
            itemtype: "customer",
            className: "table-opr",
            visible: true,
            width: "210px",
            render: (text, record, index) => {
                let buttonAry =
                    this.props.getUrlParam("status") == "browse"
                        ? [record.expandRowStatus ? "fold" : "unfold"]
                        : [];
                return this.props.button.createOprationButton(buttonAry, {
                    area: "tabs_body",
                    buttonLimit: btnLimit,
                    onButtonClick: (props, key) =>
                        tabButtonClick.call(
                            this,
                            props,
                            key,
                            text,
                            record,
                            index
                        )
                });
            }
        });
    }
    return meta;
}
/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/