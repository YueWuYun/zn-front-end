/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { buttonVisible } from "./buttonVisible";
import { afterEventEdit } from "./afterEvent";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { pageClick, getCardData } from "./page";
import { card,appCode } from '../../cons/constant';
const { headCode, form02 }  = card;
export default function(props) {
    props.createUIDom(
        {
            pagecode: this.pageId, //页面id
            //appcode: appCode
        },
        data => {
            if (data) {
                //console.log(data, "data");
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button, () => {
                        props.button.setPopContent(
                            "delete",
                            this.state.json["36340DV-000004"]
                        ); /* 国际化处理： 确认要删除吗?*/
                    });
                    buttonVisible.call(this, props, button);
                }
                if (data.template) {
                    let meta = data.template;
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
                            }else if(props.getUrlParam('status') == 'edit') {
                                this.qryData();
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
                        //listAddOperation.call(this, props);
                    }
                }

            }
        }
    );
}

function modifierMeta(props, meta) {
    meta[this.formId].items.map(item => {
        if (item.attrcode == "pk_org") {
            item.isShowDisabledData =false;
			item.isTreelazyLoad = false;
            item.queryCondition = () => {
                return {
                    funcode: appCode,
                    TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
                };
            };
        }
    });
    //财务组织:全加载
    meta[this.formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
    //参照过滤
    meta[headCode].items.map((item) => {
        switch (item.attrcode){
            case 'pk_depositrate': // 定期利率
                item.queryCondition = () => {
                    //let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
                    // let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
                    return {
                        //pk_org: pk_org,
                        // pk_currtype: pk_currtype,
                        isDisableDataShow: false,//默认只加载启用的账户
                        noConditionOrg: 'N',
                        refnodename: '使用权参照',
                        billtype: '36L1',
                        GridRefActionExt: 'nccloud.web.fac.bankregularset.filter.BankRegularsetDepositrateFilter' //自定义增加的过滤条件	
                    };
                };
                break;
            case 'pk_aiacrate': // 活期利率
                item.queryCondition = () => {
                    //let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
                    return {
                        //pk_org: pk_org,
                        isDisableDataShow: false,//默认只加载启用的账户
                        noConditionOrg: 'N',
                        refnodename: '使用权参照',
                        billtype: '36L1',
                        GridRefActionExt: 'nccloud.web.fac.bankregularset.filter.BankRegularsetAiacrateFilter' //自定义增加的过滤条件	
                    };
                };
                break;

        }

    });
    // 是否显示历史记录
	// meta[form02].items.find((e) => e.attrcode === 'pk_creditorg').showHistory = false;
	// meta[form02].items.find((e) => e.attrcode === 'unitdebitaccount').showHistory = false;
    // meta[form02].items.find((e) => e.attrcode === 'creditaccount').showHistory = false;
    // meta[form02].items.find((e) => e.attrcode === 'innercreditaccount').showHistory = false;
    return meta;
}
export function listAddOperation(props) {
    let data = props.createFormAfterEventData(card.pageCode, card.headCode);
    // let data = props.form.getAllFormValue(card.headCode);
    // form.getAllFormValue
    ajax({
        url: '/nccloud/fac/bankregularset/addafterevent.do',
        data: data,
        success: (res) => {
            if (res.success) {
                props.form.setAllFormValue({ [card.headCode]: res.data[card.headCode] });
            }
        }

    });
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/