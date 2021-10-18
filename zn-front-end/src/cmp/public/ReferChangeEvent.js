/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/
/**
 * 交易对象处理银行参照字段[付款银行账号]
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const ObjectTypeHandle = function (props, moduleId, value) {
	let meta = props.meta.getMeta();
	let item = meta[this.formId].items.find((e) => e.attrcode === 'pk_oppaccount');
	let tableItem = meta[this.tableId].items.find((e) => e.attrcode === 'pk_oppaccount');

	if (moduleId == this.formId) {
		if (value == '0') {
			item.itemtype = 'refer';
			item.refName = this.state.json['36070-000032'];//'客户银行账户';
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			tableItem.itemtype = 'refer';
			tableItem.refName = this.state.json['36070-000032'];//'客户银行账户';
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		if (value == '1') {
			item.itemtype = 'refer';
			item.refName = this.state.json['36070-000033'];//'供应商银行账户';
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			tableItem.itemtype = 'refer';
			tableItem.refName = this.state.json['36070-000033'];//'供应商银行账户';
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		if (value == '3') {

			item.itemtype = 'refer';
			item.refName = this.state.json['36070-000034'];//'个人银行账户';
			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
			tableItem.itemtype = 'refer';
			tableItem.refName = this.state.json['36070-000034'];//'个人银行账户';
			tableItem.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		}
		if (value == '2') {
		}
		if (value == '4') {
			item.itemtype = 'input';
			item.refcode = null;
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
		}
		props.renderItem('form', this.formId, 'pk_oppaccount', null);
		props.renderItem('table', this.tableId, 'pk_oppaccount', null);
		props.meta.setMeta(meta);
	}
	if (moduleId == this.tableId) {

		if (value == '0') {
			tableItem.itemtype = 'refer';
			tableItem.refName = this.state.json['36070-000032'];//'客户银行账户';
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		if (value == '1') {
			tableItem.itemtype = 'refer';
			tableItem.refName = this.state.json['36070-000033'];//'供应商银行账户';
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		if (value == '3') {
			tableItem.itemtype = 'refer';
			tableItem.refName = this.state.json['36070-000034'];//'个人银行账户';
			tableItem.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		}
		if (value == '2') {
		}
		if (value == '4') {
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
		}
		props.renderItem('table', this.tableId, 'pk_oppaccount', null);
		props.meta.setMeta(meta);
	}
};
/**
 * 票据号参照切换[票据号]
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const NoteTypeHandle = function (props, moduleId, value) {
	let meta = props.meta.getMeta();
	let item = meta[this.formId].items.find((e) => e.attrcode === 'note_no');
	let tableItem = meta[this.tableId].items.find((e) => e.attrcode === 'note_no');
	let child_tableItem = meta[this.childform].items.find((e) => e.attrcode === 'note_no');

	if (moduleId == this.formId) {
		if (value) {
			item.itemtype = 'refer';
			item.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
			tableItem.itemtype = 'refer';
			tableItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
			child_tableItem.itemtype = 'refer';
			child_tableItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
		} else {
			item.itemtype = 'input';
			item.refcode = null;
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
			child_tableItem.itemtype = 'input';
			child_tableItem.refcode = null;
		}
		props.renderItem('form', this.formId, 'note_no', null);
		props.renderItem('form', this.childform, 'note_no', null);
		props.renderItem('table', this.tableId, 'note_no', null);
		props.meta.setMeta(meta);
	}
	if (moduleId == this.tableId) {
		if (value) {
			tableItem.itemtype = 'refer';
			tableItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
			child_tableItem.itemtype = 'refer';
			child_tableItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
		} else {
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
			child_tableItem.itemtype = 'input';
			child_tableItem.refcode = null;
		}
		props.renderItem('table', this.tableId, 'note_no', null);
		props.renderItem('form', this.childform, 'note_no', null);
		props.meta.setMeta(meta);
	}
};

/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/