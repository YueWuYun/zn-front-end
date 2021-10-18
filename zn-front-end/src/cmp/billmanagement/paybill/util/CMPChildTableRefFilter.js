/*STPFXbVUtCUqfm3QrhU838BGY9PhdknzT5yHM6U4ieO8P7NzOWUWdvdU5Oybgmy6XoJiuvvse3ak
X/KY7yQwuA==*/
import { ajax } from 'nc-lightapp-front';
import { saveMultiLangRes,loadMultiLang } from '../../../../tmpub/pub/util';
/**
 * [表体侧拉框编辑前事件]
 * @param {*} props 
 * @param {*} moduleId 当前表格的moduleId
 * @param {*} key  当前的key
 * @param {*} value 当前的value
 * @param {*} index 当前第几行
 * @param {*} record 当前行信息
 */
/**
 * 处理cardtable参照组织
 * 
 * @param {*} props 页面内置对象
 * @param {*} item 字段对象
 */
export const BodyChildBeforeEvent = function(props, moduleId, key, value, index, record) {
	let meta = props.meta.getMeta();
	let tradeType = props.form.getFormItemsValue(this.formId, this.tradeType)
		? props.form.getFormItemsValue(this.formId, this.tradeType).value
		: null; //交易类型/单据类型
	let orgId =
		props.form.getFormItemsValue(this.formId, 'pk_org') &&
		props.form.getFormItemsValue(this.formId, 'pk_org').value;
	let VOClassName = this.tableVOClassName; //vo名称
	meta['childform1'].items.map((item) => {
		item.isShowUnit = false;
		var attrcode = item.attrcode;
		if (attrcode == key) {
			switch (attrcode) {
				case 'pk_balatype': //结算方式
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
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
				case 'pk_currtype': //币种
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
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
				case 'mon_account': //现金账户
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							pk_currtype: record.values.pk_currtype && record.values.pk_currtype.value,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'
						};
					};
					break;
				case 'note_type': //票据类型
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
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
				case 'pk_supplier': //供应商
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						let object_type = record.values.objecttype.value;
						let isfreecust = null;
						if (object_type && object_type == 4) {
							isfreecust = 'Y'; //说明是散户
						}
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							isfreecust: isfreecust,
							itemKey: key,
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsSupplierGridRefSqlBuilder' //自定义增加的过滤条件
						};
					};
					break;
				case 'pk_dept': //部门
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						let busiorg = record.values.pk_busiorg.value;
						return {
							pk_org:busiorg? busiorg:orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'pk_busiman': //业务员
				    //item.isShowUnit=true;
				   // item.isShowUsual=true;
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						
						let data = JSON.stringify(dataObject);
						let busiorg_p = record.values.pk_busiorg.value;
						return {
							pk_org: busiorg_p? busiorg_p:orgId,
							//isShowUnit:true,
							//isShowUsual:true,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'pk_customer': //客户
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						let objectType = record.values.objecttype.value;
						let isfree_cust = null;
						if (objectType && objectType == 4) {
							isfree_cust = 'Y'; //说明是散户
						}
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							isfreecust: isfree_cust,
							tradeType: tradeType,
							itemKey: key,
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecbillCustomerGridRefSqlBuilder' //自定义增加的过滤条件
						};
					};
					break;
					case 'pk_account': //收款款银行账号
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
					
					
						//客户
						let pk_customer =record.values.pk_customer&&record.values.pk_customer.value;
						//供应商
						let pk_supplier = record.values.pk_supplier&&record.values.pk_supplier.value;
						//业务员
						let pk_psndoc = record.values.pk_busiman&&record.values.pk_busiman.value;
						//币种
						let pk_currtype =record.values.pk_currtype&&record.values.pk_currtype.value;
						
						//交易对象类型
						let objecttype =record.values.objecttype&&record.values.objecttype.value;
						let pk_cust = pk_supplier; //供应商
						let acclass = 3;
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
								pk_org:orgId,
								pk_cust: pk_cust,
								accclass: acclass,
								pk_curr: pk_currtype,
								crossRuleConditionsVO: data,
								VOClassName: VOClassName,
								tradeType: tradeType,
								itemKey: key,
								GridRefActionExt: 'nccloud.web.cmp.ref.CMPaybillsCustBankAccGridRefSqlBuilder' //自定义参照过滤条件
							};
						} else if (objecttype == '3') {
							return {
								pk_psndoc: pk_psndoc,
								pk_org: orgId,
								crossRuleConditionsVO: data,
								VOClassName: VOClassName,
								tradeType: tradeType,
								itemKey: key
							};
						}
					};
					break;
				case 'pk_oppaccount': //付款银行账号(s使用权参照)
					item.queryCondition = () => {
						let dataObject = {
							model: props.form.getAllFormValue(this.formId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							pk_currtype: record.values.pk_currtype && record.values.pk_currtype.value,
							isDisableDataShow: false, //默认只加载启用的账户
							crossRuleConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPPaybillsBankaccSubDefaultGridRefSqlBuilder'
						};
					};
					break;
				case 'pk_fiorg': //财务组织
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'pk_fiorg_v': //财务组织版本
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'pk_pcorg': //利润中心
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'pk_pcorg_v': //利润中心版本
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'pk_recproject': //收支项目

					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'cash_item': //现金流量项目
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'bankroll_projet': //资金计划项目
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'pk_jobid': //项目
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'pk_jobobjpha': //项目任务
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'pk_fundtype': //货币形态
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
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
				case 'costcenter': //成本中心
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'
						};
					};
					break;
				case 'payman': //支付人
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
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
				case 'pk_busiorg':
					item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						};
						let data = JSON.stringify(dataObject);
						return {
							pk_org: orgId,
							crossRuleTableConditionsVO: data,
							VOClassName: VOClassName,
							tradeType: tradeType,
							itemKey: key,
							TreeRefActionExt: 'nccloud.web.cmp.ref.CMPBusiorgSqlBuilder'
						};
					};
					break;
					case 'pk_subjct'://会计科目
					ajax({
						url: '/nccloud/cmp/pub/getaccountbook.do',
						data: { pk_org:orgId },
						async: false,//1909新增:编辑后事件改为同步ajax请求
						success: (res) => {
							if (res && res.data) {
								let itemform = meta['childform1'].items.find((e) => e.attrcode === 'pk_subjct');
								itemform.queryCondition = () => {
									let dataObject = {
										model: props.cardTable.getAllData(moduleId),
										pageid: this.pageId
									}
									let data = JSON.stringify(dataObject);
									return {
										pk_org: orgId,
										crossRuleConditionsVO: data,
										pk_accountingbook: res.data,//根据pk_org查询财务核算账簿
										VOClassName: VOClassName,
										tradeType: tradeType,
										itemKey: key,
										GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
									};
								};
								item.queryCondition = () => {
									let dataObject = {
										model: props.cardTable.getAllData(moduleId),
										pageid: this.pageId
									}
									let data = JSON.stringify(dataObject);
									return {
										pk_org: orgId,
										crossRuleConditionsVO: data,
										pk_accountingbook: res.data,//根据pk_org查询财务核算账簿
										VOClassName: VOClassName,
										tradeType: tradeType,
										itemKey: key,
										GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
									};
								};
							}
						}
					});
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
				case 'zyx21': //自定义项
				case 'zyx22': //自定义项
				case 'zyx23': //自定义项
				case 'zyx24': //自定义项
				case 'zyx25': //自定义项
				case 'zyx26': //自定义项
				case 'zyx27': //自定义项
				case 'zyx28': //自定义项
				case 'zyx29': //自定义项
				case 'zyx30': //自定义项
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
	props.renderItem('form', 'childform1', 'pk_dept', null);
	props.meta.setMeta(meta);
	return true;
};

/*STPFXbVUtCUqfm3QrhU838BGY9PhdknzT5yHM6U4ieO8P7NzOWUWdvdU5Oybgmy6XoJiuvvse3ak
X/KY7yQwuA==*/