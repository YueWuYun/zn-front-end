/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import appBase from '../../../base';
const { api } = appBase;
const formId = Templatedata.card_formid;
const tableId = Templatedata.card_tableid;
const pageId = Templatedata.card_pageid;
const moudleId = Templatedata.list_moduleid;
const appcode = Templatedata.card_appcode;
let bill_funcode = Templatedata.bill_funcode;
// 先引入参照，进行表格参照过滤，核算归属权参照
import BankaccSubDefaultGridTreeRef from '../../../../../uapbd/refer/pub/BankaccSubDefaultGridTreeRef';
// 这个是现金账户
import CashAccountGridRef from '../../../../../uapbd/refer/sminfo/CashAccountGridRef';
// 使用权参照
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
// import { RowDetailButton } from "../../../../../tmpub/pub/util/RowDetailButton";

export default function (props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: appcode   //注册小应用的code
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(_this, props, meta, _this)
					props.meta.setMeta(meta);
					if (props.getUrlParam('status') == 'edit') {
						props.cardTable.setStatus(tableId, 'edit');
					} else {
						props.cardTable.setStatus(tableId, 'browse');
						//  props.cardTable.setEditableByIndex(tableId, 0, 'pk_currtype', false);
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {

					});
				}
			}
		}
	)
}

