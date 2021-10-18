/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { createPage, ajax, toast, base } from "nc-lightapp-front";
import { list, card, appCode_link, btnLimit } from "../../cons/constant.js";
import { bodyButtonClick } from "../../../public/listBodyBtnClick";
let { NCTooltip } = base;
export default function(props) {
    props.createUIDom(
        {
            pagecode: list.pageCode_link, //页面code
            appcode: appCode_link
        },
        data => {
            if (data) {
                if (data.template) {
                    let meta = data.template;
                    let src = props.getUrlParam("scene");
                    if ("fip" == src) {
                        //将联查标志加入缓存
                        setDefData(linkdataSource,islink, true);
                    }
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
        let scene = props.getUrlParam("scene");
        if (item.attrcode == "vbillno") {
            item.render = (text, record, index) => {
                return (
                    <NCTooltip placement="top">
                        <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                go2CardCheck({
									props,
									url: gotocardcheck,
									pk: record[pkName].value,
									ts: record["ts"].value,
									checkTS: false,
									fieldPK: pkName,
									go2CardFunc: () => {
                                        props.pushTo("/card", {
                                            status: "browse",
                                            id: record[this.primaryId].value,
                                            pagecode: card.pageCode_link,
                                            scene,
                                            islisttocard: "islisttocard"
                                        });
									}
								})
                               
                                props.setUrlParam({
                                    scene: "linksce",
                                    ntbparadimvo: this.ntbparadimvo
                                });
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