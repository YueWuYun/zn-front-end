/*XTV9REV7q6r9P9zzQhR0xU4jWP4gldL6Yosk/He7QbFWfQ7FvSSKy5JnzDzMdmtE*/
import CustBankAccGridRef from '../../../../uapbd/refer/pub/CustBankAccGridRef';
import BankaccSubDefaultGridTreeRef from '../../../../uapbd/refer/pub/BankaccSubDefaultGridTreeRef';
import CashAccountGridRef from '../../../../uapbd/refer/sminfo/CashAccountGridRef';
import FundPlanTreeRef from '../../../../uapbd/refer/fiacc/FundPlanTreeRef';
import InoutBusiClassTreeRef from '../../../../uapbd/refer/fiacc/InoutBusiClassTreeRef';
import CashflowTreeRef from '../../../../uapbd/refer/fiacc/CashflowTreeRef';
import BusinessUnitWithGlobleAndCurrGropTreeRef from '../../../../uapbd/refer/org/BusinessUnitWithGlobleAndCurrGropTreeRef';
import SupplierRefTreeGridRef from '../../../../uapbd/refer/supplier/SupplierRefTreeGridRef';
import DeptTreeRef from     '../../../../uapbd/refer/org/DeptTreeRef';
import PsndocTreeGridRef from '../../../../uapbd/refer/psninfo/PsndocTreeGridRef';
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../cons/constant.js';
const {APPCODE, CARD__PAGECODE, CARD_TABLECODE, CARD_FORMCODE, FORM_BBP_02} = APP_INFO;
const { PK_NAME, VBILLNO, PK_ORG, TS } = BILL_FIELD;
const { BBP_CACHEKEY } = BBP_CONST;
const { DELETE, SAVE, ORGCHANGE } = REQUEST_URL;

