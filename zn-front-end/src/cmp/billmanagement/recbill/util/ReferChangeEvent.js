/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/
/**
 * 交易对象处理银行参照字段[付款银行账户]
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const ObjectTypeHandle = function (props, moduleId, value) {
	let meta = props.meta.getMeta();
	let item = meta[this.formId].items.find((e) => e.attrcode === 'pk_oppaccount');
	let tableItem = meta[this.tableId].items.find((e) => e.attrcode === 'pk_oppaccount');
	let child_tableItem = meta[this.childform].items.find((e) => e.attrcode === 'pk_oppaccount');//侧拉框
	if (moduleId == this.formId) {
		if(!value){
			value = props.form.getFormItemsValue(this.formId, 'objecttype') ? props.form.getFormItemsValue(this.formId, 'objecttype').value : null;//对象交易类型
			if(!value){
				return;
			}
		}
		if (value == '0') {
			item.itemtype = 'refer';
			item.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000116');//'客户银行账户'
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			tableItem.itemtype = 'refer';
			tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000116');//'客户银行账户'
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			child_tableItem.itemtype = 'refer';
			child_tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000116');//'客户银行账户'
			child_tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		if (value == '1') {
			item.itemtype = 'refer';
			item.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000117');//'供应商银行账户'
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			tableItem.itemtype = 'refer';
			tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000117');//'供应商银行账户'
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			child_tableItem.itemtype = 'refer';
			child_tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000117');//'供应商银行账户'
			child_tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		if (value == '3') {

			item.itemtype = 'refer';
			item.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000118');//'个人银行账户'
			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
			tableItem.itemtype = 'refer';
			tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000118');//'个人银行账户'
			tableItem.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
			child_tableItem.itemtype = 'refer';
			child_tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000118');//'个人银行账户'
			child_tableItem.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		}
		if (value == '2') {
		}
		if (value == '4') {
			item.itemtype = 'input';
			item.refcode = null;
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
			child_tableItem.itemtype = 'input';
			child_tableItem.refcode = null;
		}
		props.renderItem('form', this.formId, 'pk_oppaccount', null);
		props.renderItem('table', this.tableId, 'pk_oppaccount', null);
		props.renderItem('form', this.childform, 'pk_oppaccount', null);
		props.meta.setMeta(meta);
	}
	if (moduleId == this.tableId) {
		if(!value){
			value = props.form.getFormItemsValue(this.formId, 'objecttype') ? props.form.getFormItemsValue(this.formId, 'objecttype').value : null;//对象交易类型
			if(!value){
				return;
			}
		}
		if (value == '0') {
			tableItem.itemtype = 'refer';
			tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000116');//'客户银行账户'
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			child_tableItem.itemtype = 'refer';
			child_tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000116');//'客户银行账户'
			child_tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		if (value == '1') {
			tableItem.itemtype = 'refer';
			tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000117');//'供应商银行账户'
			tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
			child_tableItem.itemtype = 'refer';
			child_tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000117');//'供应商银行账户'
			child_tableItem.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
		}
		if (value == '3') {
			tableItem.itemtype = 'refer';
			tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000118');//'个人银行账户'
			tableItem.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
			child_tableItem.itemtype = 'refer';
			child_tableItem.refName = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000118');//'个人银行账户'
			child_tableItem.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js';
		}
		if (value == '2') {
		}
		if (value == '4') {
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
			child_tableItem.itemtype = 'input';
			child_tableItem.refcode = null;
		}
		props.renderItem('table', this.tableId, 'pk_oppaccount', null);
		props.renderItem('form', this.childform, 'pk_oppaccount', null);
		props.meta.setMeta(meta);
	}
};
/**
 * 票据号参照切换[票据号]
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 * @param {*} value 交易对象值
 * @param {*} record 表体数据值
 */
