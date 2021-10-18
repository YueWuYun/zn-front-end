/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front'; 
import { buttonVisible } from './buttonVisible';
import { buttonClick } from './buttonClick';

import { versionControl } from "../../util/index";
import { afterEvent } from "./index";
//引入常量定义
import { APP_INFO, CARD_PAGE_INFO, UI_CONF, SHOW_MODE, URL_INFO ,TRAN_CARD_PAGE_INFO,PROP_EXT_OBJ} from '../../cons/constant';
//财务组织参照
import FinanceOrgTreeRef from '../../../../../uapbd/refer/org/FinanceOrgTreeRef';
//资金计划参照
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';
//资金组织参照   
import FundOrgTreeRef from '../../../../../uapbd/refer/org/FundOrgTreeRef';
//散户
import FreeCustGridRef from '../../../../../uapbd/refer/customer/FreeCustGridRef';
//部门
import DeptTreeRef from '../../../../../uapbd/refer/org/DeptTreeRef';
//人员
import PsnDocTreeGridRef from '../../../../../uapbd/refer/psninfo/PsnDocTreeGridRef';
//客商银行账户
import CustBankAccGridRef from '../../../../../uapbd/refer/pub/CustBankAccGridRef';
//客商
import CustSupplierFlexGridTreeRef from '../../../../../uapbd/refer/supplier/CustSupplierFlexGridTreeRef';
//项目
import ProjectDefaultTreeGridRef from '../../../../../uapbd/refer/pm/ProjectDefaultTreeGridRef';
//付款合同
import ApFctGridRef from '../../../../../fct/refer/bill/ap';
import { setPropCache, getPropCache, hasDefaultOrg, setDefOrg2Form, loadMultiLang } from "../../../../../tmpub/pub/util/index";

let { NCPopconfirm } = base;

export const initTemplate = function (props, isclear) {
	//从页面级缓存中获取页面对象（Card对象）
	const that = getPropCache(props, APP_INFO.FUNCODE, PROP_EXT_OBJ.CONTAIN);
	//交易类型
	let pagecode = props.getUrlParam('pagecode');
	let refpk = props.getUrlParam('refpk');
	let refname = props.getUrlParam('refname');
	let refcode = props.getUrlParam('refcode');
	//适配采购付款计划推付款申请
	let srcbilltype = props.getUrlParam('srcbilltype');
	if(!pagecode){
		pagecode = TRAN_CARD_PAGE_INFO.PAGE_CODE;
	}
	//构建DOM请求(平台提供api)
	props.createUIDom(
		{ pagecode: pagecode },
			(data) => {
				if (!data) {
					return;
				}
				let status = props.getUrlParam('status');	
				if (data.template) {
					let meta = data.template;
					//个性化处理模板
					meta = modifierMeta.call(that, props, meta); 
					props.meta.setMeta(meta, () => {
						if (status == 'add') {							
							if(srcbilltype){

							//没有默认组织时，控制字段不可编辑
							}else if (!data.context || !data.context.pk_org || isclear) {
								//组织可编辑其余字段不可编辑
								props.initMetaByPkorg();
							}	
							if(refpk||refname){
								props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { pk_trantypeid: {value:refpk,display:refname} });
								props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { pk_trantypecode: {value:refcode,display:refcode} });
							}		
						} else {
							let iscopy = props.getUrlParam('isCopy');
							let orgedit = (status == 'add' && !iscopy);
							//非新增状态，组织不可编辑
							props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_org': !orgedit });
						}		
						versionControl(props);
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible(props);
				}
				//新增时，处理新增默认值事件
				if (status == 'add' && !isclear && !srcbilltype) {
					//获取默认组织
					if (!data.context || !data.context.pk_org) {
						return;
					}
					let { pk_org, org_Name, pk_org_v, org_v_Name } = data.context;
					//设置默认组织
					props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, {
						'pk_org': { value: pk_org, display: org_Name },
						'pk_org_v': { value: pk_org_v, display: org_v_Name },
					})
					//触发新增默认值事件
					afterEvent(props, CARD_PAGE_INFO.HEAD_CODE, 'default', { value: pk_org, display: org_Name });
				}
		}
	);	
}

