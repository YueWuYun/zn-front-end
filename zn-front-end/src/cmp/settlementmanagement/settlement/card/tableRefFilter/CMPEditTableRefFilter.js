/*a39GmAMpq59M1ausScvNpYqznVdZ7f3l7EE27yEu/UILr6W/YNyq1TzPnn/TXZbkLVZkTpfbCFO8
mUW3dw5Rag==*/
import { ajax } from "nc-lightapp-front";
import { NoteTypeHandle } from "../../util/ReferChangeEvent.js";
import { DirectEcdsEdit } from "../buttonClick/EditControlUtil.js";
/**
 * 卡片态表体字段过滤 以及 代码控制可编辑性
 * @param {*} props 
 * @param {*} moduleId 当前表格的moduleId
 * @param {*} key  当前的key
 * @param {*} value 当前的value
 * @param {*} index 当前第几行
 * @param {*} record 当前行信息
 */
export const bodyChildBeforeEvent = function (props, moduleId, key, value, index, record) {
    //侧拉框吧编辑前事件
    var falg = true; //用来控制单元格是否可操作
    var meta = props.meta.getMeta();
    var tradeType = props.form.getFormItemsValue(this.formId, this.tradeType) ? props.form.getFormItemsValue(this.formId, this.tradeType).value : null;//交易类型/单据类型
    var VOClassName = this.tableVOClassName;//vo名称
    meta[moduleId].items.map((item) => {
        item.isShowUnit = false;
        var attrcode = item.attrcode;
        if (attrcode == key) {
            switch (attrcode) {
                case 'pk_balatype'://结算方式
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                // 实付币种
                case 'pk_currtype_last':
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                //本方账户[使用权参照]
                case 'pk_account':
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                         //2004结算修改实付币种后银行账户参照的问题修改
                         debugger
                         let pk_currtype = record.values.pk_currtype_last && record.values.pk_currtype_last.value;
                         if (!pk_currtype) {
                             pk_currtype = record.values.pk_currtype && record.values.pk_currtype.value;
                         }
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: pk_currtype,
                            crossRuleTableConditionsVO: data,
                            refnodename: '使用权参照',
                            isDisableDataShow: false,//默认只加载启用的账户
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'
                        };
                    };
                    break;
                //现金账户
                case 'pk_cashaccount':
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'
                        };
                    };
                    break;
                //票据类型
                case 'pk_notetype':
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                //票据号pk主键
                case 'pk_notenumber':
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                //票据号(编辑前根据票据类型变化)
                case 'notenumber':
                    break;
                //直联电票(编辑前根据票据类型变化编辑性)
                case 'direct_ecds':
                    let notetype_v = record.values.pk_notetype;
                    if (notetype_v && notetype_v.value) {
                        ajax({
                            url: '/nccloud/cmp/pub/noteTypeHandler.do',
                            data: { pk: notetype_v.value },
                            success: (res) => {
                                DirectEcdsEdit.call(this, res.data.e_note, index);//直联电票编辑性控制
                            }
                        });
                    };
                    break;
                // 内部结算账户-结算特有过滤方式
                case 'pk_inneraccount':
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            // pk_ownerorg:record.values.pk_org.value,
                            // pk_org: record.values.pk_org.value,
                            pk_org_settle: record.values.pk_org.value,//自定义参照
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPSettleInnerAccountBuilder'
                        };
                    };
                    break;
                // 付款银行账号
                case 'pk_oppaccount':
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_currtype'://币种
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_cashaccount'://现金账户
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'
                        };
                    };
                    break;
                case 'fundformcode'://资金形态
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'fundtype'://货币形态
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'fundtype'://货币形态
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_busiorg'://业务组织
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_busiorg_v'://业务组织版本
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_cashflow'://现金流量项目
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_costsubj'://收支项目目
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_cubasdoc'://客商档案
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_deptdoc'://部门
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_job'://项目
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_pcorg'://利润中心
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_pcorg_v'://利润中心版本
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_plansubj'://资金计划项目 
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_psndoc'://人员档案
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_rescenter'://责任中心
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;

                case 'def1'://自定义项1
                case 'def2'://自定义项2
                case 'def3'://自定义项3
                case 'def4'://自定义项4
                case 'def5'://自定义项5
                case 'def6'://自定义项6
                case 'def7'://自定义项7
                case 'def8'://自定义项8
                case 'def9'://自定义项9
                case 'def10'://自定义项10
                case 'def11'://自定义项11
                case 'def12'://自定义项12
                case 'def13'://自定义项13
                case 'def14'://自定义项14
                case 'def15'://自定义项15
                case 'def16'://自定义项16
                case 'def17'://自定义项17
                case 'def18'://自定义项18
                case 'def19'://自定义项19
                case 'def20'://自定义项20
                case 'zyx21'://自定义项21
                case 'zyx22'://自定义项22
                case 'zyx23'://自定义项23
                case 'zyx24'://自定义项24
                case 'zyx25'://自定义项25
                case 'zyx26'://自定义项26
                case 'zyx27'://自定义项27
                case 'zyx28'://自定义项28
                case 'zyx29'://自定义项29
                case 'zyx30'://自定义项30
                let itemDef= meta['detail_edit'].items.find((e) => e.attrcode === key);
				itemDef.queryCondition = () => {
					let dataObject = {
						model: props.cardTable.getAllData(moduleId),
						pageid: this.pageId
					};
					let data = JSON.stringify(dataObject);
					return {
						pk_org: record.values.pk_org.value,
						crossRuleTableConditionsVO: data,
						VOClassName: VOClassName,
						tradeType: tradeType,
						itemKey: key,
						GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
					};
				};
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
            }
        }
    })
    props.meta.setMeta(meta);
    return falg; //默认单元格都可操作
}

/*a39GmAMpq59M1ausScvNpYqznVdZ7f3l7EE27yEu/UILr6W/YNyq1TzPnn/TXZbkLVZkTpfbCFO8
mUW3dw5Rag==*/