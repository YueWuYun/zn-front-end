/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax } from 'nc-lightapp-front';
import * as CONSTANTS from '../constants';
let { tableId, searchId, formId, table_orgs, pagecode, appid, formId_org, formId_01, formId_02, formId_03, formId_04, formId_06, oid } = CONSTANTS;
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {
	//向下级发布：财务组织
	if (key === 'pk_org' && moduleId === formId_org) {
		let pk_org = props.form.getFormItemsValue(formId_org, 'pk_org');
		if (typeof pk_org.display !== 'string') return;
		let rows = [];
		if (pk_org.value === "") {
			props.table.setAllTableData(table_orgs, { rows });
			return;
		}
		let values = pk_org.value.split(",");
		let displays = [];
		Object.values(value).map(item => {
			if(item.refname) {
				displays.push(item.refname)
			}
		});
		for (let i = 0; i < values.length; i++) {
			let tempdisplay = { value: displays[i], display: displays[i] };
			let values = {
				display: tempdisplay
			};
			let temp = {
				status: 0,
				values
			}
			rows.push(temp);
		}
		let data = {
			rows
		}
		props.table.setAllTableData(table_orgs, data);
	}
	//【收款结算单、付款结算单】 交易类型对象
	if (key === 'busiobjtype' && moduleId === formId_04) {
		if (value.value == "1") {//供应商
			props.form.setFormItemsDisabled(formId_04, { 'pk_customer': true });
			props.form.setFormItemsDisabled(formId_04, { 'pk_supplier': false });
		} else if (value.value == "0") {//客户
			props.form.setFormItemsDisabled(formId_04, { 'pk_supplier': true });
			props.form.setFormItemsDisabled(formId_04, { 'pk_customer': false });
		} else if (value.value == "1") {//人员
			props.form.setFormItemsDisabled(formId_04, { 'pk_supplier': true });
			props.form.setFormItemsDisabled(formId_04, { 'pk_customer': true });
		} else if (value.value == "4" || value.value == "2") {//散户和部门
			props.form.setFormItemsDisabled(formId_04, { 'pk_supplier': false });
			props.form.setFormItemsDisabled(formId_04, { 'pk_customer': false });
		}
	}
	//【收款结算单、付款结算单】 对方账户
	if (key === 'oppacc' && moduleId === formId_04) {
		let accountname = props.form.getFormItemsValue(moduleId, ['oppacc'])[0].display;
		props.form.setFormItemsValue(moduleId, { accountname: { value: accountname } });
	}
	//【付款单/收款单】交易类型对象
	if (key === 'busiobjtype') {
		let meta = props.meta.getMeta();
		let item = meta[moduleId].items.find(e => e.attrcode === 'oppacc');
		if (value.value == "0") {//客户
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': false });
			props.form.setFormItemsValue(moduleId, { pk_customer: {} });
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': true });
			props.form.setFormItemsValue(moduleId, { pk_supplier: {} });
			// props.form.setFormItemsDisabled(formId_06, { 'pk_person': true });
			props.form.setFormItemsValue(moduleId, { pk_person: {} });
			props.form.setFormItemsValue(moduleId, { pk_sanhu: {} });
			props.form.setFormItemsValue(moduleId, { oppacc: {} });

			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		} else if (value.value == "1") {//供应商
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': true });
			props.form.setFormItemsValue(moduleId, { pk_customer: {} });
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': false });
			props.form.setFormItemsValue(moduleId, { pk_supplier: {} });
			// props.form.setFormItemsDisabled(formId_06, { 'pk_person': true });
			props.form.setFormItemsValue(moduleId, { pk_person: {} });
			props.form.setFormItemsValue(moduleId, { pk_sanhu: {} });
			props.form.setFormItemsValue(moduleId, { oppacc: {} });

			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		} else if (value.value == "3") {//人员
			props.form.setFormItemsDisabled(moduleId, { 'pk_person': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': true });
			props.form.setFormItemsValue(moduleId, { pk_supplier: {} });
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': true });
			props.form.setFormItemsValue(moduleId, { pk_customer: {} });
			props.form.setFormItemsValue(moduleId, { oppacc: {} });

			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		} else if (value.value == "2") {//部门
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_person': false });
			props.form.setFormItemsValue(moduleId, { pk_person: {} });

			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		} else if (value.value == "4" || value.value == "2") {//散户
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_person': false });

			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		}

		props.meta.setMeta(meta);
	}
	//【付款单/收款单】部门
	if (key === 'pk_department') {
		props.form.setFormItemsValue(moduleId, { pk_person: {} });
	}
	//【付款单/收款单】客户
	if (key === 'pk_customer') {
		props.form.setFormItemsValue(moduleId, { oppacc: {} });
	}
	//【付款单/收款单】供应商
	if (key === 'pk_supplier') {
		props.form.setFormItemsValue(moduleId, { oppacc: {} });
	}
	//【付款单/收款单】人员
	if (key === 'pk_person') {
		props.form.setFormItemsValue(moduleId, { oppacc: {} });
	}
	//【委托收款单、委托付款单】 收付款单位
	if (key === 'pk_FinanceOrg' && moduleId === formId_02) {
		props.form.setFormItemsValue(moduleId, { pk_financeplanitem: {} });
		props.form.setFormItemsValue(moduleId, { pk_accid: {} });
		let pk_org = props.form.getFormItemsValue(formId_02, ['pk_FundOrg'])[0].value;
		let pk_ownerorg = props.form.getFormItemsValue(formId_02, ['pk_FinanceOrg'])[0].value;
		if (pk_org && pk_ownerorg) {
			let pk = props.form.getFormItemsValue(formId_01, ['pk'])[0].value;
			let data = {
				key: 'pk_FinanceOrg',
				moduleId: formId_02,
				pk_FundOrg: pk_org,
				pk_FinanceOrg: pk_ownerorg,
				pk: pk,
				from: 'card'
			}
			ajax({
				url: '/nccloud/cmp/informer/afterevent.do',
				data,
				success: function (res) {
					if (res.data) {
						props.form.setFormItemsValue(moduleId, { pk_accid: { value: res.data.value, display: res.data.display } });
					} else {
						props.form.setFormItemsValue(moduleId, { pk_accid: {} });
					}
				}
			});
		}

	}
	//【委托收款单、委托付款单】收付款资金组织
	if (key === 'pk_FundOrg' && moduleId === formId_02) {
		//清空数据
		props.form.setFormItemsValue(moduleId, { pk_FinanceOrg: {} });
		props.form.setFormItemsValue(moduleId, { pk_accid: {} });
		props.form.setFormItemsValue(moduleId, { pk_financeplanitem: {} });
		props.form.setFormItemsValue(moduleId, { pk_fundplanitem: {} });
	}


}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/