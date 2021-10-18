/*LC081ZYJ+ey2wRCzynQ5TDdXxD1u1b2+yuILOK6djoJMfXFrWfVcMgMIOd6w+LAj*/
import { getBusinessInfo, ajax } from "nc-lightapp-front";
import { NoteTypeHandle } from "../../util/ReferChangeEvent.js";

/**
 * 卡片态表体字段过滤 以及 代码控制可编辑性<20190808之前使用>
 * @param {*} props 
 * @param {*} moduleId 当前表格的moduleId
 * @param {*} key  当前的key
 * @param {*} value 当前的value
 * @param {*} index 当前第几行
 * @param {*} record 当前行信息
 */
function bodyBeforeEvent(props, moduleId, key, value, index, record) {
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
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.pk_currtype.value,
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
                //票据号
                case 'pk_notenumber':
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            // 币种里放pk，已问宏建，说就是这样
                            pk_currtype: record.values.pk_notetype.value,
                            pk_curr: record.values.pk_currtype.value,
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
                    let pk_notetype=record.values.pk_notetype; 
                    if (pk_notetype&&pk_notetype.value) {
                       ajax({
                              url: '/nccloud/cmp/pub/noteTypeHandler.do',
                              data: { pk:pk_notetype.value },
                              success: function(res) {
                                   NoteTypeHandle.call(this,props, moduleId, res.data.note_type,index);        
                              }
                       });
                    };
                    break;
                // 内部结算账户
                case 'pk_inneraccount':
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype:record.values.pk_currtype.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
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

                        //客户档案
                        let parent_cus = record.values.pk_customer;
                        let pk_tab_customer = null;
                        if (parent_cus && parent_cus.value) {
                            pk_tab_customer = parent_cus.value;
                        }
                        let pk_tab_cust = null;
                        if (pk_tab_customer != null) {
                            pk_tab_cust = pk_tab_customer;
                        }
                        //供应商档案
                        let pk_tb_supplier = record.values.pk_supplier;
                        let tb_acclass = null;//默认显示客户
                        //对象交易类型
                        let tb_par_obj = record.values.objecttype;
                        let tb_objecttype = null;
                        if (tb_par_obj && tb_par_obj.value) {
                            tb_objecttype = tb_par_obj.value;
                        }
                        //0表示客户
                        if (tb_objecttype == 0) {
                            tb_acclass = 1;
                        }
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_cust: pk_tab_cust,
                            accclass: tb_acclass,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillCustBankAccGridRefSqlBuilder'
                        };
                    };
                    break;
            }
        }
    })
    props.meta.setMeta(meta);
    return falg; //默认单元格都可操作
}

export { bodyBeforeEvent }
/*LC081ZYJ+ey2wRCzynQ5TDdXxD1u1b2+yuILOK6djoJMfXFrWfVcMgMIOd6w+LAj*/