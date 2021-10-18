/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD, app_code } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import { afterEvent } from './index';

export default function (props, templateCallback) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: CARD.page_id,//页面id
			appcode: appcode
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
				props.form.openArea('baseinfo');
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

		if (item.attrcode === 'receiveaccount') { //电票签约账号
			item.showHistory = true;
			item.queryCondition = () => {
				let data = this.props.form.getFormItemsValue(this.formId, "pk_org").value;
				return {
					isenableelecbill: 'Y',
					pk_org: data,
					GridRefActionExt: 'nccloud.web.fbm.ref.filter.BankAccDefaultGridRefFilter'
				};
			}
		}

		// 付票单位
		if (item.attrcode == "paybillunit") {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
					pk_group: this.props.form.getFormItemsValue(this.formId, 'pk_group').value,
				};
			};
		}

		//自定义项参照
		if (item.attrcode.indexOf("def") > -1) {
			item.queryCondition = (p) => {
				// let GridRefActionExt, TreeRefActionExt;
				// if (p) {
				// 	if (p.refType == 'grid' || p.refType == 'gridTree') {
				// 		GridRefActionExt = 'nccloud.web.arap.ref.before.CrossRuleSqlBuilder';
				// 	} else if (p.refType == 'tree') {
				// 		TreeRefActionExt = 'nccloud.web.arap.ref.before.CrossRuleSqlBuilder';
				// 	}
				// }
				// let UsualGirdRefActionExt = 'nccloud.web.arap.ref.before.CrossRuleSqlBuilder';
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					// GridRefActionExt: GridRefActionExt,
					// TreeRefActionExt: TreeRefActionExt,
					// UsualGirdRefActionExt: UsualGirdRefActionExt
				};
			}
		}
	});

	meta['baseinfo'].items.map(item => {
		if (
			item.attrcode === 'hidepayunit'
			|| item.attrcode === 'hidepaybank'
			|| item.attrcode === 'hidereceiveunit'
			|| item.attrcode === 'hidereceivebank'
			|| item.attrcode === 'signagrbank'
			|| item.attrcode === 'pk_signagrbank'
			|| item.attrcode === 'acceptorbankaccount'
			|| item.attrcode === 'acceptorbank'
			|| item.attrcode === 'pk_acceptorbank'
		) { //出票人
			item.checkStrictly = false;
			item.showHistory = true;
		}

		// 出票人
		if (item.attrcode == "hidepayunit") {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
					pk_group: this.props.form.getFormItemsValue(this.formId, 'pk_group').value,
				};
			};
		}	
		//承兑人开户行名
		if (item.attrcode == "pk_acceptorbank") {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
					pk_group: this.props.form.getFormItemsValue(this.formId, 'pk_group').value,
				};
			};
		}	

		if (item.attrcode === 'pk_signagrbank') { //承兑人{客商档案}
			item.checkStrictly = false;
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
				};
			};

		}

		// 收款人
		if (item.attrcode == 'hidereceiveunit') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
					pk_group: this.props.form.getFormItemsValue(this.formId, 'pk_group').value,
				};
			};
		}

		//出票人、收款人(文本)
		if (item.attrcode === 'payunit' || item.attrcode === 'receiveunit') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.fieldDisplayed ='refname';
			item.itemtype = 'refer';
			item.refcode = 'uapbd/refer/supplier/CustSupplierFlexGridTreeRef/index';
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
				};
			};
		}

		//出票人账户
		if (item.attrcode == 'hidepaybankacc') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				let hidepayunit = this.props.form.getFormItemsValue(this.formId, 'hidepayunit')
				let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr')
				return {
					pk_cust: hidepayunit && hidepayunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}

		//收款人账户
		if (item.attrcode == 'hidereceivebankacc') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				let hidereceiveunit = this.props.form.getFormItemsValue(this.formId, 'hidereceiveunit')
				let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr')
				return {
					pk_cust: hidereceiveunit && hidereceiveunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}

		//出票人账户(文本)
		if (item.attrcode == 'paybankacc') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.itemtype = 'refer';
			item.fieldDisplayed ='refcode';
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';
			item.queryCondition = () => {
				let hidepayunit = this.props.form.getFormItemsValue(this.formId, 'hidepayunit')
				let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr')
				return {
					pk_cust: hidepayunit && hidepayunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}

		//收款人账户(文本)
		if (item.attrcode == 'receivebankacc') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.itemtype = 'refer';
			item.fieldDisplayed ='refcode';
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';
			item.queryCondition = () => {
				let hidereceiveunit = this.props.form.getFormItemsValue(this.formId, 'hidereceiveunit')
				let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr')
				return {
					pk_cust: hidereceiveunit && hidereceiveunit.value,
					pk_curr: pk_curr && pk_curr.value,
					GridRefActionExt: "nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"
				};
			};
		}

		//出票人开户银行、收款人开户银行(文本)
		if (item.attrcode === 'paybank' || item.attrcode === 'receivebank') {
			item.checkStrictly = false;
			item.showHistory = true;
			item.fieldDisplayed ='refname';
			item.itemtype = 'refer';
			item.refcode = 'uapbd/refer/bankacc/BankDocDefaultGridTreeRef/index';
		}

		//票据类型过滤
		if (item.attrcode === 'fbmbilltype') {
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
				};
			};
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/