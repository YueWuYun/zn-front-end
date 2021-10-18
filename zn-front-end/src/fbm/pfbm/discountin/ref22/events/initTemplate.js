/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD,TRAN_CARD_PAGE_INFO } from '../../cons/constant';
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
		//办理人
		if (item.attrcode === 'vtransactorid') {
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
				};
			};
		}
		
		//票据类型过滤
		if (item.attrcode === 'fbmbilltype') {
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
				};
			};
		}

		//申请单编号
		if(item.attrcode == 'pk_discount_app'){
			item.showHistory = false;
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					let pk_discount_app = this.props.form.getFormItemsValue(this.formId, 'pk_discount_app').value;
					return {
						pk_org: pk_org, 
						pk_discount_app: pk_discount_app,
						GridRefActionExt: 'nccloud.web.fbm.pfbm.discountinpool.filter.Pk_discount_appInPoolFilter'
					};
				}
			);
		}
		
		//参照过滤-票据编号
		if (item.attrcode == 'pk_register') {
			// item.queryCondition = () => {
			// 	let data = props.form.getFormItemsValue(formId, 'pk_org').value;
			// 	return { pk_org: data };
			// };
			item.showHistory = false;
			return (
				// Bill4FbmNoGridRef({
					item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					let pk_curr = this.props.form.getFormItemsValue(this.formId, 'pk_curr').value;
					let billtypecode = this.props.form.getFormItemsValue(this.formId, 'pk_billtypecode').value;
					let onlinebankflag = this.props.form.getFormItemsValue(this.formId, 'onlinebankflag').value;
						return {
							pk_org: pk_org, // 
							pk_curr:pk_curr,
							billtype:billtypecode,
							onlinebankflag:onlinebankflag,
							// isShowUsual:'Y',
							// UsualGridRefActionExt:'nccloud.web.fbm.ref.filter.FbmBillNoGridRefFilter'
							GridRefActionExt:'nccloud.web.fbm.pfbm.discountinpool.filter.DiscountinpoolBillFilter'
						};
					}
				// })
			);
		}else if (item.attrcode == 'discount_account') {
			item.showHistory = false;
			return (
					item.queryCondition = () => {
						let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
						// let pk_bank = this.props.form.getFormItemsValue(this.formId, 'pk_discount_bank').value;
						let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_curr').value;
						let multiLang = this.props.MutiInit.getIntl(this.moduleId); //this.moduleId
						return {
							pk_org: pk_org, // 组织
							// pk_bankdoc:pk_bank,
							pk_curr:pk_currtype,
							refnodename:multiLang && multiLang.get('36200DT-000002'),/* 国际化处理： 使用权参照*/
							GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.SignPkcurrFilter"
						};
						
						// else{
						// 	return {
						// 		pk_org: pk_org, // 组织
						// 		refnodename:'使用权参照'
						// 	};

						// }
					}
			);
		}else if (item.attrcode == 'pk_discount_bank') {
			item.showHistory = true;
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					let discount_account = this.props.form.getFormItemsValue(this.formId, 'discount_account').value;
					let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_curr').value;
					return {
						pk_org: pk_org, // 组织
						pk_currtype,
					};
				}
			);
		}else if(item.attrcode == 'balanceplanitem'){
			// 贴现余额计划项目，收入项目
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					return {
						pk_org: pk_org, // 组织
						'inoutdirect':0
					};
				}
			);
		}else if(item.attrcode == 'interestplanitem'){
			// 贴现息计划项目，支出项目
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					return {
						pk_org: pk_org, // 组织
						'inoutdirect':1
					};
				}
			);
		}else if(item.attrcode == 'fbmplanitem'){
			// 资金计划项目为支出类的计划项目，支出项目
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					return {
						pk_org: pk_org, // 组织
						'inoutdirect':1
					};
				}
			);
		}else if(item.attrcode == 'chargeplanitem'){
			// 资金计划项目为支出类的计划项目，支出项目
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					return {
						pk_org: pk_org, // 组织
						'inoutdirect':1
					};
				}
			);
		}else if(item.attrcode == 'pk_costcenter'){
			// 资金计划项目为支出类的计划项目，支出项目
			return (
				item.queryCondition = () => {
					let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
					return {
						pk_org: pk_org, // 组织
					};
				}
			);
		}// 自定义项过滤
		else if (item.attrcode.indexOf("def")>-1) {
			//自定义档案按照组织或者集团过滤
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
				let pk_org = this.props.form.getFormItemsValue(this.formId,"pk_org").value;
				let pk_group = this.props.form.getFormItemsValue(this.formId,"pk_group").value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
					// GridRefActionExt: GridRefActionExt,
					// TreeRefActionExt: TreeRefActionExt,
					// UsualGirdRefActionExt: UsualGirdRefActionExt
				};
			}
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/