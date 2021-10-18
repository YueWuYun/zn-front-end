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
import { app_id, card_from_id, card_table1_id, card_table_formId, card_table2_id, link_card_page_id, funcode, card_table_id } from '../../cons/constant.js';
import { buttonVisible ,getBodyBtnArr} from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';
import { afterEvent } from './index';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

const formId = 'form_allocate_01';
const tableId = 'table_allocate_01';
const pageId = '36320FA_LINKC01';
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
					props.meta.setMeta(meta);
					if (props.getUrlParam('status') == 'add') {
						//如果是新增，那么给制单人直接赋值
						let context = data.context;
						if (context.pk_org) {
							let pk_org = {
								value: context.pk_org,
								display: context.org_Name
							};
							// this.setState({
							// 	curr_pk_org:context.pk_org,
							// 	curr_orgname:context.org_Name
							// });

							afterEvent.call(that, that.props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
							// that.props.resMetaAfterPkorgEdit();
							// that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
						}
						// props.form.setFormItemsValue(card_from_id,{'billmaker':{value:businessInfo.userId,display:businessInfo.userName}})
					}
					if (props.getUrlParam('status') == 'add') {
						props.form.setFormItemsDisabled(card_from_id, { 'memo': true, 'busitype': true, 'pk_currtype': true, 'isreversebustype': true });
						props.form.setFormItemsVisible(card_from_id, { 'pk_org_v': false });
					}
					if (props.getUrlParam('status') == 'edit') {
						props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true });
						props.form.setFormItemsDisabled(card_from_id, { 'pk_group': true });
					}
					if (props.getUrlParam('status') == 'decide') {

						// props.cardTable.setColEditableByKey(card_table_id,'amount',true);
						// props.cardTable.setColEditableByKey(card_table_id,'pk_bankacc_p',true);
						// props.cardTable.setColEditableByKey(card_table_id,'pk_org_r',true);
						// props.cardTable.setColEditableByKey(card_table_id,'pk_bankacc_r',true);
						// props.cardTable.setColEditableByKey(card_table_id,'pk_accid_r',true);


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
	// orgVersionView(props, card_from_id);
	meta[card_table_id].items.find((e) => e.attrcode == 'pk_org_r').isShowUnit = true;
	// meta[card_table_id].items.find((e) => e.attrcode == 'pk_bankacc_r').isShowUnit =true;
	//参照历史记录处理
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_org_r').showHistory = false;
	meta[card_table_id].items.find((e) => e.attrcode === 'pk_bankacc_r').showHistory = false;
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
		// if (item.attrcode == 'pk_org_v') {
		// 	item.queryCondition = () => {
		// 		let data = props.form.getFormItemsValue(formId, 'vbillcode').value;
		// 		return { vbillcode: data };
		// 	};
		// }
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
		// // 下拨单主组织和收款单位依赖委托
		// if (item.attrcode == 'pk_org_r') {
		// 	item.render = function (text, record, index) {
		// 		return (
		// 			FinanceOrgAllGroupAllDataTreeRef({
		// 				queryCondition: () => {
		// 					return {
		// 						busitype:props.form.getFormItemsValue(formId,'busitype').value,
		// 						pk_currtype: props.form.getFormItemsValue(formId,'pk_currtype').value,
		// 						pk_org:props.form.getFormItemsValue(formId,'pk_org').value,
		// 						TreeRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
		// 					};
		// 				}
		// 			})
		// 		);
		// 	}

		// }
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
			let copyflag = that.state.copyflag;
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