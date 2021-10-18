/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
let { NCPopconfirm } = base;
// 使用权参照
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
// 资金组织计划项目
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';
import CurrtypeGridRef from '../../../../../uapbd/refer/pubinfo/CurrtypeGridRef';
//财务组织(所有集团)
import FinanceOrgAllGroupAllDataTreeRef from '../../../../../uapbd/refer/org/FinanceOrgByAllGroupTreeRef';
import FundManaSystemMemberByFinancePKTreeRef from '../../../../../uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef';
// 内部账户参照
import AccidGridRef from '../../../../../tmpub/refer/accid/AccidGridRef';
import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';
import { setCardShouderBtnUseful } from "../../util/index";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index.js";
import { afterEvent } from './index';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
const formId = 'form_allocaterule_01';
const tableId = 'table_allocaterule_C01';
const pageId = '36320AAC_C01';
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c')  //复制小应用时传输
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta, () => {
						//新增时，资金组织可编辑，其余字段不可编辑
						if (props.getUrlParam('status') == 'add') {
							props.initMetaByPkorg();
						}
						//复制或修改时，资金组织不可编辑
						if (props.getUrlParam('status') == 'edit' || props.getUrlParam('status') == 'copy') {
							that.props.form.setFormItemsDisabled(jsoncode.formcode, { 'pk_org': true });
						}
					});
					//组织多版本
					orgVersionView(props, jsoncode.formcode);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(that, props);
					//设置表体按钮：1.不选组织时，都不可用；2.选择组织，只有增行可用；3.选中行，按钮才均可用
					setCardShouderBtnUseful(that.props);
				}
				if (data.context) {
					let context = data.context;
					that.setState({
						curr_pk_org: context.pk_org,
						curr_orgname: context.org_Name,
						curr_pk_org_v: context.pk_org_v,
						curr_orgname_v: context.org_v_Name,
					});
					if (props.getUrlParam('status') === 'add') {
						that.props.form.setFormItemsValue(jsoncode.formcode,
							{
								'pk_org': {
									value: context.pk_org,
									display: context.org_Name
								},
								'pk_org_v': {
									value: that.state.curr_pk_org_v,
									display: that.state.curr_orgname_v
								}
							}
						);
						if (context.pk_org) {
							let pk_org = {
								value: context.pk_org,
								display: context.org_Name
							};
							//最后一个参数判定为 默认给pk_org赋值时启动 解决oldvalue 和 newvlaue都有值的问题
							afterEvent.call(that, that.props, jsoncode.formcode, "pk_org", pk_org, null, null, null, null, true);
							that.props.resMetaAfterPkorgEdit();
							that.props.form.setFormItemsDisabled(jsoncode.formcode, { 'pk_org': false });
						}
					}
				}
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	//参照历史记录不显示
	meta[tableId].items.find((e) => e.attrcode === 'pk_financeorg').showHistory = false;
	meta['childform2_allocaterule_01'].items.find((e) => e.attrcode === 'pk_financeorg').showHistory = false;
	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_org_v') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(formId, 'vbillcode').value;
				return { vbillcode: data };
			};
		}
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					//funcode: jsoncode.appcode,
					//用来解决复制小应用的组织权限
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}

		//下拨银行账号
		 if (item.attrcode == 'pk_bankacc_p') {

			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					refnodename: loadMultiLang(props,'36320AAC-000015'),/* 国际化处理： 使用权参照*/
					pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
					//GridRefActionExt: 'nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleCurrentRefBankAccFilter,nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleDefaultRefPBankAccFilter'
					//自己写的不好用，先用allcate的，但是也有问题
					GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccNoFrozenFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefPBankAccFilter,nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoDestroyFilter4NCC'
				    
				};
			};
		}
		// // 下拨银行账户根据币种过滤
		// if (item.attrcode == 'pk_bankacc_p') {
		// 	item.render = function (text, record, index) {
		// 		return (
		// 			BankaccSubUseTreeGridRef({
		// 				queryCondition: () => {
		// 					return {
		// 						pk_org:props.form.getFormItemsValue(formId,'pk_org').value,
		// 						pk_currtype: props.form.getFormItemsValue(formId,'pk_currtype').value,
		// 						GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccNoFrozenFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefPBankAccFilter,nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoDestroyFilter4NCC'
		// 					};
		// 				}
		// 			})
		// 		);
		// 	}
		// }
	});
	// //下拨规则参照过滤
	meta[tableId].items.map((item) => {
		//下拨银行账号参照过滤
		// if (item.attrcode == 'pk_bankacc_p') {
		// 	debugger;
		// 	item.render = function (text, record, index) {
		// 		return (
		// 			BankaccSubUseTreeGridRef({
		// 				queryCondition: () => {
		// 					return {
		// 						pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
		// 						refnodename: '使用权参照',
		// 						pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
		// 						//目前DeliveryRuleDefaultRefPBankAccFilter会报为找到标识列错误
		// 						GridRefActionExt: 'nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleCurrentRefBankAccFilter,nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleDefaultRefPBankAccFilter'
		// 					};
		// 				}
		// 			})
		// 		);
		// 	}
		// }
		//单位银行账号参照过滤
		if (item.attrcode == 'pk_bankacc_r') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: (record.values.pk_financeorg || {}).value,
								pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
								refnodename: loadMultiLang(props,'36320AAC-000015'),/* 国际化处理： 使用权参照*/
								GridRefActionExt: 'nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleCurrentRefBankAccFilter,nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleDefaultRefRBankAccFilter'
							};
						}
					})
				);
			}
		}
		// 资金组织计划项目 
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
		// 单位计划项目 
		if (item.attrcode == 'pk_planitem_r') {
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
		//成员单位 参照过滤  参考allocate业务
		if (item.attrcode == 'pk_financeorg') {
			debugger
			item.render = function (text, record, index) {
				let busitype=props.form.getFormItemsValue(formId,'busitype').value;
				if(busitype=='2') {
					return (
						FinanceOrgAllGroupAllDataTreeRef({
							queryCondition: () => {
								return {
									busitype:props.form.getFormItemsValue(formId,'busitype').value,
									pk_currtype: props.form.getFormItemsValue(formId,'pk_currtype').value,
									pk_org:props.form.getFormItemsValue(formId,'pk_org').value,
									TreeRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
								};
							}
						})
					);
				}else {
					return (
						FundManaSystemMemberByFinancePKTreeRef({
							queryCondition: () => {
								return {
									busitype:props.form.getFormItemsValue(formId,'busitype').value,
									pk_currtype: props.form.getFormItemsValue(formId,'pk_currtype').value,
									pk_org:props.form.getFormItemsValue(formId,'pk_org').value,
									pk_group:props.form.getFormItemsValue(formId,'pk_group').value,
									TreeRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
								};
							}
						})
					);
				}
			}
				
		}
		// 单位内部账户 参考delivery业务的
		if (item.attrcode == 'pk_accid') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					AccidGridRef({
						queryCondition: () => {
							let accid_pk_org_p = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, index, 'pk_financeorg');
							if (accid_pk_org_p && accid_pk_org_p.value) {
								accid_pk_org_p = accid_pk_org_p.value;
							} else {
								accid_pk_org_p = null;
							}

							let accid_pk_org = props.form.getFormItemsValue(formId, 'pk_org');
							if (accid_pk_org && accid_pk_org.value) {
								accid_pk_org = accid_pk_org.value;
							} else {
								accid_pk_org = null;
							}

							let accid_currtype = props.form.getFormItemsValue(formId, 'pk_currtype');
							if (accid_currtype && accid_currtype.value) {
								accid_currtype = accid_currtype.value;
							} else {
								accid_currtype = null;
							}

							return {
								pk_org: accid_pk_org,
								pk_ownerorg: accid_pk_org_p,
								pk_currtype: accid_currtype,
								//自定义增加的过滤条件
								GridRefActionExt: 'nccloud.web.sf.delivery.delivery.filter.DefaultRefAccFilter4NCC'
							};
						}
					})
				);
			}
		}
	});
	// //下拨规则参照过滤
	meta['childform2_allocaterule_01'].items.map((item) => {
		//下拨银行账号参照过滤
		// if (item.attrcode == 'pk_bankacc_p') {
		// 	debugger;
		// 	item.render = function (text, record, index) {
		// 		return (
		// 			BankaccSubUseTreeGridRef({
		// 				queryCondition: () => {
		// 					return {
		// 						pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
		// 						refnodename: '使用权参照',
		// 						pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
		// 						//目前DeliveryRuleDefaultRefPBankAccFilter会报为找到标识列错误
		// 						GridRefActionExt: 'nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleCurrentRefBankAccFilter,nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleDefaultRefPBankAccFilter'
		// 					};
		// 				}
		// 			})
		// 		);
		// 	}
		// }
		//单位银行账号参照过滤
		if (item.attrcode == 'pk_bankacc_r') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: (record.values.pk_financeorg || {}).value,
								pk_currtype: props.form.getFormItemsValue(formId, 'pk_currtype').value,
								refnodename: loadMultiLang(props,'36320AAC-000015'),/* 国际化处理： 使用权参照*/
								GridRefActionExt: 'nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleCurrentRefBankAccFilter,nccloud.web.sf.allocate.allocaterule.filter.AllocateRuleDefaultRefRBankAccFilter'
							};
						}
					})
				);
			}
		}
		// 资金组织计划项目 
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
		// 单位计划项目 
		if (item.attrcode == 'pk_planitem_r') {
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
		//成员单位 参照过滤  参考allocate业务
		if (item.attrcode == 'pk_financeorg') {
			debugger
			item.render = function (text, record, index) {
				let busitype=props.form.getFormItemsValue(formId,'busitype').value;
				if(busitype=='2') {
					return (
						FinanceOrgAllGroupAllDataTreeRef({
							queryCondition: () => {
								return {
									busitype:props.form.getFormItemsValue(formId,'busitype').value,
									pk_currtype: props.form.getFormItemsValue(formId,'pk_currtype').value,
									pk_org:props.form.getFormItemsValue(formId,'pk_org').value,
									TreeRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
								};
							}
						})
					);
				}else {
					return (
						FundManaSystemMemberByFinancePKTreeRef({
							queryCondition: () => {
								return {
									busitype:props.form.getFormItemsValue(formId,'busitype').value,
									pk_currtype: props.form.getFormItemsValue(formId,'pk_currtype').value,
									pk_org:props.form.getFormItemsValue(formId,'pk_org').value,
									pk_group:props.form.getFormItemsValue(formId,'pk_group').value,
									TreeRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
								};
							}
						})
					);
				}
			}
				
		}
		// 单位内部账户 参考delivery业务的
		if (item.attrcode == 'pk_accid') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					AccidGridRef({
						queryCondition: () => {
							let accid_pk_org_p = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, index, 'pk_financeorg');
							if (accid_pk_org_p && accid_pk_org_p.value) {
								accid_pk_org_p = accid_pk_org_p.value;
							} else {
								accid_pk_org_p = null;
							}

							let accid_pk_org = props.form.getFormItemsValue(formId, 'pk_org');
							if (accid_pk_org && accid_pk_org.value) {
								accid_pk_org = accid_pk_org.value;
							} else {
								accid_pk_org = null;
							}

							let accid_currtype = props.form.getFormItemsValue(formId, 'pk_currtype');
							if (accid_currtype && accid_currtype.value) {
								accid_currtype = accid_currtype.value;
							} else {
								accid_currtype = null;
							}

							return {
								pk_org: accid_pk_org,
								pk_ownerorg: accid_pk_org_p,
								pk_currtype: accid_currtype,
								//自定义增加的过滤条件
								GridRefActionExt: 'nccloud.web.sf.delivery.delivery.filter.DefaultRefAccFilter4NCC'
							};
						}
					})
				);
			}
		}
	});
	let multiLang = props.MutiInit.getIntl('2052');
	let porCol = {
		attrcode: 'opr',
		label: loadMultiLang(props,'36320AAC-000016'),/* 国际化处理： 操作*/
		visible: true,
		fixed: 'right',
		width: 200,
		className: "table-opr",
		itemtype: 'customer',
		render(text, record, index) {
			let status = props.cardTable.getStatus(tableId);
			let copyflag = that.state.copyflag;
			//判断复制标识
			if (copyflag) {
				let buttonAry = ['copythis'];
				return props.button.createOprationButton(buttonAry, {
					area: 'card_inner',
					buttonLimit: 3,
					onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
				});
			} else {
				let innerButton = [];
				if (status === 'browse') {
					innerButton = record.expandRowStatus ? ['CloseDown'] : ['OpenDown'];
				}else{
					innerButton = ['open'];
				}
				return (<div className="currency-opr-col">{
					props.button.createOprationButton(innerButton, {
						area: "card_inner",
						buttonLimit: 3,
						onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
					})
				}
				</div>);
			}
		}
	};
	meta[tableId].items.push(porCol);
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/