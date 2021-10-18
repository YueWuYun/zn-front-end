/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/
/**
 * 票据号参照切换[票据号]
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 * @param {*} record 操作区域信息
 * @param {*} param 拓展参数
 */
export const NoteTypeHandle = function (props, moduleId, value, record, param) {
	let meta = props.meta.getMeta();
	let tableItem = meta[this.tableId].items.find((e) => e.attrcode === 'notenumber');
	let tableEditItem = meta[this.childform].items.find((e) => e.attrcode === 'notenumber');
	let tradeType = props.form.getFormItemsValue(this.formId, this.tradeType) ? props.form.getFormItemsValue(this.formId, this.tradeType).value : null;//交易类型/单据类型
	let VOClassName = this.tableVOClassName;//vo名称
	if (moduleId == this.tableId) {//结算只有表体
		if (value) {
			if (param && param == '0') {//收款类票据号
				tableItem.itemtype = 'refer';
				tableItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
				tableEditItem.itemtype = 'refer';
				tableEditItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
			} else if (param && param == '1') {//付款款类票据号
				tableItem.itemtype = 'refer';
				tableItem.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
				tableEditItem.itemtype = 'refer';
				tableEditItem.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
			} else {
				tableItem.itemtype = 'refer';
				tableItem.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
				tableEditItem.itemtype = 'refer';
				tableEditItem.refcode = 'fbm/refer/fbm/Bill4CmpPayGridRef/index.js';
			}
			//参照类型进行过滤
			if (record) {
				tableItem.queryCondition = () => {
					let dataObject = {
						model: props.cardTable.getAllData(moduleId),
						pageid: this.pageId
					}
					let data = JSON.stringify(dataObject);
					return {
						pk_org: record.values.pk_org.value,
						pk_currtype: record.values.pk_notetype.value,
						pk_curr: record.values.pk_currtype.value,
						fbmbilltype: record.values.pk_notetype.value,
						// pk_register: this.pk_registers == null ? null : this.pk_registers,
						// notestatus: this.notestatus == null ? null : this.notestatus,
						crossRuleTableConditionsVO: data,
						VOClassName: VOClassName,
						tradeType: tradeType,
						itemKey: 'notenumber',
						GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
					};
				};
				tableEditItem.queryCondition = () => {
					let dataObject = {
						model: props.cardTable.getAllData(moduleId),
						pageid: this.pageId
					}
					let data = JSON.stringify(dataObject);
					return {
						pk_org: record.values.pk_org.value,
						pk_currtype: record.values.pk_notetype.value,
						pk_curr: record.values.pk_currtype.value,
						fbmbilltype: record.values.pk_notetype.value,
						// pk_register: this.pk_registers == null ? null : this.pk_registers,
						// notestatus: this.notestatus == null ? null : this.notestatus,
						crossRuleTableConditionsVO: data,
						VOClassName: VOClassName,
						tradeType: tradeType,
						itemKey: 'notenumber',
						GridRefActionExt: 'nccloud.web.cmp.ref.CMPFBMDefaultBuilder'//自定义增加的过滤条件-票据号
					};
				};
			}
			
		} else {
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
			tableEditItem.itemtype = 'input';
			tableEditItem.refcode = null;
		}
		props.renderItem('table', this.tableId, 'notenumber', null);
		props.renderItem('form', this.childform, 'notenumber', null);
		props.meta.setMeta(meta);
	}
};

/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/