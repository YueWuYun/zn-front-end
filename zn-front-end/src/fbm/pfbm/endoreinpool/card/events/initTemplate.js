/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import { afterEvent } from './index';

export default function (props, templateCallback) {
	let app_code = props.getSearchParam('c');
	props.createUIDom(
		{
			pagecode: CARD.page_id,//页面id
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
		// 被背书单位
		else if (item.attrcode == 'endorsee') {
			item.showHistory = true;
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
				return {
					pk_org: pk_org && pk_org.value,
					GridRefActionExt: 'nccloud.web.fbm.pfbm.endoreinpool.filter.EndoreInPoolEndorseeFilter'
				};
			};
		}
		//参照过滤-票据编号
		else if (item.attrcode == 'pk_register') {
			item.showHistory = false;
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
				let busdate = this.props.form.getFormItemsValue(this.formId, 'busdate');
				let opbilltype = this.props.form.getFormItemsValue(this.formId, 'opbilltype');
				return {
					pk_org: pk_org && pk_org.value,
					opbilltype: opbilltype && opbilltype.value,
					busdate: busdate && busdate.value,
					GridRefActionExt: 'nccloud.web.fbm.pfbm.endoreinpool.filter.EndoreInPoolFbmbillnoFilter'
				};
			};
		}
		// 背书计划项目
		else if (item.attrcode === 'endoreplanitem') {
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
				return {
					pk_org: pk_org && pk_org.value,
					'inoutdirect': 0
				};
			};
		}
		// 收票计划项目
		else if (item.attrcode == 'gatherplanitem') {
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
				return {
					pk_org: pk_org && pk_org.value,
					'inoutdirect': 1
				};
			};
		}
		// 自定义项过滤
		else if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = (p) => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
				let pk_group = this.props.form.getFormItemsValue(this.formId, "pk_group");
				return {
					pk_org: pk_org && pk_org.value,
					pk_group: pk_group && pk_group.value,
				};
			}
		}
	});
	// 网银信息页签
	meta[CARD.form_ebankinfo].items.map((item) => {
		// 背书单位账户
		if (item.attrcode == 'endorserbankacc') {
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
					let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr');
					let busdate = this.props.form.getFormItemsValue(this.formId, 'busdate');
					let multiLang = this.props.MutiInit.getIntl(this.moduleId); //this.moduleId
					return {
						pk_org: pk_org && pk_org.value, // 组织
						pk_curr: pk_curr && pk_curr.value,
						busdate: busdate && busdate.value,
						// 是否过滤内部账户
						isinneraccFilter: true,
						// 是否过滤活期账户
						iscurrentFilter: true,
						// 是否过滤收入，收支类账户
						isarapFilter: true,
						refnodename: multiLang && multiLang.get('36180DA-000002'),/* 国际化处理： 使用权参照*/
						GridRefActionExt: "nccloud.web.fbm.base.filter.Bankacc4NCCRefModelFilter",
					};
				}
			);
		}
		// 被背书单位账户
		else if (item.attrcode == 'endorseebankacc') {
			return (
				item.queryCondition = () => {
					let endorsee = this.props.form.getFormItemsValue(this.formId, 'endorsee');
					let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr');
					let busdate = this.props.form.getFormItemsValue(this.formId, 'busdate');
					return {
						pk_cust: endorsee && endorsee.value,
						pk_curr: pk_curr && pk_curr.value,
						busdate: busdate && busdate.value,
						GridRefActionExt: 'nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC'
					};
				}
			);
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/