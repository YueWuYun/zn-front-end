/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from "nc-lightapp-front";
let { NCPopconfirm } = base;
import { tabs, appCode, btnLimit, card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { tabButtonClick } from "./tabButtonClick";
import {
    initData,
    renderTrycalData,
    getCardData
} from "../../../public/cardEvent";
export default function(props) {
    props.createUIDom(
        {
            pagecode: card.pageCode, //页面id
            appcode: props.getUrlParam('c')
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
                    console.warn(meta);
                    meta = modifierMeta.call(this, meta);
                    props.meta.renderTabs(
                        meta,
                        this.tabOrder,
                        this.tabShow,
                        initData.bind(this, this.props)
                    );
                    orgVersionView(this.props, "header");
                    // 试算结果利息清单弹窗渲染数据
                    if (props.modalLink) {
                        renderTrycalData.call(this);
                    }else {
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
        }
    );
}
function modifierMeta(meta) {
    for (let item of Object.keys(meta.gridrelation)) {
        meta[item].items.push({
            attrcode: "opr",
            label: this.state.json['36362IRPR-000003'],/* 国际化处理： 操作*/
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

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/