export const FormBeforeEvent = function(props, moduleId, key) {
	let meta = props.meta.getMeta();
	meta[FORM_BBP_02].items.map((item) => {
		item.isShowUnit = false;
		let attrcode = item.attrcode;
		let tradeType = props.form.getFormItemsValue(this.formId, this.tradeType) ? props.form.getFormItemsValue(this.formId, this.tradeType).value : null; //交易类型/单据类型
		let VOClassName = this.formVOClassName; //vo名称
		if (attrcode == key) {
			switch (attrcode) {
				case 'pk_org':
				item.queryCondition = () => {
					return {
						funcode: APPCODE,
						TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
					};
				};
				break;

				case 'gz_dept': //购置部门
					item.queryCondition = () => {
						let dataObject = {
							model: props.form.getAllFormValue(this.formId),
							pageid: CARD__PAGECODE
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
							GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder' //自定义增加的过滤条件-现金账户
						};
					};
					break;

				case 'gz_bz': //币种
					item.queryCondition = () => {
						let dataObject = {
							model: props.form.getAllFormValue(this.formId),
							pageid: CARD__PAGECODE
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
							GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder' //自定义增加的过滤条件-现金账户
						};
					};
					break;
				
	
				case 'pk_notetype': //票据类型
					item.queryCondition = () => {
						let dataObject = {
							model: props.form.getAllFormValue(this.formId),
							pageid: CARD__PAGECODE
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: props.form.getFormItemsValue(this.formId, 'pk_org')
								? props.form.getFormItemsValue(this.formId, 'pk_org').value
								: null,
							crossRuleConditionsVO: data,
							VOClassName: VOClassName,
							
							itemKey: key,
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPNoteTypeRefSqlBuilder' //自定义增加的过滤条件-现金账户
						};
					};
					break;
	

				case 'pk_org_v': //财务组织版本
					item.queryCondition = () => {
						let dataObject = {
							model: props.form.getAllFormValue(this.formId),
							pageid: CARD__PAGECODE
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: props.form.getFormItemsValue(this.formId, 'pk_org')
								? props.form.getFormItemsValue(this.formId, 'pk_org').value
								: null,
							crossRuleConditionsVO: data,
							VOClassName: VOClassName,
							
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder' //自定义增加的过滤条件-现金账户
						};
					};
					break;
		
					//领用人
				case 'gz_person': 
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
							GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder' //自定义增加的过滤条件-现金账户
						};
					};
					break;
				
				//table表体控制规则
				case 'def1': //自定义项
				case 'def2': //自定义项
				case 'def3': //自定义项
				case 'def4': //自定义项
				case 'def5': //自定义项
				case 'def6': //自定义项
				case 'def7': //自定义项
				case 'def8': //自定义项
				case 'def9': //自定义项
				case 'def10': //自定义项
				case 'def11': //自定义项
				case 'def12': //自定义项
				case 'def13': //自定义项
				case 'def14': //自定义项
				case 'def15': //自定义项
				case 'def16': //自定义项
				case 'def17': //自定义项
				case 'def18': //自定义项
				case 'def19': //自定义项
				case 'def20': //自定义项
				case 'def21': //自定义项
				case 'def22': //自定义项
				case 'def23': //自定义项
				case 'def24': //自定义项
				case 'def25': //自定义项
				case 'def26': //自定义项
				case 'def27': //自定义项
				case 'def28': //自定义项
				case 'def29': //自定义项
				case 'def30': //自定义项
					item.queryCondition = () => {
						let dataObject = {
							model: props.form.getAllFormValue(this.formId),
							pageid: CARD__PAGECODE
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: props.form.getFormItemsValue(this.formId, 'pk_org')
								? props.form.getFormItemsValue(this.formId, 'pk_org').value
								: null,
							crossRuleConditionsVO: data,
							VOClassName: VOClassName,
							
							itemKey: key,
							GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder' //默认单据控制规则
						};
					};
					break;
			}
		}
	});
	props.meta.setMeta(meta);
};
export const RefFilter = function(props, item) {
	let formId = 'head';
	let tableId = 'paybilldetail_table';
	if (item.attrcode == 'mon_account') {
		item.render = function(text, record, index) {
			return CashAccountGridRef({
				queryCondition: () => {
					let cash_orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
					let cash_curr_type = props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_currtype');
					if (cash_curr_type && cash_curr_type.value) {
						cash_curr_type = cash_curr_type.value;
					} else {
						cash_curr_type = null;
					}
					return {
						pk_org: cash_orgid, // 这里对record.values.materiel要做一下非空校验
						pk_currtype: cash_curr_type,
						GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder' //自定义增加的过滤条件-现金账户
					};
				}
			});
		};
	} else if (item.attrcode == 'pk_dept') {
		item.render = function(text, record, index) {
			return DeptTreeRef({
				queryCondition: () =>{
			  let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			  let busiorg = record.values.pk_busiorg.value;
			return {
				pk_org: busiorg?busiorg:orgid
			
			};
		}
		});
		};
	} else if (item.attrcode == 'pk_supplier') {
		item.render = function(text, record, index) {
			return SupplierRefTreeGridRef({
				queryCondition: () => {
					let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
					let objecttype = record.values.objecttype;
					if (objecttype && objecttype.value == '4') {
						return {
							pk_org: orgid,
							isfreecust: 'Y',
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder'
						};
					} else {
						return {
							pk_org: orgid
						};
					}
				}
			});
		};
	} else if (item.attrcode == 'pk_customer') {
		item.queryCondition = () => {
			let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			return {
				pk_org: orgid
				//GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder' //自定义参照过滤条件
			};
		};
	} else if (item.attrcode == 'pk_oppaccount') {
		debugger;
		item.queryCondition = () => {
			let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			let currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
			return {
				pk_org: orgid,
				pk_currtype: currtype,
				refnodename:
					props.MutiInit.getIntl('36070PBR') &&
					props.MutiInit.getIntl('36070PBR').get('36070PBR-000017') /* 国际化处理： 使用权参照*/,
				GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsBankaccSubDefaultGridRefSqlBuilder'
				//自定义参照过滤条件
			};
		};
	} else if (item.attrcode == 'note_no') {
		// item.render = function(text, record, index) {
		// 	return Bill4CmpPayGridRef({
		// 		queryCondition: () => {
		// 			let tb_note_no_data = props.form.getFormItemsValue(formId, 'pk_org').value;
		// 			let tb_note_curr_type = props.cardTable.getValByKeyAndIndex(tableId, index, 'pk_currtype');
		// 			let tb_note_no_type = props.cardTable.getValByKeyAndIndex(tableId, index, 'note_type');
		// 			if (tb_note_curr_type && tb_note_curr_type.value) {
		// 				tb_note_curr_type = tb_note_curr_type.value;
		// 			}
		// 			if (tb_note_no_type && tb_note_no_type.value) {
		// 				tb_note_no_type = tb_note_no_type.value;
		// 			}
		// 			return {
		// 				pk_org: tb_note_no_data,
		// 				fbmbilltype: tb_note_no_type,
		// 				pk_curr: tb_note_curr_type
		// 			};
		// 		}
		// 	});
		// };
	} else if (item.attrcode == 'bankroll_projet') {
		item.render = function(text, record, index) {
			return FundPlanTreeRef({
				queryCondition: () => {
					let bankroll_projet_org = props.form.getFormItemsValue(formId, 'pk_org').value;
					let bankroll_projet_group = props.form.getFormItemsValue(formId, 'pk_group').value;
					return {
						pk_org: bankroll_projet_org,
						pk_group: bankroll_projet_group
					};
				}
			});
		};
	} else if (item.attrcode == 'pk_recproject') {
		item.render = function(text, record, index) {
			return InoutBusiClassTreeRef({
				queryCondition: () => {
					let pk_recproject_org = props.form.getFormItemsValue(formId, 'pk_org').value;
					let pk_recproject_group = props.form.getFormItemsValue(formId, 'pk_group').value;
					return {
						pk_org: pk_recproject_org
					};
				}
			});
		};
	} else if (item.attrcode == 'cash_item') {
		item.render = function(text, record, index) {
			return CashflowTreeRef({
				queryCondition: () => {
					let pk_cash_item_org = props.form.getFormItemsValue(formId, 'pk_org').value;
					return {
						pk_org: pk_cash_item_org
					};
				}
			});
		};
	} else if (item.attrcode == 'pk_busiorg') {
		item.render = function(text, record, index) {
			return BusinessUnitWithGlobleAndCurrGropTreeRef({
				queryCondition: () => {
					let pk_busiorg_org = props.form.getFormItemsValue(formId, 'pk_org').value;
					return {
						pk_org: pk_busiorg_org
					};
				}
			});
		};
	} else if (item.attrcode == 'pk_busiman') {
		item.render = function(text, record, index) {
			return PsndocTreeGridRef({
				queryCondition: () =>{
			  let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			  let busiorg = record.values.pk_busiorg.value;
			return {
				pk_org: busiorg?busiorg:orgid
			
			};
		}
		});
		};
	}
};
/**
 * 处理form参照过滤
 * 
 * @param {*} props 页面内置对象
 * @param {*} item 字段对象
 */

