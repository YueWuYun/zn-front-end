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
				props.form.openArea('billpoolinfo');
				props.form.openArea('withdrawstatus');
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
							afterEvent.call(this, props, this.formId, 'pk_org', { display: org_Name, value: pk_org },{ value: null});
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
		if(item.attrcode === 'pk_org'){ //财务组织
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				}; 
			};
		}

		if(item.attrcode === 'pk_fundorg'){ //资金组织
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_group: pk_group,
					pk_org: pk_org,
					TreeRefActionExt: 'nccloud.web.fbm.pfbm.quotaapply.filter.QuotaaplyFundOrgFilter4NCC'
				}; 
			};
		}

		if (item.attrcode === 'impawnpersonid') { //质押人
            item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
                return {
                    pk_org: pk_org
                };
            };
		}
		if (item.attrcode === 'securityaccount') { //保证金账户
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype') && this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value;

                return {
					pk_org: pk_org,
					pk_currtype: pk_currtype,
					GridRefActionExt:'nccloud.web.fbm.pfbm.quotaapply.filter.QuotaaplySecurityAccountFilter4NCC'
                };
            };
		}
		//票据编号参照过滤
		if (item.attrcode == 'pk_register') {
			item.queryCondition = () => {
				let pk_register = this.props.form.getFormItemsValue(this.formId, 'pk_register') && this.props.form.getFormItemsValue(this.formId, 'pk_register').value;
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let billpoolflag = this.props.form.getFormItemsValue(this.formId, 'billpoolflag') && this.props.form.getFormItemsValue(this.formId, 'billpoolflag').value;
				let pk_impawn = this.props.form.getFormItemsValue(this.formId, 'pk_impawn') && this.props.form.getFormItemsValue(this.formId, 'pk_impawn').value;;
				return {
					pk_register: pk_register,
					pk_org: pk_org,
					billpoolflag: billpoolflag,
					pk_impawn: pk_impawn,
					GridRefActionExt: "nccloud.web.fbm.fbm.impawn.filter.ImpawnBillFilter"
				};
			};
		}
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = (p) => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			}
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/