export const NoteTypeHandle = function (props, moduleId, value,record) {
	let meta = props.meta.getMeta();
	let item = meta[this.formId].items.find((e) => e.attrcode === 'note_no');//form
	let tableItem = meta[this.tableId].items.find((e) => e.attrcode === 'note_no');//table
	let childe_item = meta[this.childform].items.find((e) => e.attrcode === 'note_no');//table_edit
	let tradeType = props.form.getFormItemsValue(this.formId, this.tradeType) ? props.form.getFormItemsValue(this.formId, this.tradeType).value : null;//交易类型/单据类型
	let VOHeadClassName = this.formVOClassName;//vo名称
	let VOtableClassName = this.tableVOClassName;//vo名称
	if (moduleId == this.formId) {
		//form表头
		if (item.attrcode === 'note_no') {
			if (value) {
				item.itemtype = 'refer';
				item.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
				tableItem.itemtype = 'refer';
				tableItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
				childe_item.itemtype = 'refer';
				childe_item.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
				//票据号过滤放到了这里
				if(record){//表体
					tableItem.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						}
						let data = JSON.stringify(dataObject);
						return {
							pk_org: record.values.pk_org.value,
							pk_currtype: record.values.note_type.value,
							pk_curr: record.values.pk_currtype.value,
							fbmbilltype: record.values.note_type.value,
							pk_register: this.pk_registers == null ? null : this.pk_registers,
							notestatus: this.notestatus == null ? null : this.notestatus,
							crossRuleTableConditionsVO: data,
							VOClassName: VOtableClassName,
							tradeType: tradeType,
							itemKey: 'note_no',
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
						};
					};
					childe_item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						}
						let data = JSON.stringify(dataObject);
						return {
							pk_org: record.values.pk_org.value,
							pk_currtype: record.values.note_type.value,
							pk_curr: record.values.pk_currtype.value,
							fbmbilltype: record.values.note_type.value,
							pk_register: this.pk_registers == null ? null : this.pk_registers,
							notestatus: this.notestatus == null ? null : this.notestatus,
							crossRuleTableConditionsVO: data,
							VOClassName: VOtableClassName,
							tradeType: tradeType,
							itemKey: 'note_no',
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
						};
					};
				}else{//表头
					item.queryCondition = () => {
						let dataObject = {
							model: props.form.getAllFormValue(this.formId),
							pageid: this.pageId
						}
						let data = JSON.stringify(dataObject);
						return {
							pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
							pk_currtype: props.form.getFormItemsValue(this.formId, 'note_type') ? props.form.getFormItemsValue(this.formId, 'note_type').value : null,
							pk_curr: props.form.getFormItemsValue(this.formId, 'pk_currtype') ? props.form.getFormItemsValue(this.formId, 'pk_currtype').value : null,
							fbmbilltype: props.form.getFormItemsValue(this.formId, 'note_type') ? props.form.getFormItemsValue(this.formId, 'note_type').value : null,
							pk_register: this.pk_registers == null ? null : this.pk_registers,
							notestatus: this.notestatus == null ? null : this.notestatus,
							crossRuleConditionsVO: data,
							VOClassName: VOHeadClassName,
							tradeType: tradeType,
							itemKey: 'note_no',
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
						};
					};
				}

			} else {
				item.itemtype = 'input';
				item.refcode = null;
				tableItem.itemtype = 'input';
				tableItem.refcode = null;
				childe_item.itemtype = 'input';
				childe_item.refcode = null;
			}
			props.renderItem('form', this.formId, 'note_no', null);
			props.renderItem('form', this.childform, 'note_no', null);
			props.renderItem('table', this.tableId, 'note_no', null);
			props.meta.setMeta(meta);
		}
	}
	if (moduleId == this.tableId) {
		if (tableItem.attrcode === 'note_no'||childe_item.attrcode === 'note_no') {
			if (value) {
				tableItem.itemtype = 'refer';
				tableItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
				childe_item.itemtype = 'refer';
				childe_item.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
				//票据号过滤放到了这里
				if(record){//表体
					tableItem.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						}
						let data = JSON.stringify(dataObject);
						return {
							pk_org: record.values.pk_org.value,
							pk_currtype: record.values.note_type.value,
							pk_curr: record.values.pk_currtype.value,
							fbmbilltype: record.values.note_type.value,
							pk_register: this.pk_registers == null ? null : this.pk_registers,
							notestatus: this.notestatus == null ? null : this.notestatus,
							crossRuleTableConditionsVO: data,
							VOClassName: VOtableClassName,
							tradeType: tradeType,
							itemKey: 'note_no',
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
						};
					};
					childe_item.queryCondition = () => {
						let dataObject = {
							model: props.cardTable.getAllData(moduleId),
							pageid: this.pageId
						}
						let data = JSON.stringify(dataObject);
						return {
							pk_org: record.values.pk_org.value,
							pk_currtype: record.values.note_type.value,
							pk_curr: record.values.pk_currtype.value,
							fbmbilltype: record.values.note_type.value,
							pk_register: this.pk_registers == null ? null : this.pk_registers,
							notestatus: this.notestatus == null ? null : this.notestatus,
							crossRuleTableConditionsVO: data,
							VOClassName: VOtableClassName,
							tradeType: tradeType,
							itemKey: 'note_no',
							GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
						};
					};
				}
			} else {
				tableItem.itemtype = 'input';
				tableItem.refcode = null;
				childe_item.itemtype = 'input';
				childe_item.refcode = null;
			}
		}
		props.renderItem('table', this.tableId, 'note_no', null);
		props.renderItem('form', this.childform, 'note_no', null);
		props.meta.setMeta(meta);
	}
};

/**
 * 批量给表体赋值
 * copy by paybill
 */
export const noteTypeInputTORefer = function (props) {
	let rowNum = props.cardTable.getNumberOfRows(this.tableId);//表体table行数
	for (let i = 0; i < rowNum; i++) {
		let noteRefer = props.cardTable.getValByKeyAndIndex(this.tableId, i, 'pk_note')
		if (noteRefer && noteRefer.value) {
			props.cardTable.setValByKeyAndIndex(this.tableId, i, 'note_no', {
				value: noteRefer.value,
				display: noteRefer.display
			});
		}
	}
}

/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/