function modifierMeta(props, meta) {
	const that = this;
	let status = props.getUrlParam('status');	
	meta[CARD_PAGE_INFO.HEAD_CODE].status = status;
	meta[CARD_PAGE_INFO.BODY_CODE].status = status;
	//不显示历史记录
	meta[CARD_PAGE_INFO.HEAD_CODE].items.find((e) => e.attrcode === 'pk_supplier').showHistory = false;
	meta[CARD_PAGE_INFO.HEAD_CODE].items.find((e) => e.attrcode === 'pk_bankacc_p').showHistory = false;
	meta[CARD_PAGE_INFO.HEAD_CODE].items.find((e) => e.attrcode === 'pk_bankacc_r').showHistory = false;
	meta[CARD_PAGE_INFO.HEAD_CODE].items.find((e) => e.attrcode === 'pk_bankacc_pd').showHistory = false;
	meta[CARD_PAGE_INFO.HEAD_CODE].items.find((e) => e.attrcode === 'pk_supplier').showHistory = false;

	//表头字段参照过滤
	meta[CARD_PAGE_INFO.HEAD_CODE].items.map((item) => {
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: APP_INFO.FUNCODE,
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPApplyOrgBuilder'
				};
			};
		}
        if (item.attrcode == 'pk_supplier') {
            item.queryCondition = () => {
                return {
	                pk_org: (props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value,
					// GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.SelfSupplierRefFilter'//自定义参照过滤条件					
                };
            };
        }
		else if (item.attrcode == 'pk_trantypeid') {
			item.queryCondition = () => {		                
                return {
					GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.TranstypeFilter'//自定义参照过滤条件
                };
            };
		}
		else if (item.attrcode == 'pk_bankacc_p') {
			item.queryCondition = () => {		
				return {
					key:'pk_bankacc_p',
					pk_org: (props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org')||{}).value,
					pk_currtype: (props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype')||{}).value,
					paytype:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'paytype')||{}).value,
					isputdown:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'isputdown')||{}).value,
					refnodename: loadMultiLang(props, '36070APM--000113'),
					GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.PayBankaccFilter'
				};  
            };
		}
		else if (item.attrcode == 'pk_bankacc_r') {
			let customer = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'customer');
			if (customer && customer.value) {
				item.itemType = 'refer';
				item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';				
				item.refName = loadMultiLang(props, '36070APM--000130')/* 国际化处理： 客户银行账户*/;

				item.queryCondition = () => {	
	                return {				
						pk_currtype:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype')||{}).value,
						pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org')||{}).value,
						pk_cust:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_supplier')||{}).value,
						customer: (props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'customer')||{}).value						
	                };
	            };
			}else{
				item.itemType = 'refer';
				item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index'; 
				item.refName = loadMultiLang(props, '36070APM--000131')/* 国际化处理： 客商银行账户*/;

				item.queryCondition = () => {	
	                return {
						key:'pk_bankacc_r',							
						pk_currtype:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype')||{}).value,
						pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org')||{}).value,
						pk_cust:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_supplier')||{}).value,
						customer: (props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'customer')||{}).value,
						GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.PayBankaccFilter'//自定义参照过滤条件
	                };
				};
			}			
		}
		else if (item.attrcode == 'pk_bankacc_pd') {
			item.queryCondition = () => {					
				return {	
					key:'pk_bankacc_pd', 	
					pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org')||{}).value,					
					pk_currtype:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype')||{}).value,
					paytype:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'paytype')||{}).value,
					refnodename: loadMultiLang(props, '36070APM--000113'),
					GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.PayBankaccFilter'//自定义参照过滤条件
                };
            };
		}
		else if (item.attrcode == 'pk_busitype') {					   
			item.queryCondition = () => {	     
				return {
					pk_trantypecode:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_trantypecode')||{}).value,
					GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.BusinessTypeFilter'//自定义参照过滤条件
                };
            };
		}
		else if (item.attrcode == 'pk_planitem') {
			item.queryCondition = () => {	        
                return {
					GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.FundplanFilter'//自定义参照过滤条件
                };
            };
		}	
		else if (item.attrcode == 'pk_decidedept') {						
			item.queryCondition = () => {	   
				return {
					pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value, 
					GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.DecidedeptRefbyFinanceorgFilter'//自定义参照过滤条件
                };
            };
		} 
		else if (item.attrcode == 'pk_resuser') {				
			item.queryCondition = () => {	
				return {
					pk_acceptorg:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value,
					pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org')||{}).value,
					GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.ResuserRefByFinanceorgFilter'//自定义参照过滤条件
                };
            };
		} 
		else if (item.attrcode == 'pk_acceptorg') {					
			item.queryCondition = () => {	   
				return {
					pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org')||{}).value,    
					GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.HeadAcceptorgListener'//自定义参照过滤条件
                };
            };
		} 
		else if(item.attrcode == 'customer'){
			 item.queryCondition = () => {
	             return {
	                pk_org: (props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value
				 };
			};	
		}	
		else if(item.attrcode.startsWith('vdef')){
			item.queryCondition = () => {
				return {
					pk_org: (props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value
				};
			};
		}			        
    });
	
	
	//表体字段参照过滤
	meta[CARD_PAGE_INFO.BODY_CODE].items.map((item) => { 
		bodyItemFilter(props, item)
	});	
	//编辑态表体参照过滤
	meta[CARD_PAGE_INFO.BODY_EDIT_CODE].items.map((item) => {
		bodyItemFilter(props, item)
	});
	
	let porCol = {
		attrcode: 'opr',
		//操作
		label: loadMultiLang(props, '36070APM--000016'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		render(text, record, index) {
			let status = props.cardTable.getStatus(CARD_PAGE_INFO.BODY_CODE);
			let rowButtons = getRowButton.call(that, props, record);
			return (<div className="currency-opr-col">{
				props.button.createOprationButton(rowButtons, {
					area: "card_body_inner",
					buttonLimit: UI_CONF.BUTTON_LIMIT,
					onButtonClick: (props, key) => buttonClick.call(that, props, key, text, record, index)
				})
			}</div>);
		}
	};
	meta[CARD_PAGE_INFO.BODY_CODE].items.push(porCol);
	return meta;
}


