/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD ,TRAN_CARD_PAGE_INFO} from '../../cons/constant';
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
		if (item.attrcode === 'pk_org') { //财务组织
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = p => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org").value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, "pk_group").value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		// 票据编号参照过滤
		if (item.attrcode == 'pk_register') {

			item.queryCondition = () => {
				let pk_register = this.props.form.getFormItemsValue(this.formId, 'pk_register') && this.props.form.getFormItemsValue(this.formId, 'pk_register').value;
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let billpoolflag = this.props.form.getFormItemsValue(this.formId, 'billpoolflag') && this.props.form.getFormItemsValue(this.formId, 'billpoolflag').value;
				let opbilltype = this.props.form.getFormItemsValue(this.formId, 'opbilltype') && this.props.form.getFormItemsValue(this.formId, 'opbilltype').value;
				return {
					pk_register: pk_register,
					pk_org: pk_org,
					billpoolflag: billpoolflag,
					opbilltype: opbilltype,
					GridRefActionExt: "nccloud.web.fbm.fbm.consignbank.filter.ConsignBankNCCBillPoolFlagBillnoRefFilter,nccloud.web.fbm.fbm.consignbank.filter.ConsignBankNCCOpbilltypeBillnoRefFilter,nccloud.web.fbm.fbm.consignbank.filter.ConsignBankNCCFbmbillnoRefModelFilter"
				};
			};
		}
		if (item.attrcode == 'collectionplanitem') {
			// 资金计划项目为收入类的计划项目，inoutdirect=0
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					return {
						pk_org: pk_org,
						//TreeRefActionExt: 'nccloud.web.fbm.fbm.consignbank.filter.DefaultInFundplanRefModelFilter'
					};
				}
			);
		}
		if (item.attrcode == 'fbmplanitem') {
			// 资金计划项目为支出类的计划项目，inoutdirect=1
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					return {
						pk_org: pk_org,
						//TreeRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.DefaultOutFundplanRefModelFilter'
					};
				}
			);
		}
		// 托收银行账户 holderacc
		if (item.attrcode === 'holderacc') {
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					refnodename: this.props.MutiInit.getIntl("36200BC") && this.props.MutiInit.getIntl("36200BC").get('36200BC-000014'),/* 国际化处理： 使用权参照*/
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
					pk_curr: this.props.form.getFormItemsValue(this.formId, 'pk_curr') && this.props.form.getFormItemsValue(this.formId, 'pk_curr').value,
					GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.SignPkcurrFilter"
				};
			};
		}
	});

	//保证金
	meta['issecurity'].items.map(item => {
		if (item.attrcode === 'securityaccount') { //保证金账户过滤
			item.checkStrictly = false;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value, //组织
					pk_curr: this.props.form.getFormItemsValue(this.formId, 'pk_curr') && this.props.form.getFormItemsValue(this.formId, 'pk_curr').value,
					GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.SecurityAccRefModelFilter,nccloud.web.fbm.fbm.sign.filter.SignPkcurrFilter"
				};
			};
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/