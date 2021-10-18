/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { buttonVisible } from "./buttonVisible";
import { afterEventEdit } from "./afterEvent";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { pageClick, getCardData } from "./page";
import { card,appCode } from '../../cons/constant';
import {excelImportconfig} from 'nc-lightapp-front';
const { headCode, form02 }  = card;
export default function(props) {
    props.createUIDom(
        {
            pagecode: this.pageId, //页面id
            appcode: appCode
        },
        data => {
            if (data) {
                //console.log(data, "data");
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button, () => {
                        props.button.setPopContent(
                            "delete",
                            this.state.json["36340FDSR-000004"]
                        ); /* 国际化处理： 确认要删除吗?*/
                    });
                    buttonVisible.call(this, props, button);
                }
                if (data.template) {
                    let meta = data.template;
                    //联查场景标志
					// let src = props.getUrlParam('scene');
					// if ('fip' == src ) {
					// 	initData.call(this, props);
					// }
                    meta = modifierMeta.call(this, props, meta);
                    props.meta.setMeta(meta);

                    if(props.getUrlParam('status') != 'add'){
                        if (this.props.getUrlParam("id")) {
                            if(props.getUrlParam('status') == 'copy'){
                                getCardData.call(
                                    this,
                                    this.cardCopyUrl,
                                    String(this.props.getUrlParam("id")),
                                    true
                                );
                            }else{
                                getCardData.call(
                                    this,
                                    this.cardUrl,
                                    String(this.props.getUrlParam("id")),
                                    true
                                );
                            }
                        }
                    }
                    orgVersionView(props, this.formId);
                }
                if (data.context && props.getUrlParam("status") === "add") {
                    let {
                        pk_org,
                        pk_org_v,
                        org_Name,
                        org_v_Name
                    } = data.context;
                    if (data.context.pk_org) {
                        props.form.setFormItemsValue(this.formId, {
                            pk_org: { display: org_Name, value: pk_org },
                            pk_org_v: { display: org_v_Name, value: pk_org_v }
                        });
                        afterEventEdit.call(
                            this,
                            props,
                            this.formId,
                            "pk_org",
                            { display: org_Name, value: pk_org }
                        );
                    } else {
                        props.initMetaByPkorg();
                    }
                }

            }
        }
    );
}
// function initData(props) {
// 	//主键信息
// 	let srcid = props.getUrlParam('id');
// 	//联查场景标志
// 	let src = props.getUrlParam('scene');
// 	if ('fip' == src) {//fip代表会计平台
// 		voucherLinkBill.call(this, this.props, card.pageCode, card.headCode);
// 	} 
// }

function modifierMeta(props, meta) {
    meta[this.formId].items.map(item => {
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    // TreeRefActionExt:
                    //     "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
                };
            };
        }
        if (item.attrcode == "financepayno") {
            item.queryCondition = () => {
                return {
                    pk_org:
                        props.form.getFormItemsValue(this.formId, "pk_org") &&
                        props.form.getFormItemsValue(this.formId, "pk_org")
                            .value
                };
            };
        }
    });
    //财务组织:全加载
    meta[this.formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
    //参照过滤
    meta[headCode].items.map((item) => {
        switch (item.attrcode){
            

        }

    });
    // 是否显示历史记录
	// meta[form02].items.find((e) => e.attrcode === 'pk_creditorg').showHistory = false;
	// meta[form02].items.find((e) => e.attrcode === 'unitdebitaccount').showHistory = false;
    // meta[form02].items.find((e) => e.attrcode === 'creditaccount').showHistory = false;
    // meta[form02].items.find((e) => e.attrcode === 'innercreditaccount').showHistory = false;
    return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/