function modifierMeta(props, meta, that) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;

	//参照过滤-现金账户
	//条件根据pk_org进行过滤
	meta[formId].items.map((item) => {
		if (item.attrcode == 'mon_account') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(formId, 'pk_org').value;
				return { pk_org: data };
			};
		}
	});
	//table中现金账户
	meta[tableId].items.map((item) => {
		if (item.attrcode == 'mon_account') {
			item.render = function (text, record, index) {
				return (
					CashAccountGridRef({
						queryCondition: () => {
							let cash_org_data = props.form.getFormItemsValue(formId, 'pk_org').value;
							return {
								pk_org: cash_org_data // 这里对record.values.materiel要做一下非空校验
							};
						}
					})
				);
			}
		};
		// 结算方式
		// if (item.attrcode == 'pk_balatype') {
		// 	item.render = function(text, record, index) {
		// 		return (
		// 			CashAccountGridRef({
		// 			  queryCondition: () => {
		// 				let cash_org_data = props.form.getFormItemsValue(formId, 'pk_org').value;
		// 					return {
		// 						pk_org: cash_org_data // 这里对record.values.materiel要做一下非空校验
		// 					};
		// 				}
		// 			})
		// 		);
		// 	}
		// };
		// 本方账户
		if (item.attrcode == 'pk_account') {
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							let pk_org = props.form.getFormItemsValue(formId, 'pk_org').value;
							return {
								pk_org: pk_org, // 这里对record.values.materiel要做一下非空校验
								refnodename: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000007')/* 国际化处理： 使用权参照*/
							};
						}
					})
				);
			}
		};
		// if (item.attrcode == 'pk_account') {
		// 		item.render = function (text, record, index) {
		// 			return (
		// 				BankaccSubDefaultGridTreeRef({
		// 					queryCondition: () => {
		// 						let org_data = props.form.getFormItemsValue(formId, 'pk_org').value;

		// 						let tab_pk_currtype =null
		// 						if(record.values.pk_currtype ){
		// 							tab_pk_currtype = record.values.pk_currtype.display;//暂时写成display后期改成value
		// 						}
		// 						return {													
		// 							pk_currtype: tab_pk_currtype, 
		// 							pk_org: org_data,
		// 							ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
		// 						};
		// 					}
		// 				})
		// 			);
		// 		}
		// 	}
		// 现金账户
		if (item.attrcode == 'pk_cashaccount') {
			item.render = function (text, record, index) {
				return (
					CashAccountGridRef({
						queryCondition: () => {
							let cash_org_data = props.form.getFormItemsValue(formId, 'pk_org').value;
							return {
								pk_org: cash_org_data // 这里对record.values.materiel要做一下非空校验
							};
						}
					})
				);
			}
		};
		if (item.attrcode == 'pk_org') {
			item.render = function (text, record, index) {
				item.queryCondition = () => {
					return {
						funcode: bill_funcode,
						TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
					};
				}
			}
		}
		//begin tm tangleic 20190730 重复支付数据在备注前增加图标标示
		api.appendIcon({ props, item, field: 'memo' });
		//end tangleic 
		
		//财务组织:权限过滤
		meta[tableId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	});
	//参照过滤--供应商档案
	// meta[formId].items.map((item) => {
	// 	if (item.attrcode == 'pk_supplier') {
	// 		item.queryCondition = () => {
	// 			let pk_supplier_data = props.form.getFormItemsValue(formId, 'pk_group').value;
	// 			return { pk_org: pk_supplier_data
	// 				// ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillSupplierGridRefSqlBuilder'//自定义参照过滤条件
	// 			};
	// 		};
	// 	}
	// });

	//付款银行账户过滤
	//objecttype（交易对象类型）
	//参数为queryCondition中的accclass ，1=客户银行账户，2=客商银行账户，3=供应商银行账户
	// meta[formId].items.map((item) => {
	// 	if (item.attrcode == 'pk_oppaccount') {
	// 		item.queryCondition = () => {
	// 			// let data = props.form.getFormItemsValue(formId, 'pk_org').value;
	// 			let pk_customer = props.form.getFormItemsValue(formId, 'pk_customer').value;
	// 			let pk_customer_dly = props.form.getFormItemsValue(formId, 'pk_customer').display;
	// 			let pk_cust= pk_customer;
	// 			let pk_supplier = props.form.getFormItemsValue(formId, 'pk_supplier').value;
	// 			let pk_supplier_dly = props.form.getFormItemsValue(formId, 'pk_supplier').display;
	// 			let acclass = 1;//默认显示客户
	// 			let objecttype = props.form.getFormItemsValue(formId, 'objecttype').value;
	// 			if (objecttype) {
	// 				acclass = objecttype;
	// 			}
	// 			if(!pk_customer_dly){
	// 				pk_cust = null;
	// 			}

	// 			if(acclass==2){//供应商
	// 				pk_cust = pk_supplier;
	// 				if(!pk_supplier_dly){
	// 					pk_cust = null;
	// 				}
	// 				acclass = 3;//平台规定
	// 			}
	// 			return {
	// 				pk_cust: pk_cust,
	// 				accclass: acclass
	// 				// ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillRefSqlBuilder'//自定义参照过滤条件
	// 			};
	// 		};
	// 	}
	// });

	//收款银行账号过滤
	//过滤条件：币种+组织
	// meta[formId].items.map((item) => {
	// 	if (item.attrcode == 'pk_account') {
	// 		item.queryCondition = () => {
	// 			let org_value = props.form.getFormItemsValue(formId, 'pk_org').value;
	// 			let cur_type = props.form.getFormItemsValue(formId, 'pk_currtype').value;
	// 			let cur_type_dly = props.form.getFormItemsValue(formId, 'pk_currtype').display;//参照有问题需要传递中文//暂时写成display后期改成value【后期会修改】
	// 			return {
	// 				pk_org: org_value, pk_currtype: cur_type_dly,
	// 				ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
	// 			};
	// 		};
	// 	}
	// });

	// meta[tableId].items.map((item) => {
	// 	
	// });


	let multiLang = props.MutiInit.getIntl(moudleId);
	let porCol = {
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000008'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			let buttonAry =
				props.getUrlParam("status") === "browse"
					// ? ["openBtn", that.state.openflag && 'openbrowse', !that.state.openflag && 'closebrowse']
					? (record.expandRowStatus ? ["closebrowse"] : ["openbrowse"])
					: ["openBtn", 'editmoreBtn', "copylineBtn", "addlineBtn", "deletelineBtn"];
			return (<div>
				{/* {api.buildWarnIcon(props, { record })} */}
				{props.button.createOprationButton(buttonAry, {
					area: Templatedata.card_body_inner,
					buttonLimit: 3,
					onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index)
				})}
			</div>)
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/