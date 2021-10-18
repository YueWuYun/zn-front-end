/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import BankaccSubDefaultGridTreeRef from '../../../../../uapbd/refer/pub/BankaccSubDefaultGridTreeRef';
//引入组织版本试图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
import { app_id, card_from_id, card_table1_id, card_table2_id, card_page_id } from '../../cons/constant.js';
import { buttonVisible,getBodyBtnArr } from './buttonVisible';
import { buttonClick } from '../events';
const formId = 'form_allocate_01';
const tableId = 'table_allocate_01';
const pageId = '36320FA_PAY_C01';
export default function(props) {
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appid: '0001Z61000000004ETQ0'//注册按钮的id
		}, 
		(data) => {
			if(data){
				if(data.template){
					let meta = data.template;
					modifierMeta.call(this,props, meta)
					props.meta.setMeta(meta,()=>{
						orgVersionView(props, card_from_id);
					});
					if(props.getUrlParam('status') != 'browse'){
						props.cardTable.addRow(tableId);
					}
				}
				if(data.button){
					let button = data.button;
					props.button.setButtons(button, () => {
						// buttonVisible(props);
					});
				}
			}   
		}
	)
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	
	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_org_v') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(formId, 'vbillcode').value;
				return { vbillcode: data };
			};
		}
	});

	meta[tableId].items.map((item) => {
		// 内部账户根据币种过滤
		if (item.attrcode == 'pk_accid_r') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							let pk_currtype = record.pk_currtype.value;
							let pk_org=record.pk_org.value;
							let pk_org_r=record.pk_org_r.value;
							return {
								pk_currtype: pk_currtype,
								pk_org:pk_org,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefAccFilter,nc.ui.sf.allocate.filter.AllocateOrgRefAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateOrgRefAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateReceiveOrgRefAccFilter,nccloud.web.sf.allocation.allocate.filter.DefaultRefAccFilter'
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
								pk_currtype: props.form.getFormItemsValue('form_allocate_01','pk_currtype').value,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateCurrentTypeRefPBankAccFilter,nccloud.web.sf.allocation.allocate.filter.AllocateDefaultRefBankAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubbaccNoInnerAccFilter,nccloud.web.sf.allocation.allocate.filter.BanksubBaccNoDestroyFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccNoFrozenFilter,nccloud.web.sf.allocation.allocate.filter.BanksubaccOnlyCurrent'
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
							let pk_currtype = record.pk_currtype.value;
							return {
								pk_org_r: record.values.pk_org_r.value,
								pk_org: record.values.pk_org_r.value,							
								pk_currtype: pk_currtype,
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
							let pk_currtype = record.pk_currtype.value;
							return {
								pk_currtype: pk_currtype,
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
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							let busitype = props.form.getFormItemsValue(formId,'pk_org').value;
							let pk_org=record.pk_org.value;
							return {
								busitype:busitype,
								pk_currtype: pk_currtype,
								GridRefActionExt: 'nccloud.web.sf.allocation.allocate.filter.AllocateOrgRelationRefReceiveOrgFilter'
							};
						}
					})
				);
			}
		}
		

	});
	let multiLang = props.MutiInit.getIntl('36320FA_C01');	
	let unfold = props.MutiInit.getIntl("36320FA_PAY") && props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000025')/* 国际化处理： 展开*/
	let fold = props.MutiInit.getIntl("36320FA_PAY") && props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000080')/* 国际化处理： 收起*/
	let that = this;
	let porCol = {
		attrcode: 'opr',
		label: that.props.MutiInit.getIntl("36320FA_PAY") && that.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000024'),/* 国际化处理： 操作*/
		visible: true,
		fixed: 'right',
		width: 200,
		className: "table-opr",
		itemtype: 'customer',
		render(text, record, index) {
			return <div className="currency-opr-col">{
				props.button.createOprationButton(getBodyBtnArr(props, record),
					{
						area: 'card_inner',
						buttonLimit: '3',
						onButtonClick: (props, key) => { buttonClick.call(that, props, key, text, record, index) }
					})
			}</div>;
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}
/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/