/**
 * 获取行按钮
 * @param {*} record 行数据
 */
const getRowButton = function (props, record) {
	let rowButtons;	
	let status = props.getUrlParam('status');
	status = status == SHOW_MODE.COPY ? SHOW_MODE.ADD : status;
	if (status == SHOW_MODE.BROWSER) {
		rowButtons = record.expandRowStatus ? ['closedown'] : ['opendown'];
	}
	else if(status == SHOW_MODE.ADD || status == SHOW_MODE.EDIT) {
		let { isRowCopy } = this.state
		if (isRowCopy) {
			rowButtons = ['PastLine'];
		} else {
			rowButtons = ['Openedit', 'Copybody', 'Insertline', 'Deleteline'];
		}
		
	} 	
	return rowButtons;
}




/**
 * 表体参照过滤  FundPlanTreeRef  FreeCustGridRef   DeptTreeRef  PsnDocTreeGridRef
 * @param {*} props 
 * @param {*} item 
 */
const bodyItemFilter = function (props, item) {
	if (item.attrcode == 'pk_supplier') {
		item.render = function (text, record, index) {
			return (
				CustSupplierFlexGridTreeRef({
					queryCondition: () => {
						return {							
							pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value,
							// TreeRefActionExt: 'nccloud.web.cmp.apply.apply.filter.item.PlanitemRefbyFinanceorgFilter'
						};
					}
				})
			);
		};
	}
	else if (item.attrcode == 'pk_planitem') {
		item.render = function (text, record, index) {
			return (
				FundPlanTreeRef({
					queryCondition: () => {
						return {							
							pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value,
							TreeRefActionExt: 'nccloud.web.cmp.apply.apply.filter.item.PlanitemRefbyFinanceorgFilter'
						};
					}
				})
			);
		}
	}
	//散户参照过滤
	else if (item.attrcode == 'freecust') {
		item.render = function (text, record, index) {
			return (
				FreeCustGridRef({
					queryCondition: () => {
						return {
							customSupplier:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_supplier')||{}).value,
							// GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.item.PlanitemRefbyFinanceorgFilter'
						};
					}
				})
			);
		}
	}
	//经办部门参照过滤
	else if (item.attrcode == 'pk_decidedept') {
		item.render = function (text, record, index) {
			return (
				DeptTreeRef({
					queryCondition: () => {
						return {
							pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value, 
							GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.DecidedeptRefbyFinanceorgFilter'//自定义参照过滤条件
			            };
					}
				})
			);
		} 	
	}
	//业务员参照过滤
	else if (item.attrcode == 'pk_resuser') {
		item.render = function (text, record, index) {		
			return(
				PsnDocTreeGridRef({
					queryCondition: () => {
						return {
							pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value, 
							// GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.DecidedeptRefbyFinanceorgFilter'//自定义参照过滤条件
			            };
					}
				})	
			);				
		}
	}
	//项目参照过滤
	else if (item.attrcode == 'pk_project') {
		item.render = function (text, record, index) {
			return(
				ProjectDefaultTreeGridRef({
					queryCondition: () => {
						return {
							pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')||{}).value, 
							// GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.DecidedeptRefbyFinanceorgFilter'//自定义参照过滤条件
			            };
					}
				})	
			);		
		}
	}
	//付款合同参照过滤
	else if (item.attrcode == 'paycontract') {
		item.render = function (text, record, index) {
			return(
				ApFctGridRef({
					queryCondition: () => {											   
			            return {
							pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg')|| {}).value, 
							cvendorid:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_supplier')|| {}).value,
							corigcurrencyid:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype')|| {}).value
			            };
					}
				})
			)			
		}
	}
	//收款银行账户参照过滤
	else if (item.attrcode == 'pk_bankacc_r') {
		item.render = function (text, record, index) {
			return (
				CustBankAccGridRef({
					queryCondition: () => {						
						return {							
							pk_org:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg') || {}).value,
							pk_cust:record.values.customer&&record.values.customer.value?(record.values.customer || {}).value:(record.values.pk_supplier || {}).value,
							pk_currtype:(props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype')|| {}).value,
							accclass:record.values.customer&&record.values.customer.value?1:2
							// TreeRefActionExt: 'nccloud.web.cmp.apply.apply.filter.item.PlanitemRefbyFinanceorgFilter'
						};
					}
				})
			);		
		}
	}
}



/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/