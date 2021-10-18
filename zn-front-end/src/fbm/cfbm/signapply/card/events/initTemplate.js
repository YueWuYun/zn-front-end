/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax } from 'nc-lightapp-front';
import { CARD, app_code } from '../../cons/constant';
import { buttonVisible } from './buttonVisible';
import { afterEvent } from './index';
import {
	orgVersionView
} from "../../../../../tmpub/pub/util/version/index";
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
				orgVersionView(props,this.formId,"pk_acceptorg","pk_acceptorg_v");
				orgVersionView(props,this.formId,"pk_applyorg","pk_applyorg_v");
				props.form.openArea('issecurity');
				props.form.openArea('acceptor');
				props.form.openArea('register');
				//props.form.openArea('operate');
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
	//受理资金组织信息
	meta['issecurity'].items.map(item => {
		if(item.attrcode === 'pk_acceptorg'){ //资金组织
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_group: pk_group,
					pk_org: pk_org,
					TreeRefActionExt: 'nccloud.web.fbm.ref.filter.FundOrgRefModelFilter'
				}; 
			};
		}


		if (item.attrcode === 'pk_banksecurityacc') { //保证金账户
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_acceptorg') && this.props.form.getFormItemsValue(this.formId, 'pk_acceptorg').value;
				let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype') && this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value;

                return {
					pk_org: pk_org,
					pk_currtype: pk_currtype,
					GridRefActionExt:'nccloud.web.fbm.pfbm.quotaapply.filter.QuotaaplySecurityAccountFilter4NCC'
                };
            };
		}
		//銀行賬戶
		if(item.attrcode === 'pk_applybankacc'){
			item.queryCondition = () => {
				let pk_acceptorg = this.props.form.getFormItemsValue(this.formId, 'pk_acceptorg') && this.props.form.getFormItemsValue(this.formId, 'pk_acceptorg').value;
				let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype') && this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
				let pk_bankdoc = this.props.form.getFormItemsValue(this.formId, 'pk_applybank') && this.props.form.getFormItemsValue(this.formId, 'pk_applybank').value;
                return {
					pk_acceptorg: pk_acceptorg,
					pk_org: pk_acceptorg,
					pk_currtype: pk_currtype,
					pk_applybank: pk_bankdoc,
					GridRefActionExt:'nccloud.web.fbm.cfbm.signapply.filter.BankaccRefModelFilter'
                };
            };
		}
		//申请银行
		if(item.attrcode === 'pk_applybank'){
			
		}
		
	});
	//申请财务组织信息
	meta['acceptor'].items.map(item => {
		 //内部保证金账户
		if (item.attrcode === 'pk_securityacc') {
			item.fieldDisplayed ='refcode';
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype') && this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
				let pk_acceptorg = this.props.form.getFormItemsValue(this.formId, 'pk_acceptorg') && this.props.form.getFormItemsValue(this.formId, 'pk_acceptorg').value;
                return {
					pk_org_i: pk_org,
					pk_currtype: pk_currtype,
					pk_acceptorg: pk_acceptorg,
					GridRefActionExt:'nccloud.web.fbm.cfbm.signapply.filter.InnerSecurityAccRefModelFilter'
                };
            };
		}
		//内部活期账户
		if(item.attrcode === 'pk_poundageacc'){
			item.fieldDisplayed ='refcode';
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype') && this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
				let pk_acceptorg = this.props.form.getFormItemsValue(this.formId, 'pk_acceptorg') && this.props.form.getFormItemsValue(this.formId, 'pk_acceptorg').value;
                return {
					pk_orgi: pk_org,
					pk_currtype: pk_currtype,
					pk_acceptorg: pk_acceptorg,
					GridRefActionExt:'nccloud.web.fbm.cfbm.signapply.filter.OutOrgFundAccRefModelFilter'
                };
            };
			
		}
		//开票计划项目
		if(item.attrcode === 'invoiceplanitem'){
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype') && this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value;

                return {
					pk_org: pk_org,
					pk_currtype: pk_currtype,
					GridRefActionExt:'nccloud.web.fbm.cfbm.signapply.filter.DefaultOutFundplanRefModelFilter'
                };
            };
		}
		
	});

	//票据基本信息
	meta['register'].items.map(item => {
		//票据类型
	   if (item.attrcode === 'fbmbilltype') {
			item.queryCondition = () => {
			return {
				GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
			};
		};
	   }
	   //收款人
	   if(item.attrcode === 'pk_receiveunit'){
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group') && this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					//GridRefActionExt: "nccloud.web.fbm.cfbm.signapply.filter.ReceiveCustRefModelFilter"
				};
			};
	   }

	   if(item.attrcode === 'pk_receivebankacc'){
		item.queryCondition = () => {
			let pk_receiveunit = this.props.form.getFormItemsValue(this.formId, 'pk_receiveunit') && this.props.form.getFormItemsValue(this.formId, 'pk_receiveunit').value;
			let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype') && this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
			return {
				pk_cust: pk_receiveunit,
				pk_curr: pk_currtype ,	
				GridRefActionExt:"nccloud.web.fbm.fbm.gather.filter.GatherBankAccFilter2Cust4NCC"	
			};
		};
   }
	   //业务组织
	   if(item.attrcode === 'pk_entrustorg'){
		item.queryCondition = () => {
			let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') && this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
                return {
				pk_org: pk_org,
				TreeRefActionExt:'nccloud.web.fbm.cfbm.signapply.filter.OrgRelationDataRefModelFilter'
                };
            };
	   }
	   
   });


		
	
	
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/