export const FormRefFilter = function(props, item) {
	let formId = 'head';
	if (item.attrcode == 'pk_fiorg') {
		item.queryCondition = () => {
			// let data = props.form.getFormItemsValue(formId, 'vbillcode').value;
			// return { pk_org: '1001A110000000000LKL' };
		};
	} else if (item.attrcode == 'pk_org') {
		item.queryCondition = () => {
			return {
				funcode: '36070PBR',
				TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
			};
		};
	} else if (item.attrcode == 'mon_account') {
		item.queryCondition = () => {
			let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			let mon_account_currtype_value = props.form.getFormItemsValue(formId, 'pk_currtype').value;
			return {
				pk_org: orgid,
				pk_currtype: mon_account_currtype_value,
				GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder' //自定义增加的过滤条件-现金账户
			};
		};
	} else if (item.attrcode == 'pk_account') {
		item.queryCondition = () => {
			// let data = props.form.getFormItemsValue(formId, 'pk_org').value;
			let pk_customer = props.form.getFormItemsValue(formId, 'pk_customer').value;
			let pk_supplier = props.form.getFormItemsValue(formId, 'pk_supplier').value;
			let pk_psndoc = props.form.getFormItemsValue(formId, 'pk_busiman').value;
			let pk_currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
			let pk_cust = pk_supplier; //供应商
			let acclass = 3;
			let objecttype = props.form.getFormItemsValue(formId, 'objecttype').value;
			if (objecttype == '0' || objecttype == '1') {
				if (objecttype == '0') {
					acclass = '1';
					pk_cust = pk_customer;
				}
				if (objecttype == '1') {
					acclass = '3';
					pk_cust = pk_supplier;
				}
				return {
					pk_cust: pk_cust,
					accclass: acclass,
					pk_curr: pk_currtype,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPaybillsCustBankAccGridRefSqlBuilder' //自定义参照过滤条件
				};
			} else {
				return {
					pk_psndoc: pk_psndoc
				};
			}
		};
	} else if (item.attrcode == 'pk_supplier') {
		item.queryCondition = () => {
			let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			let objecttype = props.form.getFormItemsValue(formId, 'objecttype');
			if (objecttype && objecttype.value == '4') {
				return {
					pk_org: orgid,
					isfreecust: 'Y',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder'
				};
			} else {
				return {
					pk_org: orgid
					//GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder'
				};
			}
		};
	} else if (item.attrcode == 'pk_customer') {
		item.queryCondition = () => {
			let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			return {
				pk_org: orgid
				//GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder' //自定义参照过滤条件
			};
		};
	} else if (item.attrcode == 'pk_busiman') {
		item.queryCondition = () => {
			let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			return {
				pk_org: orgid
				//GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder' //自定义参照过滤条件
			};
		};
	} else if (item.attrcode == 'pk_dept') {
		item.queryCondition = () => {
			let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			return {
				pk_org: orgid
			};
		};
	} else if (item.attrcode == 'pk_oppaccount') {
		item.queryCondition = () => {
			let orgid = props.form.getFormItemsValue(formId, 'pk_org').value;
			let currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
			return {
				pk_org: orgid,
				pk_currtype: currtype,
				refnodename:
					props.MutiInit.getIntl('36070PBR') &&
					props.MutiInit.getIntl('36070PBR').get('36070PBR-000017') /* 国际化处理： 使用权参照*/,
				GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsBankaccSubDefaultGridRefSqlBuilder' //自定义参照过滤条件
			};
		};
	} else if (item.attrcode == 'note_no') {
		item.queryCondition = () => {
			let note_no_org_value = props.form.getFormItemsValue(formId, 'pk_org').value; //所选组织
			let note_no_curr_value = props.form.getFormItemsValue(formId, 'pk_currtype').value; //币种
			let note_type_value = props.form.getFormItemsValue(formId, 'note_type').value; //票据类型

			return {
				pk_org: note_no_org_value,
				fbmbilltype: note_type_value,
				pk_curr: note_no_curr_value
			};
		};
	}
};

/*XTV9REV7q6r9P9zzQhR0xU4jWP4gldL6Yosk/He7QbFWfQ7FvSSKy5JnzDzMdmtE*/