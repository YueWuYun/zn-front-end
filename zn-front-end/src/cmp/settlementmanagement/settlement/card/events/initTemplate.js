/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import appBase from '../../../base'
const { api } = appBase;
const formId = Templatedata.card_formid;
const tableId = Templatedata.card_tableid;
const pageId = Templatedata.card_pageid;
const tableId_edit = Templatedata.card_tableid_edit;
import CashAccountGridRef from '../../../../../uapbd/refer/sminfo/CashAccountGridRef';// 这个是现金账户
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';// 使用权参照
export default function (props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId//页面id
			// appid: Templatedata.card_appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(_this, props, meta, _this);
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
						let status = props.getUrlParam('status');
						console.log('u_bill_status:', status);
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
	//table中现金账户
	meta[tableId].items.map((item) => {

		// 本方账户<使用权参照>
		if (item.attrcode == 'pk_account') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							let pk_org = props.form.getFormItemsValue(formId, 'pk_org');
							//2004结算修改实付币种后银行账户参照的问题修改
							debugger
							let pk_currtype = record.values.pk_currtype_last && record.values.pk_currtype_last.value;
							if (!pk_currtype) {
								pk_currtype = record.values.pk_currtype && record.values.pk_currtype.value;
							}
							return {
								pk_org: pk_org && pk_org.value, // 这里对record.values.materiel要做一下非空校验
								pk_currtype: pk_currtype,
								isDisableDataShow: false,//默认只加载启用的账户
								refnodename: props.MutiInit.getIntl("360704SM") && props.MutiInit.getIntl("360704SM").get('360704SM-000015'),/* 国际化处理： 使用权参照*/
								GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件 
							};
						}
					})
				);
			}
		};
		// 现金账户
		if (item.attrcode == 'pk_cashaccount') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					CashAccountGridRef({
						queryCondition: () => {
							let cash_org_data = props.form.getFormItemsValue(formId, 'pk_org');
							return {
								pk_org: cash_org_data && cash_org_data.value,//组织
								pk_currtype: record.values.pk_currtype && record.values.pk_currtype.value,//币种
								refnodename: props.MutiInit.getIntl("360704SM") && props.MutiInit.getIntl("360704SM").get('360704SM-000072'),/* 国际化处理： 现金账户*/
								GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'
							};
						}
					})
				);
			}
		};
		// 对方账户
		if (item.attrcode == 'oppaccount') {
			item.showHistory = false;
		};
		if (item.attrcode == 'pk_oppaccount') {
			item.showHistory = false;
		};
		//begin tm tangleic 20190730 重复支付数据在备注前增加图标标示
		api.appendIcon({ props, item, field: 'memo' });
		//end tangleic 

	});
	//table中侧拉编辑中参照过滤
	meta[tableId_edit].items.map((item) => {
		// 本方账户<使用权参照>
		if (item.attrcode == 'pk_account') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					BankaccSubUseTreeGridRef({
						queryCondition: () => {
							let pk_org = props.form.getFormItemsValue(formId, 'pk_org');
							//2004结算修改实付币种后银行账户参照的问题修改
							debugger
							let pk_currtype = record.values.pk_currtype_last && record.values.pk_currtype_last.value;
							if (!pk_currtype) {
								pk_currtype = record.values.pk_currtype && record.values.pk_currtype.value;
							}
							return {
								pk_org: pk_org && pk_org.value, // 这里对record.values.materiel要做一下非空校验
								pk_currtype: pk_currtype,
								isDisableDataShow: false,//默认只加载启用的账户
								refnodename: props.MutiInit.getIntl("360704SM") && props.MutiInit.getIntl("360704SM").get('360704SM-000015'),/* 国际化处理： 使用权参照*/
								GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件 
							};
						}
					})
				);
			}
		};
		// 现金账户
		if (item.attrcode == 'pk_cashaccount') {
			item.showHistory = false;
			item.render = function (text, record, index) {
				return (
					CashAccountGridRef({
						queryCondition: () => {
							let cash_org_data = props.form.getFormItemsValue(formId, 'pk_org');
							return {
								pk_org: cash_org_data && cash_org_data.value,//组织
								pk_currtype: record.values.pk_currtype && record.values.pk_currtype.value,//币种
								refnodename: props.MutiInit.getIntl("360704SM") && props.MutiInit.getIntl("360704SM").get('360704SM-000072'),/* 国际化处理： 现金账户*/
								GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'
							};
						}
					})
				);
			}
		};
		// 对方账户
		if (item.attrcode == 'oppaccount') {
			item.showHistory = false;
		};
		if (item.attrcode == 'pk_oppaccount') {
			item.showHistory = false;
		};
	});

	//loading 操作列
	let porCol = {
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000016'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			let buttonAry =
				props.getUrlParam("status") === "browse"
					? (record.expandRowStatus ? ["closebrowse"] : ["openbrowse"])
					: ['editmoreBtn', "copylineBtn", "addlineBtn", "deletelineBtn"];
			return (<div>
				{/* {api.buildWarnIcon(props, { record })} */}
				{props.button.createOprationButton(buttonAry, {
					area: Templatedata.card_body_inner,
					buttonLimit: 3,
					onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index)
				})}
			</div>
			)


		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/