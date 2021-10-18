/*8IHtlFCY0UAQa97X0oAjz8NnDGfywUmxjSOpvOwGalGNmoZrDMvIpXqUB9i+cnY/*/
import { ajax } from 'nc-lightapp-front';
import { NoteNoFormbeforeEvent } from "./CMPChangeRefEvent.js";//票据号参照编辑前
import { objBeforeCustomerForm } from "./objtypeBeforeEvent.js";//对象交易类型编辑前
import { handleHeadRateEdit } from "./rateHandleEditUtil.js";//汇率编辑性编辑前

/**
 * 卡片态表头字段过滤 以及 代码控制可编辑性[单据规则控制]
 * @param {*} moduleId 区域id
 * @param {*} props 当前props
 * @param {*} key 操作的键
 * @param {*} data 当前表单所有值
 */
function formBeforeEvent(props, moduleId, key, data) {
    //动态切换参照,等编辑前事件
    NoteNoFormbeforeEvent.call(this, props, moduleId, key, data);
    //交易对象类型下拉过滤散户
    objBeforeCustomerForm.call(this, props, moduleId, key);
    //编辑前汇率编辑性控制
    handleHeadRateEdit.call(this,key);
    let falg = true; //用来控制单元格是否可操作
    let meta = props.meta.getMeta();
    meta[moduleId].items.map((item) => {
        item.isShowUnit = false;
        let attrcode = item.attrcode;
        let tradeType = props.form.getFormItemsValue(this.formId, this.tradeType) ? props.form.getFormItemsValue(this.formId, this.tradeType).value : null;//交易类型/单据类型
        let VOClassName = this.formVOClassName;//vo名称
        if (attrcode == key) {
            switch (attrcode) {
                case 'pk_balatype'://结算方式
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_currtype'://币种
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_account'://收款银行账户[使用权参照]
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            pk_currtype: props.form.getFormItemsValue(this.formId, 'pk_currtype') ? props.form.getFormItemsValue(this.formId, 'pk_currtype').value : null,
                            refnodename: this.state.json['36070-000026'],//'使用权参照'
                            isDisableDataShow: false,//默认只加载启用的账户
                            crossRuleConditionsVO: data,
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
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            pk_currtype: props.form.getFormItemsValue(this.formId, 'pk_currtype') ? props.form.getFormItemsValue(this.formId, 'pk_currtype').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'note_type'://票据类型
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'note_no'://票据号<修改先判断是否参照，是参照才过滤>
                    let noteType = props.form.getFormItemsValue(this.formId, 'note_type') ? props.form.getFormItemsValue(this.formId, 'note_type').value : null;
                    if (noteType) {
                        ajax({
                            url: '/nccloud/cmp/pub/noteTypeHandler.do',
                            data: { pk: noteType },
                            success: (res) => {
                                if (res.data.note_type) {
                                    item.queryCondition = () => {
                                        let dataObject = {
                                            model: props.form.getAllFormValue(this.formId),
                                            pageid: this.pageId
                                        }
                                        let data = JSON.stringify(dataObject);
                                        return {
                                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                                            pk_currtype: props.form.getFormItemsValue(this.formId, 'note_type') ? props.form.getFormItemsValue(this.formId, 'note_type').value : null,
                                            pk_curr: props.form.getFormItemsValue(this.formId, 'pk_currtype') ? props.form.getFormItemsValue(this.formId, 'pk_currtype').value : null,
                                            fbmbilltype: props.form.getFormItemsValue(this.formId, 'note_type') ? props.form.getFormItemsValue(this.formId, 'note_type').value : null,
                                            pk_register: this.pk_registers == null ? null : this.pk_registers,
                                            notestatus: this.notestatus == null ? null : this.notestatus,
                                            crossRuleConditionsVO: data,
                                            VOClassName: VOClassName,
                                            tradeType: tradeType,
                                            itemKey: key,
                                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
                                        };
                                    };
                                }
                            }
                        });
                    }
                    break;
                case 'pk_busiflow'://业务流程
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_supplier'://供应商
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        let object_type = props.form.getFormItemsValue(this.formId, 'objecttype') ? props.form.getFormItemsValue(this.formId, 'objecttype').value : null;
                        let isfreecust = null;
                        if (object_type && object_type == 4) {
                            isfreecust = 'Y';//说明是散户
                        }
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            isfreecust: isfreecust,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_dept'://部门
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_busiman'://业务员
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_customer'://客户
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        let objectType = props.form.getFormItemsValue(this.formId, 'objecttype') ? props.form.getFormItemsValue(this.formId, 'objecttype').value : null;
                        let isfree_cust = null;
                        if (objectType && objectType == 4) {
                            isfree_cust = 'Y';//说明是散户
                        }
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            isfreecust: isfree_cust,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecbillCustomerGridRefSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_oppaccount'://付款银行账号
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        let pk_cust = null;//对象交易类型
                        let accclass = null;//默认显示客户
                        //客户档案
                        let pk_customer = props.form.getFormItemsValue(this.formId, 'pk_customer').value;
                        let pk_customer_dly = props.form.getFormItemsValue(this.formId, 'pk_customer').display;
                        //供应商档案
                        let pk_supplier = props.form.getFormItemsValue(this.formId, 'pk_supplier').value;
                        let pk_supplier_dly = props.form.getFormItemsValue(this.formId, 'pk_supplier').display;
                        //对象交易类型
                        let objecttype = props.form.getFormItemsValue(this.formId, 'objecttype').value;
                        //币种
                        let currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
                        //0表示客户,1表示供应商，2表示部门，3表示个人
                        if (objecttype == '0') {
                            accclass = '1';
                            pk_cust = pk_customer;
                        }
                        if (objecttype == '1') {
                            accclass = '3';
                            pk_cust = pk_supplier;
                        }
                        if (objecttype == '3') {//个人过滤,需要自定定义过滤类
                            return {
                                pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                                pk_psndoc: props.form.getFormItemsValue(this.formId, 'pk_busiman') ? props.form.getFormItemsValue(this.formId, 'pk_busiman').value : null,
                                pk_currtype: props.form.getFormItemsValue(this.formId, 'pk_currtype') ? props.form.getFormItemsValue(this.formId, 'pk_currtype').value : null,
                                crossRuleConditionsVO: data,
                                VOClassName: VOClassName,
                                tradeType: tradeType,
                                itemKey: key,
                                GridRefActionExt: 'nccloud.web.cmp.ref.CMPSingleBankAccGridRefSqlBuilder'
                            };
                        } else
                            if (pk_cust && accclass) {
                                return {
                                    pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                                    pk_cust: pk_cust,
                                    pk_curtype: currtype,
                                    accclass: accclass,
                                    crossRuleConditionsVO: data,
                                    VOClassName: VOClassName,
                                    tradeType: tradeType,
                                    itemKey: key,
                                    GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillCustBankAccGridRefSqlBuilder'
                                };
                            }
                            else {
                                return {
                                };
                            }

                    };
                    break;
                case 'pk_fiorg'://财务组织 
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_fiorg_v'://财务组织版本
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_fiorg_v'://财务组织版本
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_pcorg'://利润中心
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_pcorg_v'://利润中心版本
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_pcorg_v'://利润中心版本
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_recproject'://收支项目 
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'cash_item'://现金流量项目
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'bankroll_projet'://资金计划项目
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_jobid'://项目
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_jobobjpha'://项目任务
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_billtypeid'://单据类型ID 
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_billtypeid'://单据类型ID 
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_fundtype'://货币形态
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'costcenter'://成本中心
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'consignagreement'://托收协议号
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'payman'://支付人
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
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
                case 'def21'://自定义项21
                case 'def22'://自定义项22
                case 'def23'://自定义项23
                case 'def24'://自定义项24
                case 'def25'://自定义项25
                case 'def26'://自定义项26
                case 'def27'://自定义项27
                case 'def28'://自定义项28
                case 'def29'://自定义项29
                case 'def30'://自定义项30
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//默认单据控制规则
                        };
                    };
                    break;
                case 'up_tradetype'://上游交易类型
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'up_billtype'://上游单据大类
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
            }
        }

    });
    props.meta.setMeta(meta);
    return falg; //默认单元格都可操作
}


export { formBeforeEvent }
/*8IHtlFCY0UAQa97X0oAjz8NnDGfywUmxjSOpvOwGalGNmoZrDMvIpXqUB9i+cnY/*/