/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from "nc-lightapp-front";
import { appCode, btnLimit, card } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { tabButtonClick } from "./tabButtonClick";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { afterEvent } from "../../card/events/afterEvent";
import { initData, getCardData } from "../../../public/cardEvent";
export default function (props) {
    props.createUIDom(
        {
            pagecode: card.pageCode, //页面id
            appcode: props.getUrlParam("c")//动态获取appcode
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
                    meta = modifierMeta.call(this, meta);
                    props.meta.renderTabs(
                        meta,
                        this.tabOrder,
                        this.tabShow,
                        initData.bind(this, this.props)
                    );
                    if (this.props.getUrlParam("id")) {
                        getCardData.call(
                            this,
                            this.cardUrl,
                            String(this.props.getUrlParam("id")),
                            true
                        );
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
                        props.resMetaAfterPkorgEdit();
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
                    debugger;
                    let sourceid2=props.getUrlParam('sourceid2');
						if(sourceid2!=null){
                            debugger;
							ajax({
								//资金上收单生成内贷还本单
								url:'/nccloud/icdmc/repayprcpl/DeliveryToRepayPrcplAction.do',  
								data: {
									"pks": [sourceid2],
								 },
								success: (res) => {
									if(res.data){
										if (res.data.head) {
											that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });									
											that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true});							
										}
										if (res.data.body) {
											that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
											that.props.button.setButtonVisible(['addline','deleteline','copyline'], false);
										}
									}else{
										toast({
											color: 'warning',
											content: loadMultiLang(this.props, '36320FDA-000037'), //{/* 国际化处理： 未查询出符合条件的数据！*/}
										});
									}
								}
							})  
							//数据来源内部定期存入申请单后恢复字段可编辑
							that.props.resMetaAfterPkorgEdit();
							
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
            label: this.state.json["36360IRP-000016"],/* 国际化处理： 操作*/
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
    meta['header'].items.map(item => {
        //发送发组织，接收方组织：根据用户权限过滤
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: this.props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter"//资金组织过滤
                };
            };
        }
        // 放款单根据组织过滤
        if (item.attrcode == "pk_financepay") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: data, repaytype: "prcpl" };
            };
        }
        // 计划项目根据组织过滤
        if (item.attrcode == "pk_repayplanitem") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: data };
            };
        }
        //外汇账户根据外汇币种过滤
        if (item.attrcode == "pk_exbankacc") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_excurrtpe"
                ).value;
                return { pk_excurrtpe: data };
            };
        }
        // 单位银行账户-->根据金融机构过滤
        if (item.attrcode == "pk_loanbankacc") {
            item.queryCondition = () => {
                let data = null;
                let pk_fundorg = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;//资金组织
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "financecorpid"
                ).value;//借款单位
                let pk_currtype = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_currtype"
                ).value;//币种
                return {
                    type: data, pk_org: pk_org, pk_currtype: pk_currtype, pk_fundorg: pk_fundorg,
                    GridRefActionExt: "nccloud.web.icdmc.icdmc.financepay.filter.PkBillTypeBankAccFilterForNCC"
                };
            };
        }
        //贷款账户
        if (item.attrcode == "loanaccount") {
            item.queryCondition = () => {
                let data = null;
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                let pk_currtype = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_currtype"
                ).value;
                return {
                    type: data, pk_org: pk_org, pk_currtype: pk_currtype, banktype: "OUT",
                    GridRefActionExt: "nccloud.web.icdmc.icdmc.financepay.filter.PkBillTypeBankAccFilterForNCC"
                };
            };
        }
        //单位内部账户 过滤活期账户<忽略此账户>
        // if (item.attrcode == "pk_innerdueaccount") {
        //     item.queryCondition = () => {
        //         let pk_org = this.props.form.getFormItemsValue(
        //             this.formId,
        //             "financecorpid"
        //         ).value;//借款单位
        //         let pk_currtype = this.props.form.getFormItemsValue(
        //             this.formId,
        //             "pk_currtype"
        //         ).value;
        //         return {
        //             billtype: '0', pk_ownerorg: pk_org, pk_currtype: pk_currtype,
        //             GridRefActionExt: 'nccloud.web.icdmc.icdmc.financepay.filter.PkBillTypeInnerAccFilterForNCC'
        //         };
        //     };
        // }
        //内部贷款账户 过滤贷款账户
        if (item.attrcode == "pk_innerloanaccount") {
            item.queryCondition = () => {
                let pk_fundorg = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;//资金组织
                return {
                    billtype: '4',
                    pk_org: pk_fundorg,
                    pk_ownerorg: (this.props.form.getFormItemsValue(this.formId, 'financecorpid') || {}).value,
                    pk_currtype: (this.props.form.getFormItemsValue(this.formId, 'pk_currtype') || {}).value,
                    GridRefActionExt: 'nccloud.web.icdmc.icdmc.financepay.filter.PkBillTypeInnerAccFilterForNCC'
                };
            };
        }
    });
    // 还款计划根据放款编号过滤
    meta["repayPrcplPlan"].items.map(item => {
        //还款计划编号
        if (item.attrcode == "pk_repayplan") {
            // item.isMultiSelectedEnabled=true;
            item.queryCondition = () => {
                let data =
                    this.props.form.getFormItemsValue(
                        this.formId,
                        "pk_financepay"
                    ) &&
                    this.props.form.getFormItemsValue(
                        this.formId,
                        "pk_financepay"
                    ).value; // 调用相应组件的取值API
                return { pk_financepay: data }; // 过滤
            };
        }
    });
    return meta;
}
// 模板初始化设置编辑性及其他
function templateCallback(props, meta) {
    let status = props.getUrlParam("status");
    if (status === "add") {
        // 初始化编辑性
        // props.initMetaByPkorg();
    } else {
        props.form.setFormItemsDisabled(this.formId, {
            pk_org: true //组织
        });
    }
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/