/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax, getBusinessInfo } from "nc-lightapp-front";
let { NCPopconfirm } = base;
import { tabs, appCode, btnLimit, card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { tabButtonClick } from "./tabButtonClick";
import { setChangeDisable } from "./buttonClick";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
// import CCCProtocolGridRef from "../../../../../ccc/refer/ccc/CCCProtocolGridRef";
import CreditOrgListRef from "../../../../../tmpub/refer/tmbd/CreditOrgListRef";
import { afterEvent } from "../../card/events/afterEvent";
import { initData, getCardData, setEditStatus } from "../../../public/cardEvent";

export default function (props) {
    props.createUIDom(
        {
            pagecode: card.pageCode //页面id
        },
        data => {
            if (data) {
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    if (props.getUrlParam("status") == "add") {
                        props.button.setButtonDisabled(card.disabled_btn, true);
                    }
                    buttonVisible.call(this, props, button);
                }
                if (data.template) {
                    let meta = data.template;
                    meta = modifierMeta.call(this, meta, props);
                    props.meta.renderTabs(
                        meta,
                        this.tabOrder,
                        this.tabShow,
                        initData.bind(this, this.props)
                    );
                    let id = props.getUrlParam("id");
                    if (id) {
                        if (props.getUrlParam("status") === "copy") {
                            setEditStatus.call(this, "add");
                            getCardData.call(
                                this,
                                this.copyUrl,
                                String(id),
                                true
                            );
                        } else {
                            getCardData.call(
                                this,
                                this.cardUrl,
                                String(id),
                                true
                            );
                        }
                    }
                    templateCallback.call(this, props, meta);
                    orgVersionView(this.props, "header");
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
                        afterEvent.call(this, props, this.formId, "pk_org", {
                            display: org_Name,
                            value: pk_org
                        });
                    } else {
                        props.initMetaByPkorg();
                    }
                }
            }
        }
    );
}
function modifierMeta(meta, props) {
    //console.log(this);
    let businessInfo = getBusinessInfo();
    const guaratypeMap = {
        WARRANT: { display: this.state.json['36630BLC-000010'], value: 1 },/* 国际化处理： 保证*/
        GUARANTY: { display: this.state.json['36630BLC-000011'], value: 2 },/* 国际化处理： 抵押*/
        PLEDGE: { display: this.state.json['36630BLC-000012'], value: 3 },/* 国际化处理： 质押*/
        MIXED: { display: this.state.json['36630BLC-000013'], value: 4 }/* 国际化处理： 混合*/
    };
    for (let item of Object.keys(meta.gridrelation)) {
        meta[item].items.push({
            attrcode: "opr",
            label: this.state.json['36630BLC-000014'],/* 国际化处理： 操作*/
            fixed: "right",
            itemtype: "customer",
            className: "table-opr",
            visible: true,
            render: (text, record, index) => {
                let buttonAry =
                    this.props.getUrlParam("status") == "browse"
                        ? [record.expandRowStatus ? "fold" : "unfold"]
                        : this.props.getUrlParam("status") == "change" &&
                            (item == "payplan" ||
                                item == "repayrule" ||
                                item == "syndicatedloan")
                            ? [record.expandRowStatus ? "fold" : "unfold"]
                            : ["cela", "insertRow", "delRow"];
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
    // 过滤参照header_rate
    meta.header.items.map(item => {
        //资金组织
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: this.props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter,nccloud.web.icdmc.icdmc.financepay.filter.PkOrgFilterForNCC"
                };
            };
        }
        //借款单位
        if (item.attrcode == "pk_financorg") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_fundpayorg: this.props.form.getFormItemsValue(
                        this.formId,
                        "pk_org"
                    ).value,
                    TreeRefActionExt: "nccloud.web.tmpub.filter.FundFinanceOrgRelationFilter"
                };
            };
        }
        // 金融机构根据组织过滤
        if (item.attrcode == "financorganization") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: data };
            };
        }
        // 申请编号根据组织过滤
        if (item.attrcode == "applyno") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: data };
            };
        }
        // 账户根据金融机构过滤
        if (item.attrcode == "bankaccbasid") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "financorganization"
                ).value;
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { type: data, pk_org: pk_org };
            };
        }
        // 利率根据组织过滤
        if (item.attrcode == "rateid") {
            item.queryCondition = () => {
                return {
                    pk_org: (this.props.form.getFormItemsValue(this.formId, "pk_org") || {}).value,
                    pk_group: (this.props.form.getFormItemsValue(this.formId, "pk_group") || {}).value,
                    ratetype: "LRATE",
                    revisedate: (this.props.form.getFormItemsValue(this.formId, "begindate") || {}).value,
                    GridRefActionExt: "nccloud.web.tmpub.tmbd.ratecode.action.RateGridRef"
                };
            };
        }
        // 项目根据组织过滤
        if (item.attrcode == "projectid") {
            item.queryCondition = () => {
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: pk_org };
            };
        }
        // 融资品种根据大类过滤
        if (item.attrcode == "transacttype") {
            item.queryCondition = () => {
                return { variety_category: "BANK,TRUST,OTHER_FINANCIAL_COMPANIES", type: "1" };
            };
        }
        if (item.attrcode == "unitdebitaccount") {// 单位借款账号
            item.queryCondition = () => {
                return {
                    pk_org: (props.form.getFormItemsValue(this.formId, 'pk_financorg') || {}).value,
                    pk_currtype: (props.form.getFormItemsValue(this.formId, 'pk_currtype') || {}).value,
                    pk_fundorg: (props.form.getFormItemsValue(this.formId, 'pk_org') || {}).value,
                    noConditionOrg: 'N',
                    refnodename: '使用权参照',
                    GridRefActionExt: 'nccloud.web.icdmc.ref.ICDMCRecBillBankaccSubDefaultGridRefSqlBuilder' //自定义增加的过滤条件	
                };
            }
        }
        if (item.attrcode == "creditaccount") {// 贷款账号
            item.queryCondition = () => {
                return {
                    pk_org: (props.form.getFormItemsValue(this.formId, 'pk_org') || {}).value,
                    pk_currtype: (props.form.getFormItemsValue(this.formId, 'pk_currtype') || {}).value,
                    noConditionOrg: 'N',
                    refnodename: '使用权参照',
                    GridRefActionExt: 'nccloud.web.icdmc.ref.ICDMCBankAccountDefaultGridRefSqlBuilder' //自定义增加的过滤条件	
                };
            }
        }
        if (item.attrcode == "innercreditaccount") {// 内部贷款账号
            item.queryCondition = () => {
                return {
                    billtype: '4',//贷款
                    pk_ownerorg: (props.form.getFormItemsValue(this.formId, 'pk_financorg') || {}).value,
                    pk_currtype: (props.form.getFormItemsValue(this.formId, 'pk_currtype') || {}).value,
                    pk_org: (props.form.getFormItemsValue(this.formId, 'pk_org') || {}).value,
                    GridRefActionExt: 'nccloud.web.icdmc.icdmc.financepay.filter.PkBillTypeInnerAccFilterForNCC'
                };
            }
        }
        if (item.attrcode.startsWith('vdef')) {
            item.queryCondition = () => {
                return {
                    pk_org: (props.form.getFormItemsValue(this.formId, 'pk_org') || {}).value
                };
            };
        }

    });
    // 过滤参照
    meta.header_rate.items.map(item => {
        // 利率根据组织过滤
        if (item.attrcode == "rateid") {
            item.queryCondition = () => {
                return {
                    pk_org: (this.props.form.getFormItemsValue(this.formId, "pk_org") || {}).value,
                    pk_group: (this.props.form.getFormItemsValue(this.formId, "pk_group") || {}).value,
                    ratetype: "LRATE",
                    revisedate: (this.props.form.getFormItemsValue(this.formId, "begindate") || {}).value,
                    GridRefActionExt: "nccloud.web.tmpub.tmbd.ratecode.action.RateGridRef"
                };
            };
        }
        if (item.attrcode == 'returnmode') {//还本方式
            item.queryCondition = () => {
                return {
                    isinterestfirst: (props.form.getFormItemsValue(this.formId, 'isinterestfirst') || {}).value,
                    isinner: true,
                    GridRefActionExt: 'nccloud.web.tmpub.ref.tmbd.RepaymentMethodGridRef' //自定义增加的过滤条件	
                };
            }
        }

        // 结息日参照根据还款方式过滤 结息日周期
        if (item.attrcode == "iadate") {
            item.queryCondition = () => {
                return {
                    pk_repaymentmethod: (props.form.getFormItemsValue(this.formId, "returnmode") || {}).value
                };
            };
        }
    });
    //授信协议信息参照过滤
    meta.header_innerprotocol.items.map(item => {
        if (item.attrcode == "pk_incprotocol") {// 授信协议
            item.queryCondition = () => {
                return {
                    pk_creditorg: (props.form.getFormItemsValue(this.formId, 'pk_financorg') || {}).value,
                    pk_org: (props.form.getFormItemsValue(this.formId, 'pk_org') || {}).value,
                    pk_currtype: (props.form.getFormItemsValue(this.formId, 'pk_currtype') || {}).value,
                    GridRefActionExt: 'nccloud.web.icdmc.icdmc.contract.filter.ContractInnerprotocolRefFilter'
                };
            }
        }
    });
    return meta;
}

// 模板初始化设置编辑性及其他
function templateCallback(props, meta) {
    let status = props.getUrlParam("status");
    if (status == "add") {
        // 初始化编辑性
        // props.initMetaByPkorg();
    } else if (status == "change") {
        // 设置变更可编辑性
        setChangeDisable.call(this, props);
    } else {
        props.form.setFormItemsDisabled(this.formId, {
            pk_org: true //组织
        });
    }
}




/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/