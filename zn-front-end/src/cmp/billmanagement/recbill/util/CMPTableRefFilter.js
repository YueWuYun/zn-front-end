/*e9ZqmqFznk5MQ6q/FmW5rK8tUdElj6i1tUXim3omo5wOcwEzv74uMF/5ddGHe8AG*/
import { ajax } from 'nc-lightapp-front';
import { NotetopeTablebeforeEvent } from "./CMPChangeRefEvent.js";//票据号参照编辑前
import { objBeforeCustomerTable } from "./objtypeBeforeEvent.js";//对象交易类型编辑前
import { bodyChildBeforeEvent } from "./CMPChildTableRefFilter.js";//对象交易类型编辑前
import { handleTableRateEdit } from "./rateHandleEditUtil.js";//汇率编辑性编辑前
import { ObjectTypeHandle } from "./ReferChangeEvent.js";
/**
 * 卡片态表体字段过滤 以及 代码控制可编辑性
 * @param {*} props 
 * @param {*} moduleId 当前表格的moduleId
 * @param {*} key  当前的key
 * @param {*} value 当前的value
 * @param {*} index 当前第几行
 * @param {*} record 当前行信息
 */
function bodyBeforeEvent(props, moduleId, key, value, index, record) {
    //动态切换参照
    NotetopeTablebeforeEvent.call(this, props, moduleId, key, value, index, record);
    //对象交易类型编辑前{表体的包含了侧拉编辑框的参照处理}
    objBeforeCustomerTable.call(this, props, moduleId, key);
    //侧拉框吧编辑前事件
    bodyChildBeforeEvent.call(this, props, this.childform, key, value, index, record);
    //汇率编辑前事件
    handleTableRateEdit.call(this, key, record, index);
    //付款银行账号参照切换
    ObjectTypeHandle.call(this, props, moduleId, null);
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
                case 'pk_account'://收款银行账户[使用权参照]
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
                            refnodename: this.state.json['36070-000026'],//'使用权参照'
                            isDisableDataShow: false,//默认只加载启用的账户
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'
                        };
                    };
                    break;
                case 'mon_account'://现金账户
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
                case 'note_type'://票据类型
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
                case 'note_no'://票据号
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_org.value,
                            pk_currtype: record.values.note_type.value,
                            pk_curr: record.values.pk_currtype.value,
                            fbmbilltype: record.values.note_type.value,
                            pk_register: this.pk_registers == null ? null : this.pk_registers,
                            notestatus: this.notestatus == null ? null : this.notestatus,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
                        };
                    };
                    break;
                case 'pk_supplier'://供应商
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        let object_type = record.values.objecttype.value;
                        let isfreecust = null;
                        if (object_type && object_type == 4) {
                            isfreecust = 'Y';//说明是散户
                        }
                        return {
                            pk_org: record.values.pk_org.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            isfreecust: isfreecust,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder'//自定义增加的过滤条件
                        };
                    };
                    break;
                case 'pk_dept'://部门
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_busiorg.value ? record.values.pk_busiorg.value : record.values.pk_org.value ? record.values.pk_org.value : null,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_busiman'://业务员
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: record.values.pk_busiorg.value ? record.values.pk_busiorg.value : record.values.pk_org.value ? record.values.pk_org.value : null,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_customer'://客户
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        let objectType = record.values.objecttype.value;
                        let isfree_cust = null;
                        if (objectType && objectType == 4) {
                            isfree_cust = 'Y';//说明是散户
                        }
                        return {
                            pk_org: record.values.pk_org.value,
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            isfreecust: isfree_cust,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecbillCustomerGridRefSqlBuilder'//自定义增加的过滤条件
                        };
                    };
                    break;
                case 'pk_oppaccount'://付款银行账号
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.cardTable.getAllData(moduleId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        let pk_tab_cust = null;//客户
                        let tb_acclass = null;//默认显示客户
                        //客户档案
                        let pk_tb_customer = record.values.pk_customer;
                        //供应商档案
                        let pk_tb_supplier = record.values.pk_supplier;

                        //对象交易类型
                        let tb_par_obj = record.values.objecttype;
                        //币种
                        let currtype = record.values.pk_currtype.value;
                        let tb_objecttype = tb_par_obj == null ? null : tb_par_obj.value == null ? null : tb_par_obj.value;
                        //0表示客户,1表示供应商，2表示部门，3表示个人
                        if (tb_objecttype == '0') {
                            tb_acclass = '1';
                            pk_tab_cust = pk_tb_customer == null ? null : pk_tb_customer.value == null ? null : pk_tb_customer.value;
                        }
                        if (tb_objecttype == '1') {
                            tb_acclass = '3';
                            pk_tab_cust = pk_tb_supplier == null ? null : pk_tb_supplier.value == null ? null : pk_tb_supplier.value;
                        }
                        if (tb_objecttype == '3') {//个人过滤,需要自定定义过滤类
                            return {
                                pk_org: record.values.pk_org ? record.values.pk_org.value : null,//财务组织
                                pk_psndoc: record.values.pk_busiman ? record.values.pk_busiman.value : null,//业务员
                                pk_currtype: record.values.pk_currtype ? record.values.pk_currtype.value : null,//币种
                                crossRuleConditionsVO: data,
                                VOClassName: VOClassName,
                                tradeType: tradeType,
                                itemKey: key,
                                GridRefActionExt: 'nccloud.web.cmp.ref.CMPSingleBankAccGridRefSqlBuilder'
                            };
                        } else
                            if (tb_acclass && pk_tab_cust) {
                                return {
                                    pk_org: record.values.pk_org.value,
                                    pk_cust: pk_tab_cust,
                                    pk_curtype: currtype,
                                    accclass: tb_acclass,
                                    crossRuleTableConditionsVO: data,
                                    VOClassName: VOClassName,
                                    tradeType: tradeType,
                                    itemKey: key,
                                    GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillCustBankAccGridRefSqlBuilder'
                                };
                            } else {
                                return {};
                            }
                    };
                    break;
                case 'pk_fiorg'://财务组织 
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
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_fiorg_v'://财务组织版本
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
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
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
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
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
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CMPBusiorgSqlBuilder'
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
                            crossRuleTableConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_recproject'://收支项目
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
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'cash_item'://现金流量项目
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
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'bankroll_projet'://资金计划项目
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
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_jobid'://项目
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
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'pk_jobobjpha'://项目任务
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
                case 'pk_fundtype'://货币形态
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
                case 'costcenter'://成本中心
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
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                        };
                    };
                    break;
                case 'payman'://支付人
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
                    //自定义项-设置会计科目过滤方法修改
                    let datetype = item.datatype;
                    let itemtype = item.itemtype;
                    let metadata = item.metadataProperty;
                    let refcode = item.refcode;
                    if (datetype == '204' && itemtype == 'refer'&&metadata
                        && metadata.indexOf('uap.accasoa') != -1 &&
                        refcode.indexOf('fiacc') != -1) {
                            ajax({
                                url: '/nccloud/cmp/pub/getaccountbook.do',
                                data: { pk_org: record.values.pk_org.value },
                                async: false,//1909新增:编辑后事件改为同步ajax请求
                                success: (res) => {
                                    if (res && res.data) {
                                        item.queryCondition = () => {
                                            let dataObject = {
                                                model: props.cardTable.getAllData(moduleId),
                                                pageid: this.pageId
                                            }
                                            let data = JSON.stringify(dataObject);
                                            return {
                                                pk_org: record.values.pk_org.value,
                                                crossRuleTableConditionsVO: data,
                                                pk_accountingbook: res.data,//根据pk_org查询财务核算账簿
                                                VOClassName: VOClassName,
                                                tradeType: tradeType,
                                                itemKey: key,
                                                GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                                            };
                                        };
                                    }
                                }
                            });
                    } else {
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
                    }

                    let itemDef= meta['childform1_recbill_01'].items.find((e) => e.attrcode === key);
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

                    break;
                case 'pk_subjct'://会计科目
                    ajax({
                        url: '/nccloud/cmp/pub/getaccountbook.do',
                        data: { pk_org: record.values.pk_org.value },
                        async: false,//1909新增:编辑后事件改为同步ajax请求
                        success: (res) => {
                            if (res && res.data) {
                                item.queryCondition = () => {
                                    let dataObject = {
                                        model: props.cardTable.getAllData(moduleId),
                                        pageid: this.pageId
                                    }
                                    let data = JSON.stringify(dataObject);
                                    return {
                                        pk_org: record.values.pk_org.value,
                                        crossRuleTableConditionsVO: data,
                                        pk_accountingbook: res.data,//根据pk_org查询财务核算账簿
                                        VOClassName: VOClassName,
                                        tradeType: tradeType,
                                        itemKey: key,
                                        GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
                                    };
                                };
                            }
                        }
                    });

                    break;
            }
        }
    })
    props.meta.setMeta(meta);
    return falg; //默认单元格都可操作
}

export { bodyBeforeEvent }
/*e9ZqmqFznk5MQ6q/FmW5rK8tUdElj6i1tUXim3omo5wOcwEzv74uMF/5ddGHe8AG*/