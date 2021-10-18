/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { buttonVisible } from "./buttonVisible";
import { afterEventEdit } from "./afterEvent";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { pageClick, getCardData } from "./page";
import { card, appCode } from '../../cons/constant';
import { excelImportconfig } from 'nc-lightapp-front';
const { headCode, form02 } = card;
export default function (props) {
    let excelimportconfig = excelImportconfig(props, "ifac", '36E8', true, "",
        { "appcode": appCode, "pagecode": card.pageCode });
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
                            this.state.json["36140FDLI-000004"]
                        ); /* 国际化处理： 确认要删除吗?*/
                    });
                    buttonVisible.call(this, props, button);
                    props.button.setUploadConfig("ImportData", excelimportconfig);
                }
                if (data.template) {
                    let meta = data.template;
                    meta = modifierMeta.call(this, props, meta);
                    props.meta.setMeta(meta);

                    if (props.getUrlParam('status') != 'add') {
                        if (this.props.getUrlParam("id")) {
                            if (props.getUrlParam('status') == 'copy') {
                                getCardData.call(
                                    this,
                                    this.cardCopyUrl,
                                    String(this.props.getUrlParam("id")),
                                    true
                                );
                            }else if (props.getUrlParam('status') == 'edit') {
                                getCardData.call(
                                        this,
                                        '/nccloud/ifac/bankfixdepositopening/editqry',
                                        String(this.props.getUrlParam("id")),
                                        true
                                    );
                                } else {
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
    //财务组织:全加载
    meta[this.formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
    //参照过滤
    meta[headCode].items.map((item) => {
        switch (item.attrcode) {
            //财务组织过滤
            case 'pk_org':
                item.isTreelazyLoad = false;
                item.queryCondition = () => {
                    return {
                        funcode: appCode,
                        TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
                    };
                };
				break;
            case 'pk_depositacc': // 定期账户
                item.queryCondition = () => {
                    // 财务组织
                    let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
                    //币种
                    let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
                    //存款日期
                    let depositdate = props.form.getFormItemsValue(this.formId, 'depositdate').value;
                    //存入银行
                    let pk_depositbank = props.form.getFormItemsValue(this.formId, 'pk_depositbank').value;
                    return {
                        pk_org: pk_org,
                        pk_currtype: pk_currtype,
                        depositdate: depositdate,
                        pk_depositbank: pk_depositbank,
                        isDisableDataShow: false,//默认只加载启用的账户
                        noConditionOrg: 'N',
                        refnodename: '使用权参照',
                        billtype: '36E8',
                        GridRefActionExt: 'nccloud.web.fac.bankfixdepositopening.filter.BankFixdepositOpeningObjFilter' //自定义增加的过滤条件	
                    };
                };
                break;
            case 'pk_settleacc': // 结算账户
                item.queryCondition = () => {
                    let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
                    let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
                    let depositdate = props.form.getFormItemsValue(this.formId, 'depositdate').value;
                    //存入银行
                    let pk_depositbank = props.form.getFormItemsValue(this.formId, 'pk_depositbank').value;
                    return {
                        pk_org: pk_org,
                        pk_currtype: pk_currtype,
                        depositdate: depositdate,
                        pk_depositbank: pk_depositbank,
                        isDisableDataShow: false,//默认只加载启用的账户
                        noConditionOrg: 'N',
                        refnodename: '使用权参照',
                        billtype: '36E8',
                        GridRefActionExt: 'nccloud.web.fac.bankfixdepositopening.filter.BankFixdepositOpeningSettleaccjFilter' //自定义增加的过滤条件	
                    };
                };
                break;
            case 'businessvariety': // 业务品种
                item.queryCondition = () => {
                    let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
                    return {
                        pk_currtype: pk_currtype,
                        GridRefActionExt: 'nccloud.web.fac.bankfixdepositopening.filter.BankFixdepositOpeningBusinessvarietyFilter' //自定义增加的过滤条件	
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

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/