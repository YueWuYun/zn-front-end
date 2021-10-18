/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from "nc-lightapp-front";
let { NCPopconfirm } = base;
import { tabs, appCode, btnLimit, card, card_from_id} from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { tabButtonClick } from "./tabButtonClick";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { afterEvent } from "../../card/events/afterEvent";
import { initData, getCardData } from "../../../public/cardEvent";
export default function(props) {
     //zth
    let that = this;
    props.createUIDom(
        {
            pagecode: card.pageCode, //页面id
            appcode: props.getUrlParam('c')
        },
        data => {
            if (data) {
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    // if (props.getUrlParam("status") == "add") {
                    //     props.button.setButtonDisabled(card.disabled_btn, true);
                    // }
                    buttonVisible.call(this, props, button);
                }
                if (data.template) {
                    let meta = data.template;
                    meta = modifierMeta.call(this, meta);
                    // props.meta.renderTabs(
                    //     meta,
                    //     this.tabOrder,
                    //     this.tabShow,
                    //     initData.bind(this, this.props)
                    // );
                    if (this.props.getUrlParam("id")) {
                        getCardData.call(
                            this,
                            this.cardUrl,
                            String(this.props.getUrlParam("id")),
                            true
                        );
                    }
                    props.meta.setMeta(meta);
                    templateCallback.call(this, props, meta);
                    orgVersionView(this.props, card.headCode);

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
                // if (data.context && props.getUrlParam("status") === "edit") {
                //     props.initMetaByPkorg();
                //     props.form.setFormItemsDisabled(this.formId, this.editdisabled);
                    
                // }
                let sourceids=props.getUrlParam('sourceids');
						if(sourceids!=null){
							ajax({
								//资金上收单生成内贷付息单
								url:'/nccloud/icdmc/repayintst/DeliveryToRepayIntstAction.do', 
								data: {
									"pks": [sourceids],
								 },
								success: (res) => {
                                    debugger;
									if(res.data){
										if (res.data.head) {
											that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });					
											that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true});								
										}
										//  if (res.data.body) {
										//  	that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
										//  	that.props.button.setButtonVisible(['addline','deleteline','copyline'], false);
										//  }
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
    );
}
function modifierMeta(meta) {
    for (let item of Object.keys(meta.gridrelation)) {
        meta[item].items.push({

            attrcode: "opr",
            label: this.state.json['36360IPI-000009'],/* 国际化处理： 操作*/
            itemtype: "customer",
            fixed: "right",
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

    meta[card.headCode].items.map(item => {
        //发送发组织，接收方组织：根据用户权限过滤
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: this.props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FundOrgPermissionFilter"
                };
            };
        }
        // 放款单根据组织过滤
        if (item.attrcode == "pk_innerloanpay") {
            item.queryCondition = () => {
                let data = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: data, repaytype: "intst" };
            };
        }
      
        // 资金计划项目
        if (item.attrcode == "pk_fundplan") {
            item.queryCondition = () => {
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                return { pk_org: pk_org };
            };
        }
        // 付息账户（单位银行账户）根据借款单位过滤
        if (item.attrcode == "loanunitid") {
            item.queryCondition = () => {
                let pk_fundorg = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_org"
                ).value;
                let data = null;
                let pk_org = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_debitunit"
                ).value;
                let pk_currtype = this.props.form.getFormItemsValue(
                    this.formId,
                    "pk_currtype"
                ).value;
                return {
                    type: data, pk_org: pk_org, pk_currtype: pk_currtype, pk_fundorg: pk_fundorg, 
                    GridRefActionExt: "nccloud.web.icdmc.icdmc.financepay.filter.PkBillTypeBankAccFilterForNCC"
                };
            };
        }
        //贷款账户
        if (item.attrcode == "loanaccount") {
            item.queryCondition = () => {
                // let data = this.props.form.getFormItemsValue(
                //     this.formId,
                //     "fininstitutionid"
                // ).value;
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
                    type: data, pk_org: pk_org, pk_currtype: pk_currtype,banktype: "OUT",
                    GridRefActionExt: "nccloud.web.icdmc.icdmc.financepay.filter.PkBillTypeBankAccFilterForNCC"
                };
            };
        }
        //单位内部账户 过滤活期账户
        // if (item.attrcode == "fininstitutionid") {
        //     item.queryCondition = () => {
        //         let pk_org = this.props.form.getFormItemsValue(
        //             this.formId,
        //             "pk_debitunit"
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
        // if (item.attrcode == "subfinstitutionid") {
        //     item.queryCondition = () => {
        //         let pk_org = this.props.form.getFormItemsValue(
        //             this.formId,
        //             "financorgid"
        //         ).value;//贷款单位
        //         if (!pk_org) {
        //             pk_org = this.props.form.getFormItemsValue(
        //                 this.formId,
        //                 "pk_debitunit"
        //             ).value;//借款单位
        //         }
        //         let pk_currtype = this.props.form.getFormItemsValue(
        //             this.formId,
        //             "pk_currtype"
        //         ).value;
        //         return {
        //             billtype: '4', pk_ownerorg: pk_org, pk_currtype: pk_currtype,
        //             GridRefActionExt: 'nccloud.web.icdmc.icdmc.financepay.filter.PkBillTypeInnerAccFilterForNCC'
        //         };
        //     };
        // }
    });
    return meta;
}
// 模板初始化设置编辑性及其他
function templateCallback(props, meta) {
    let status = props.getUrlParam("status");
    if (status === "add") {
        // 初始化编辑性
        props.initMetaByPkorg();
        // 初始化页签显示
    } else if (status === "edit"){
        props.form.setFormItemsDisabled(this.formId, this.editdisabled);
    } else {
        props.form.setFormItemsDisabled(this.formId, {
            pk_org: true //组织
        });
    }
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/