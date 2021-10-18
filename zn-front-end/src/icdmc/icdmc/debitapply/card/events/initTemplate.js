/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
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
                            this.state.json["36362IDA-000004"]
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

function modifierMeta(props, meta) {
    meta[this.formId].items.map(item => {
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
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
    meta[form02].items.map((item) => {
        switch (item.attrcode){
            case 'unitdebitaccount': // 单位借款账号
                item.queryCondition = () => {
				let pkorg = props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
				// let bill_date = props.form.getFormItemsValue(this.formId, 'billdate').value;//单据日期，业务日期
				return { 
					pk_org: pkorg,
					// bill_date:bill_date,
					pk_currtype: pk_currtype,
					// pk_bankdoc: transformoutbank,
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'N',
					refnodename: '使用权参照',
					GridRefActionExt: 'nccloud.web.icdmc.ref.ICDMCRecBillBankaccSubDefaultGridRefSqlBuilder' //自定义增加的过滤条件	
				    };
			    };
                break;
            case 'creditaccount': // 贷款账号
                item.queryCondition = () => {
                    // 贷款单位
                    let pk_creditorg = props.form.getFormItemsValue(this.formId, 'pk_creditorg').value;
				    let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
                    return {
                        pk_org: pk_creditorg,
                        pk_currtype: pk_currtype,
                        isDisableDataShow: false,//默认只加载启用的账户
					    noConditionOrg: 'N',
                        refnodename: '使用权参照',
                        GridRefActionExt: 'nccloud.web.icdmc.ref.ICDMCBankAccountDefaultGridRefSqlBuilder' //自定义增加的过滤条件	
                    };
                };
                break;
            case 'innercreditaccount': // 内部贷款账号
                item.queryCondition = () => {
                    let creditorg = props.form.getFormItemsValue(this.formId, 'pk_creditorg').value;
				    let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
                    return {
                        pk_org: creditorg,
					    pk_currtype: pk_currtype,
                    };
                };
                break;
            case 'pk_creditorg': // 贷款单位
                item.queryCondition = () => {
                    return {
                        funcode: props.getSearchParam("c"), //appcode获取
                        pk_creditorg: this.props.form.getFormItemsValue(
                            this.formId,
                            "pk_org"
                        ).value, 
                        TreeRefActionExt:"nccloud.web.tmpub.filter.CreditOrgFinanceRelationFilter,nccloud.web.icdmc.icdmc.financepay.filter.PkOrgFilterForNCC"
                        //    nccloud.web.tmpub.filter.FundOrgPermissionFilter,nccloud.web.icdmc.icdmc.financepay.filter.PkOrgFilterForNCC
                    };
                };
                break;

        }

    });
    // 是否显示历史记录
	meta[form02].items.find((e) => e.attrcode === 'pk_creditorg').showHistory = false;
	meta[form02].items.find((e) => e.attrcode === 'unitdebitaccount').showHistory = false;
    meta[form02].items.find((e) => e.attrcode === 'creditaccount').showHistory = false;
    meta[form02].items.find((e) => e.attrcode === 'innercreditaccount').showHistory = false;
    return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/