/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax } from 'nc-lightapp-front';
import * as CONSTANTS from '../constants';
let { tableId, searchId, formId, table_orgs, pagecode, appid, formId_org, formId_01, formId_02, formId_03, formId_04, formId_06, oid } = CONSTANTS;
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {


	//向下级发布：财务组织
	if (key === 'pk_org' && moduleId === formId_org) {
		let pk_org = props.form.getFormItemsValue(formId_org, 'pk_org');
		console.log(pk_org);
		if (typeof pk_org.display !== 'string') return;
		let rows = [];
		if (pk_org.value === "") {
			props.table.setAllTableData(table_orgs, { rows });
			return;
		}
		let displays = [];
		let values = pk_org.value.split(",");
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
	//【收款结算单、付款结算单】 对方账户
	if (key === 'oppacc' && moduleId === formId_04) {
		let accountname = props.form.getFormItemsValue(moduleId, ['oppacc'])[0].display;
		let account = props.form.getFormItemsValue(moduleId, ['oppacc'])[0].value;
		props.form.setFormItemsValue(moduleId, { accountname: { value: accountname } });
	}
	//【付款单/收款单】【收款结算单/付款结算单】交易类型对象
	if (key === 'busiobjtype') {
		let meta = props.meta.getMeta();
		let item = meta[moduleId].items.find(e => e.attrcode === 'oppacc');
		props.form.setFormItemsValue(moduleId, { pk_customer: {} });
		props.form.setFormItemsValue(moduleId, { pk_supplier: {} });
		props.form.setFormItemsValue(moduleId, { pk_person: {} });
		props.form.setFormItemsValue(moduleId, { pk_sanhu: {} });
		props.form.setFormItemsValue(moduleId, { oppacc: {} });
		props.form.setFormItemsValue(moduleId, { accountname: {} });
		if (value.value == "0") {//客户
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_person': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': true });
			props.form.setFormItemsDisabled(formId_04, { 'accountname': true });
			//对方账户为：客户账户
			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		} else if (value.value == "1") {//供应商
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': true });
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_person': false });
			props.form.setFormItemsDisabled(formId_04, { 'accountname': true });
			//对方账户为：客商账户
			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		} else if (value.value == "3") {//人员
			props.form.setFormItemsDisabled(moduleId, { 'pk_person': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': true });
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': true });
			//对方账户为：个人银行账户
			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		} else if (value.value == "2") {//部门
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_person': false });
			props.form.setFormItemsDisabled(formId_04, { 'accountname': false });
			//对方账户为：个人银行账户
			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		} else if (value.value == "4") {//散户
			props.form.setFormItemsDisabled(moduleId, { 'pk_supplier': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_customer': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_person': false });
			//对方账户为：个人银行账户
			props.renderItem('form', moduleId, 'oppacc', null);
			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		}

		props.meta.setMeta(meta);
	}
	//【付款单/收款单】【收款结算单/付款结算单】部门
	if (key === 'pk_department') {
		props.form.setFormItemsValue(moduleId, { pk_person: {} });
	}
	//【付款单/收款单】【收款结算单/付款结算单】客户
	if (key === 'pk_customer') {
		props.form.setFormItemsValue(moduleId, { oppacc: {} });
		props.form.setFormItemsValue(moduleId, { accountname: {} });
	}
	//【付款单/收款单】【收款结算单/付款结算单】供应商
	if (key === 'pk_supplier') {
		props.form.setFormItemsValue(moduleId, { oppacc: {} });
		props.form.setFormItemsValue(moduleId, { accountname: {} });
	}
	//【付款单/收款单】【收款结算单/付款结算单】人员
	if (key === 'pk_person') {
		props.form.setFormItemsValue(moduleId, { oppacc: {} });
	}
	//【委托收款单、委托付款单】 收付款资金组织
	if (key === 'pk_FundOrg' && moduleId === formId_02) {
		props.form.setFormItemsValue(moduleId, { pk_FinanceOrg: {} });
		props.form.setFormItemsValue(moduleId, { pk_accid: {} });
		props.form.setFormItemsValue(moduleId, { pk_financeplanitem: {} });
		props.form.setFormItemsValue(moduleId, { pk_fundplanitem: {} });
	}
	//【委托收款单、委托付款单】 收付款单位
	if (key === 'pk_FinanceOrg' && moduleId === formId_02) {
		props.form.setFormItemsValue(moduleId, { pk_financeplanitem: {} });
		props.form.setFormItemsValue(moduleId, { pk_accid: {} });
		let pk_org = props.form.getFormItemsValue(formId_02, ['pk_FundOrg'])[0].value;
		let pk_ownerorg = props.form.getFormItemsValue(formId_02, ['pk_FinanceOrg'])[0].value;
		if (pk_org && pk_ownerorg) {
			let formTempData = this.formTempData;
			props.form.setAllFormValue({ 'form_generate_01': formTempData });
			let pk = props.form.getFormItemsValue(formId_01, ['pk'])[0].value;
			let data = {
				key: 'pk_FinanceOrg',
				moduleId: formId_02,
				pk_FundOrg: pk_org,
				pk_FinanceOrg: pk_ownerorg,
				pk: pk,
				from: 'list'
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

	//【收款结算单/付款结算单】散户
	if ((key === 'pk_customer' || key === 'pk_supplier' || key === 'busiobjtype') && moduleId === formId_04) {
		let pk_customer = props.form.getFormItemsValue(formId_04, 'pk_customer').value;
		let pk_supplier = props.form.getFormItemsValue(formId_04, 'pk_supplier').value;
		let busiobjtype = props.form.getFormItemsValue(formId_04, 'busiobjtype').value;
		if (busiobjtype == '4') {
			if (pk_customer || pk_supplier) {
				let data = {
					key: 'busiobjtype',
					moduleId: formId_04,
					pk_customer: pk_customer,
					pk_supplier: pk_supplier,
					busiobjtype: '4',
					from: 'list'
				}
				ajax({
					url: '/nccloud/cmp/informer/afterevent.do',
					data,
					success: function (res) {
						if (res.data) {//是散户
							props.form.setFormItemsDisabled(formId_04, { 'accountname': false });
						} else {//不是散户
							props.form.setFormItemsDisabled(formId_04, { 'accountname': true });
						}
					}
				});
			}
		}

	}
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/