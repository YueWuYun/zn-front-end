/*RdECt2ssANdk3ETSMwktThksaWJbU96EKyaG5J7ifislyepFKOBPn32s9iDN+2at*/
import {
    getBusinessInfo,
    ajax
} from "nc-lightapp-front";

import { commondata } from '../../../public/utils/constant';
import { constant } from '../config/config';
/**
 * 卡片态表头字段过滤 以及 代码控制可编辑性[单据规则控制]
 * @param {*} moduleId 区域id
 * @param {*} props 当前props
 * @param {*} key 操作的键
 * @param {*} data 当前表单所有值
 */
function formBeforeEvent(props, moduleId, key, data) {
    let falg = true; //用来控制单元格是否可操作
    let meta = props.meta.getMeta();
    let crossrule = constant.crossrule; // 交叉校验规则类
    let bankaccsubref = constant.bankaccsubref; // 自定义使用权参照过滤类
    let refnodename = commondata.refnodename; // 使用权参照 汉字
    let formcode1 = constant.formcode1;
    let formcode2 = constant.formcode2;
    let formcode3 = constant.formcode3;
    let formcode4 = constant.formcode4;
    meta[formcode2].items.map((item) => {
        item.isShowUnit = false;
        let attrcode = item.attrcode;
        let billtype = props.form.getFormItemsValue(this.formId, this.tradeType);
        let tradeType = props.form.getFormItemsValue(this.formId, this.tradeType) ? props.form.getFormItemsValue(this.formId, this.tradeType).value : null; //交易类型/单据类型
        let VOClassName = this.formVOClassName; //vo名称
        if (attrcode == key) {
            switch (attrcode) {

                case 'pk_currtype': //币种
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
                            GridRefActionExt: crossrule // 自定义交叉校验规则
                        };
                    };
                    break;

                case 'transformoutbank': // 划出银行
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
                            GridRefActionExt: crossrule // 自定义交叉校验规则
                        };
                    };
                    break;

                case 'transformoutaccount': // 划出账户[使用权参照]
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            pk_currtype: props.form.getFormItemsValue(this.formId, 'pk_currtype') ? props.form.getFormItemsValue(this.formId, 'pk_currtype').value : null,
					        bill_date: props.form.getFormItemsValue(this.formId, 'billdate') ? props.form.getFormItemsValue(this.formId, 'billdate').value : null,
					        pk_bankdoc: props.form.getFormItemsValue(this.formId, 'transformoutbank') ? props.form.getFormItemsValue(this.formId, 'transformoutbank').value : null,
                            refnodename: refnodename,
                            isDisableDataShow: false, //默认只加载启用的账户
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: bankaccsubref // 自定义使用权参照
                        };
                    };
                    break;

                case 'transforminbank': // 划入银行
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
                            GridRefActionExt: crossrule // 自定义交叉校验规则
                        };
                    };
                    break;

                case 'transforminaccount': // 划入账户[使用权参照]
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            pk_currtype: props.form.getFormItemsValue(this.formId, 'pk_currtype') ? props.form.getFormItemsValue(this.formId, 'pk_currtype').value : null,
                            bill_date: props.form.getFormItemsValue(this.formId, 'billdate') ? props.form.getFormItemsValue(this.formId, 'billdate').value : null,
					        pk_bankdoc: props.form.getFormItemsValue(this.formId, 'transforminbank') ? props.form.getFormItemsValue(this.formId, 'transforminbank').value : null,
                            refnodename: refnodename,
                            isDisableDataShow: false, //默认只加载启用的账户
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: bankaccsubref // 自定义使用权参照
                        };
                    };
                    break;

                case 'pk_balatype': //结算方式
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
                            GridRefActionExt: crossrule //自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'notely_dep': //部门
					item.queryCondition = () => {
						let dataObject = {
							model: props.form.getAllFormValue(this.formId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: props.form.getFormItemsValue(this.formId, 'pk_org')
								? props.form.getFormItemsValue(this.formId, 'pk_org').value
								: null,
							crossRuleConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							GridRefActionExt: crossrule //自定义增加的过滤条件
						};
					};
                    break;
                    // 业务员
				case 'notely_psn': 
					item.queryCondition = () => {
						let dataObject = {
							model: props.form.getAllFormValue(this.formId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: props.form.getFormItemsValue(this.formId, 'pk_org')
								? props.form.getFormItemsValue(this.formId, 'pk_org').value
								: null,
							crossRuleConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							GridRefActionExt: crossrule //自定义增加的过滤条件
						};
					};
					break;
                    // 自定义项
                case 'vdef1': 
                case 'vdef2': 
                case 'vdef3': 
                case 'vdef4': 
                case 'vdef5': 
                case 'vdef6': 
                case 'vdef7': 
                case 'vdef8': 
                case 'vdef9': 
                case 'vdef10': 
                case 'vdef11': 
                case 'vdef12': 
                case 'vdef13': 
                case 'vdef14': 
                case 'vdef15': 
                case 'vdef16': 
                case 'vdef17': 
                case 'vdef18': 
                case 'vdef19': 
                case 'vdef20': 
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
                            GridRefActionExt: crossrule // 自定义交叉校验规则
                        };
                    };
                    break;
            }
        }

    });
    props.meta.setMeta(meta);
    return falg; //默认单元格都可操作
}

export {
    formBeforeEvent
}
/*RdECt2ssANdk3ETSMwktThksaWJbU96EKyaG5J7ifislyepFKOBPn32s9iDN+2at*/