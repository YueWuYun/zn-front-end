/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { base } from "nc-lightapp-front";
import { list, card, appCode, btnLimit, baseReqUrl, javaUrl } from "../../cons/constant.js";
import { linkVoucher } from "../../../public/cardEvent";
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
let { NCTooltip } = base;
export default function (props) {
    props.createUIDom(
        {
            pagecode: list.pageCode_link, //页面code
            appcode: appCode_link
        },
        data => {
            if (data) {
                if (data.template) {
                    let meta = data.template;
                    //凭证反联查单据
                    linkVoucher.call(this, props, "repayprcpl");
                    meta = modifierMeta.call(this, props, meta);
                    props.meta.setMeta(meta);
                }
                if (data.button) {
                    /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
                    let button = data.button;
                    props.button.setButtons(button);
                }
            }
        }
    );
}

function modifierMeta(props, meta) {
    meta[this.tableId].pagination = true;
    meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
        // item.width = 150;
        if (item.attrcode == "vbillno") {
            item.render = (text, record, index) => {
                return (
                    <NCTooltip placement="top">
                        <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {

                                //列表跳转卡片检查
                                go2CardCheck({
                                    props,
                                    url: `${baseReqUrl}${javaUrl.gotocardcheck}.do`,
                                    pk: record[this.primaryId].value,
                                    ts: record["ts"].value,
                                    checkTS: false,
                                    checkSaga: false,
                                    fieldPK: this.primaryId,
                                    go2CardFunc: () => {
                                        props.pushTo("/card", {
                                            status: "browse",
                                            id: record[this.primaryId].value,
                                            pagecode: card.pageCode_link,
                                            ntbparadimvo: this.ntbparadimvo
                                        });
                                    }
                                })

                            }}
                        >
                            {record && record.vbillno && record.vbillno.value}
                        </a>
                    </NCTooltip>
                );
            };
        }
        return item;
    });
    return meta;
}

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/