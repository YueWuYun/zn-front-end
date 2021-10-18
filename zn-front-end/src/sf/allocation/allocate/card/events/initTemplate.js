/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax, getBusinessInfo } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import BankaccSubDefaultGridTreeRef from '../../../../../uapbd/refer/pub/BankaccSubDefaultGridTreeRef';
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
import BankAccidGridRef from '../../../../../tmpub/refer/accid/AccidGridRef';
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';
//引入组织版本试图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import FinanceOrgAllGroupAllDataTreeRef from '../../../../../uapbd/refer/org/FinanceOrgByAllGroupTreeRef';
import FundManaSystemMemberByFinancePKTreeRef from '../../../../../uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef';
import { app_id, card_from_id, card_table1_id, card_table_formId, card_table2_id, card_page_id, funcode, card_table_id } from '../../cons/constant.js';
import { buttonVisible } from './buttonVisible';
import {getBodyBtnArr} from './bodyButtonVisible';
import { bodyButtonClick } from './bodyButtonClick';
import { afterEvent } from './index';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

const formId = 'form_allocate_01';
const tableId = 'table_allocate_01';
const pageId = '36320FA_C01';
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta,()=>{
						orgVersionView(props, card_from_id);
					});
					
					if (props.getUrlParam('status') == 'add') {
						props.form.setFormItemsVisible(card_from_id, { 'pk_org_v': false });
						//如果是新增，那么给制单人直接赋值
						let context = data.context;
						if (context.pk_org) {
							let pk_org = {
								value: context.pk_org,
								display: context.org_Name
							};

							afterEvent.call(that,props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
							// that.props.resMetaAfterPkorgEdit();
							// that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
						}else {
							props.form.setFormItemsDisabled(card_from_id, { 'memo': true, 'busitype': true, 'pk_currtype': true, 'isreversebustype': true });
						}
						// props.form.setFormItemsValue(card_from_id,{'billmaker':{value:businessInfo.userId,display:businessInfo.userName}})
					}
					if (props.getUrlParam('status') == 'edit' || props.getUrlParam('status') == 'copy') {
						props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true, 'pk_group': true, 'memo': false, 'busitype': false, 'pk_currtype': false, 'isreversebustype': false });

					}
					if (props.getUrlParam('status') == 'decide') {
					}
					if(!that.billId) {
						that.billId = that.props.getUrlParam('id');
					}
					that.status=that.props.getUrlParam('status');
					
					if (that.billId&&that.status!='add') {
						setTimeout(()=>{
						that.qryData()
						},0);
					}//新增
					else if (that.status === 'add') {
						setTimeout(()=>{
							// 清空表单form所有数据
							that.props.form.EmptyAllFormValue(card_from_id);
							that.setState({
								vbillno: ''
							});
							//清空table所有数据
							that.props.cardTable.setTableData(card_table_id, { rows: [] });
							// let that = that;
							
							//单据有主组织，新增时,将其他字段设置为不可编辑.
							// that.props.initMetaByPkorg();
							//把所有table中字段不可以编辑，直到选择org之后
							that.props.cardTable.setStatus(card_table_id, 'browse');
							let interfaceJump = that.props.getUrlParam('interfaceJump');
							if(interfaceJump === 'card'){
								//设置组织可以编辑
								that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
								that.props.form.setFormItemsDisabled(card_from_id,{'memo':true,'busitype':true,'pk_currtype':true,'isreversebustype':true});
							}
							that.props.form.setFormItemsValue(card_from_id,
								{
									'pk_org':{
										value: that.state.curr_pk_org,
										display: that.state.curr_orgname
									}
								}
							);
							
							if(that.state.curr_pk_org){
								let	pk_org = {
									value: that.state.curr_pk_org,
									display: that.state.curr_orgname
								};
								afterEvent.call(that,that.props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
								that.props.resMetaAfterPkorgEdit();
								that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
							}
							
							that.props.form.setFormItemsVisible(card_from_id, {'pk_org_v':false});
							that.toggleShow();
							// that.props.cardTable.addRow(that.tableId);
						},0);
						if(that.status=='edit') {
							setEditDisable(that.props);
						}

						debugger;
                    	let Allocationsourceid=props.getUrlParam('Allocationsourceid');
						let appcode=props.getUrlParam('appcode');
						if(Allocationsourceid!=null && appcode == '36320FA'){
                            debugger;
							ajax({
								//内贷放款单生成资金下拨单
								url:'/nccloud/sf/allocation/FinancePayToAllocateAction.do',  
								data: {
									"pks": [Allocationsourceid],
								 },
								success: (res) => {
                                    debugger;
									if(res.data){
										if (res.data.head) {
											that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });									
											that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true});							
										}
                                        debugger;
										if (res.data.body) {
											that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
											that.props.button.setButtonVisible(['addline','deleteline','copyline'], false);
										}
									}else{
										toast({
											color: 'warning',
											content: loadMultiLang(this.props, '36320FDA-000037'), //{/* 国际化处理： 未查询出符合条件的数据！*/}
										});
									}
								}
							})  
							//数据来源内部定期存入申请单后恢复字段可编辑
							that.props.resMetaAfterPkorgEdit();
							
						}

						let sourceid=props.getUrlParam('sourceid');
						if(sourceid!=null){
							ajax({
								//内部定期支取单生成下拨单
								url:'/nccloud/sf/allocation/FDWToAllocateAction.do',  
								data: {
									"pks": [sourceid],
								 },
								success: (res) => {
									if(res.data){
										if (res.data.head) {
											that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });									
											that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true ,'busitype':true,'pk_currtype':true,'isreversebustype':true,'pk_group':true});
										}
										if (res.data.body) {
											that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
											that.props.button.setButtonVisible(['addline','deleteline','copyline'], false);
										}
									}else{
										toast({
											color: 'warning',
											content: loadMultiLang(this.props, '36340FDW-000012'), //{/* 国际化处理： 未查询出符合条件的数据！*/}
										});
									}
								}
							})  
						}
					}else {
						setTimeout(()=>{
							that.props.form.EmptyAllFormValue(card_from_id);
							that.props.cardTable.setTableData(card_table_id, { rows: [] });
							that.toggleShow();
						 },0);
						
					}
				}
				if (data.button) {
					let button = data.button;
					
					props.button.setButtons(button);
					buttonVisible.call(that, props);
					
				}
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	
	meta[card_table_id].items.find((e) => e.attrcode == 'pk_org_r').isShowUnit = true;
	meta[card_table_formId].items.find((e) => e.attrcode == 'pk_org_r').isShowUnit = true;
	// meta[card_table_id].items.find((e) => e.attrcode == 'pk_bankacc_r').isShowUnit =true;
	//参照历史记录处理 //yangjn 2020/1/7 新需求修改显示历史纪录
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_org_r').showHistory = true;
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_bankacc_r').showHistory = true;
	meta[card_table_formId].items.find((e) => e.attrcode === 'pk_org_r').showHistory = true;
	meta[card_table_formId].items.find((e) => e.attrcode === 'pk_bankacc_r').showHistory = true;
	// meta[card_table_id].items.find((e) => e.attrcode === 'pk_accid_r').showHistory = false;
	// meta[card_from_id].items.find((e) => e.attrcode == 'pk_org').isShowUnit =true;
	if (status == 'decide') {
		meta[formId].status = 'edit';
		meta[tableId].status = 'edit';
	} else {
		meta[formId].status = status;
		meta[tableId].status = status;
	}


	meta[formId].items.map((item) => {
		// 资金组织过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			}
		}
	});

	meta[tableId].items.map((item) => {
		//组织计划项目
		if (item.attrcode == 'pk_planitem_p') {
			item.render = function (text, record, index) {
				return (
					FundPlanTreeRef({
						queryCondition: () => {
							return {
								pk_org: props.form.getFormItemsValue(formId, 'pk_org').value
							};
						}
					})
				);
			}
		}
		//收款单位计划项目
		if (item.attrcode == 'pk_planitem_r') {
			item.render = function (text, record, index) {
				return (
					FundPlanTreeRef({
						queryCondition: () => {
							let pk_org = props.form.getFormItemsValue('form_allocate_01', 'pk_org').value;
							let pk_org_r = record.values.pk_org_r;
							let org='';
							if(pk_org_r&&pk_org_r.value) {
								org=pk_org_r.value;
							}else {
								org=pk_org;
							}
							return {
								pk_org: org
							};
						}
					})
				);
			}
		}
		// 内部账户根据币种过滤
		if (item.attrcode == 'pk_accid_r') {
			item.render = function (text, record, index) {
				return (
					BankAccidGridRef({
						queryCondition: () => {
							let pk_currtype = props.form.getFormItemsValue('form_allocate_01', 'pk_currtype').value;
							let pk_org = props.form.getFormItemsValue('form_allocate_01', 'pk_org').value;
							let pk_org_r = record.values.pk_org_r.value;
							return {
								pk_currtype: pk_currtype,
								pk_org: pk_org,
								pk_org_r: pk_org_r,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateReceiveOrgRefAccFilter,nccloud.web.sf.allocation.allocate.filter.DefaultRefAccFilter'
							};
						}
					})
				);
			}
		}
		// 下拨银行账户根据币种过滤
		if (item.attrcode == 'pk_bankacc_p') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
								pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccNoFrozenFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefPBankAccFilter,nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoDestroyFilter4NCC'
							};
						}
					})
				);
			}
		}
		// 收款银行账户根据币种过滤
		if (item.attrcode == 'pk_bankacc_r') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_org_r: record.values.pk_org_r.value,
								pk_org: record.values.pk_org_r.value,
								refnodename: loadMultiLang(props,'36320FA-000048'),/* 国际化处理： 使用权参照*/
								pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefRBankAccFilter,nccloud.web.tmpub.filter.BanksubaccNoDestroyFilter4NCC'
							};
						}
					})
				);
			}
		}
		// 收款银行账户根据币种过滤
		if (item.attrcode == 'bankacccode_r') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_currtype: props.form.getFormItemsValue('form_allocate_01', 'pk_currtype').value,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefRBankAccFilter'
							};
						}
					})
				);
			}
		}
		// 下拨单主组织和收款单位依赖委托
		if (item.attrcode == 'pk_org_r') {
			item.render = function (text, record, index) {
				let busitype = props.form.getFormItemsValue(formId, 'busitype').value;
				if (busitype == '2') {
					return (
						FinanceOrgAllGroupAllDataTreeRef({
							queryCondition: () => {
								return {
									busitype: props.form.getFormItemsValue(formId, 'busitype').value,
									pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
									pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
									TreeRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
								};
							}
						})
					);
				} else {
					return (
						FundManaSystemMemberByFinancePKTreeRef({
							queryCondition: () => {
								return {
									busitype: props.form.getFormItemsValue(formId, 'busitype').value,
									pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
									pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
									pk_group: props.form.getFormItemsValue(formId, 'pk_group').value,
									TreeRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
								};
							}
						})
					);
				}
			}

		}
		// 下拨单子表收款单位计划项目根据组织过滤
		if (item.attrcode == 'pk_planitem_r') {
			item.render = function (text, record, index) {
				return (
					FundPlanTreeRef({
						queryCondition: () => {
							return {
								pk_org: props.form.getFormItemsValue('form_allocate_01', 'pk_org').value
							};
						}
					})
				);
			}
		}
	});

	meta[card_table_formId].items.map((item) => {
		// 内部账户根据币种过滤
		if (item.attrcode == 'pk_accid_r') {
			item.render = function (text, record, index) {
				return (
					BankAccidGridRef({
						queryCondition: () => {
							let pk_currtype = props.form.getFormItemsValue('form_allocate_01', 'pk_currtype').value;
							let pk_org = props.form.getFormItemsValue('form_allocate_01', 'pk_org').value;
							let pk_org_r = record.values.pk_org_r.value;
							return {
								pk_currtype: pk_currtype,
								pk_org: pk_org,
								pk_org_r: pk_org_r,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateReceiveOrgRefAccFilter,nccloud.web.sf.allocation.allocate.filter.DefaultRefAccFilter'
							};
						}
					})
				);
			}
		}
		// 下拨银行账户根据币种过滤
		if (item.attrcode == 'pk_bankacc_p') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
								pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccNoFrozenFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefPBankAccFilter,nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoDestroyFilter4NCC'
							};
						}
					})
				);
			}
		}
		// 收款银行账户根据币种过滤
		if (item.attrcode == 'pk_bankacc_r') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_org_r: record.values.pk_org_r.value,
								pk_org: record.values.pk_org_r.value,
								refnodename: loadMultiLang(props,'36320FA-000048'),/* 国际化处理： 使用权参照*/
								pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefRBankAccFilter,nccloud.web.tmpub.filter.BanksubaccNoDestroyFilter4NCC'
							};
						}
					})
				);
			}
		}
		// 收款银行账户根据币种过滤
		if (item.attrcode == 'bankacccode_r') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_currtype: props.form.getFormItemsValue('form_allocate_01', 'pk_currtype').value,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefRBankAccFilter'
							};
						}
					})
				);
			}
		}
		
		// 下拨单子表收款单位计划项目根据组织过滤
		if (item.attrcode == 'pk_planitem_r') {
			item.render = function (text, record, index) {
				return (
					FundPlanTreeRef({
						queryCondition: () => {
							return {
								pk_org: props.form.getFormItemsValue('form_allocate_01', 'pk_org').value
							};
						}
					})
				);
			}
		}
		// 下拨单主组织和收款单位依赖委托
		if (item.attrcode == 'pk_org_r') {
			item.render = function (text, record, index) {
				let busitype = props.form.getFormItemsValue(formId, 'busitype').value;
				if (busitype == '2') {
					return (
						FinanceOrgAllGroupAllDataTreeRef({
							queryCondition: () => {
								return {
									busitype: props.form.getFormItemsValue(formId, 'busitype').value,
									pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
									pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
									TreeRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
								};
							}
						})
					);
				} else {
					return (
						FundManaSystemMemberByFinancePKTreeRef({
							queryCondition: () => {
								return {
									busitype: props.form.getFormItemsValue(formId, 'busitype').value,
									pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
									pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
									pk_group: props.form.getFormItemsValue(formId, 'pk_group').value,
									TreeRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
								};
							}
						})
					);
				}
			}

		}
	});
	let multiLang = props.MutiInit.getIntl('36320FA_C01');
	let fold = loadMultiLang(props,'36320FA-000050')/* 国际化处理： 收起*/
	let unfold = loadMultiLang(props,'36320FA-000051')/* 国际化处理： 展开*/
	let porCol = {
		attrcode: 'opr',
		label: loadMultiLang(props,'36320FA-000049'),/* 国际化处理： 操作*/
		visible: true,
		fixed: 'right',
		width: 200,
		className: "table-opr",
		itemtype: 'customer',
		render(text, record, index) {
			let status = props.cardTable.getStatus(tableId);
			let copyflag = that.copyflag;
			let showWord = that.state.showWord;
			//判断复制标识
			if (copyflag) {
				let buttonAry = ['copythis'];
				return props.button.createOprationButton(buttonAry, {
					area: 'card_inner',
					buttonLimit: 3,
					onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
				});
			} else {
				return <div className="currency-opr-col">{
					props.button.createOprationButton(getBodyBtnArr(props, record,copyflag),
						{
							area: 'card_inner',
							buttonLimit: '3',
							onButtonClick: (props, key) => { bodyButtonClick.call(that, props, key, text, record, index) }
						})
				}</div>;
			}
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/