/*k+vE/w1yvGUf6RCGiXgPmfxBu75vr/lZ0PvJtPeo31hrt41OFYOd7rD0t3mFU4sz*/
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
import {BBM_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../cons/constant.js';
const { APPCODE, BX_PAGECODE, FORM_BBM_BX01,FORM_BBM_BX02, } = APP_INFO

export const FormBeforeEvent = function(props, moduleId, key) {
	let meta = props.meta.getMeta();
	meta[FORM_BBM_BX02].items.map((item) => {
		item.isShowUnit = false;
		let attrcode = item.attrcode;
		let tradeType = props.form.getFormItemsValue(this.formId, this.tradeType)
			? props.form.getFormItemsValue(this.formId, this.tradeType).value
			: null; //交易类型/单据类型
		let VOClassName = this.formVOClassName; //vo名称
		if (attrcode == key) {
			switch (attrcode) {
				
				case 'bx_dep': // 报销部门
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
				// 报销人
				case 'bx_person': 
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
							GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder' //默认单据控制规则
						};
					};
					break;
			}
		}
	});
	props.meta.setMeta(meta);
};


/**
 * 处理cardtable参照组织
 * 
 * @param {*} props 页面内置对象
 * @param {*} item 字段对象
 */
export const CardTableBeforeEvent = function(props, moduleId, key, value, index, record) {
	let meta = props.meta.getMeta();
	let tradeType = props.form.getFormItemsValue(this.formId, this.tradeType)
		? props.form.getFormItemsValue(this.formId, this.tradeType).value
		: null; //交易类型/单据类型
	let orgId =
		props.form.getFormItemsValue(this.formId, 'pk_org') &&
		props.form.getFormItemsValue(this.formId, 'pk_org').value;
	let VOClassName = this.tableVOClassName; //vo名称
	meta[moduleId].items.map((item) => {
		item.isShowUnit = false;
		var attrcode = item.attrcode;
		if (attrcode == key) {
			switch (attrcode) {
				case 'bx_person': //报销人
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						// let busiorg_p = record.values.pk_busiorg.value;
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
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
				case 'def31': //自定义项
				case 'def32': //自定义项
				case 'def33': //自定义项
				case 'def34': //自定义项
				case 'def35': //自定义项
					item.queryCondition = () => {
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
			}
		}
	});
	props.meta.setMeta(meta);
};

export const RefFilter = function(props, item) {
	
};
/**
 * 处理form参照过滤
 * 
 * @param {*} props 页面内置对象
 * @param {*} item 字段对象
 */

export const FormRefFilter = function(props, item) {
	
};

/*k+vE/w1yvGUf6RCGiXgPmfxBu75vr/lZ0PvJtPeo31hrt41OFYOd7rD0t3mFU4sz*/