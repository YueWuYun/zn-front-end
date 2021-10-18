/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD, app_code, TRAN_CARD_PAGE_INFO } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import { afterEvent } from './index';

export default function (props, templateCallback) {
	let app_code = props.getSearchParam('c');
	props.createUIDom(
		{
			pagecode: TRAN_CARD_PAGE_INFO.PAGE_CODE,//页面id
			appcode: app_code
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, meta);
					props.meta.setMeta(meta);
					// templateCallback.call(this, props, meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(this, props, button);
				}
				templateCallback && templateCallback();
				if (data.context) {
					let context = data.context;
					if (props.getUrlParam('status') === 'add') {
						//设置默认组织
						let { pk_org, org_Name, pk_org_v, org_v_Name } = context;
						if (pk_org) {
							props.form.setFormItemsValue(this.formId, {
								'pk_org': { value: pk_org, display: org_Name },
								'pk_org_v': { value: pk_org_v, display: org_v_Name }
							});
							afterEvent.call(this, props, this.formId, 'pk_org', { display: org_Name, value: pk_org }, { value: null });
						}
					}
				}
			}
		}
	)
}

function modifierMeta(meta) {
	//表头
	meta[this.formId].items.map(item => {
		//财务组织
		if (item.attrcode === 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		//办理人
		if (item.attrcode === 'vtransactorid') {
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
				};
			};
		}
		//参照过滤-票据编号
		if (item.attrcode == 'pk_register') {
			item.showHistory = false;
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
					let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr');
					let pk_billtypecode = this.props.form.getFormItemsValue(this.formId, 'pk_billtypecode');
					let opbilltype = this.props.form.getFormItemsValue(this.formId, 'opbilltype');
					let pk_register = this.props.form.getFormItemsValue(this.formId, 'pk_register');
					return {
						pk_org: pk_org && pk_org.value,
						pk_curr: pk_curr && pk_curr.value,
						pk_billtypecode: pk_billtypecode && pk_billtypecode.value,
						billpoolflag: true,
						opbilltype: opbilltype && opbilltype.value,
						pk_register: pk_register && pk_register.value,
						GridRefActionExt: 'nccloud.web.fbm.fbm.discountapply.filter.DiscountAppFbmbillno4NCCFilter,nccloud.web.fbm.fbm.discountapply.filter.DiscountOpbilltypeBillno4NCCRefFilter',
					};
				}
			);
		}
		// 贴现银行账户
		else if (item.attrcode == 'discount_account') {
			item.showHistory = false;
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
					let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_curr');
					let pk_discount_bank = this.props.form.getFormItemsValue(this.formId, 'pk_discount_bank');
					let multiLang = this.props.MutiInit.getIntl(this.moduleId); //this.moduleId
					return {
						pk_org: pk_org && pk_org.value, // 组织
						pk_curr: pk_currtype && pk_currtype.value,
						// 开户银行
						pk_bankdoc: pk_discount_bank && pk_discount_bank.value,
						// 是否过滤内部账户
						isinneraccFilter: true,
						// 是否过滤活期账户
						iscurrentFilter: true,
						// 是否过滤收入，收支类账户
						isarapFilter: true,
						refnodename: multiLang && multiLang.get('36200DA-000002'),/* 国际化处理： 使用权参照*/
						GridRefActionExt: "nccloud.web.fbm.base.filter.Bankacc4NCCRefModelFilter",
					};
				}
			);
		}
		// 贴现银行 
		else if (item.attrcode == 'pk_discount_bank') {
			item.showHistory = true;
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
					let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_curr');
					return {
						pk_org: pk_org && pk_org.value, // 组织
						pk_currtype: pk_currtype && pk_currtype.value,
						// GridRefActionExt: "nccloud.web.fbm.base.filter.Bankdoc4NCCRefModelFilter"
					};
				}
			);
		}
		// 贴现余额计划项目，收入项目
		else if (item.attrcode == 'balanceplanitem') {
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
					return {
						pk_org: pk_org && pk_org.value, // 组织
						'inoutdirect': 0
					};
				}
			);
		}
		// 贴现息计划项目，支出项目
		else if (item.attrcode == 'interestplanitem') {
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
					return {
						pk_org: pk_org && pk_org.value, // 组织
						'inoutdirect': 1
					};
				}
			);
		}
		// 资金计划项目为支出类的计划项目，支出项目
		else if (item.attrcode == 'fbmplanitem') {
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
					return {
						pk_org: pk_org && pk_org.value, // 组织
						'inoutdirect': 1
					};
				}
			);
		}
		// 资金计划项目为支出类的计划项目，支出项目
		else if (item.attrcode == 'chargeplanitem') {
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
					return {
						pk_org: pk_org && pk_org.value, // 组织
						'inoutdirect': 1
					};
				}
			);
		}
		// 成本中心
		else if (item.attrcode == 'pk_costcenter') {
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
					return {
						pk_org: pk_org && pk_org.value, // 组织
					};
				}
			);
		}
		// 自定义项过滤
		else if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = (p) => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
				let pk_group = this.props.form.getFormItemsValue(this.formId, "pk_group");
				return {
					pk_org: pk_org && pk_org.value, // 组织
					pk_group: pk_group && pk_group.value
				};
			}
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/