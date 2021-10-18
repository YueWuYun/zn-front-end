/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/
/**
 * 票据号参照切换[票据号]
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export const NoteTypeHandle = function(props, moduleId, value,index) {
	let formId = 'table_settle_head';
	let tableId = 'table_settle_detail';
	let meta = props.meta.getMeta();
	let item = meta[formId].items.find((e) => e.attrcode === 'notenumber');
	let tableItem = meta[tableId].items.find((e) => e.attrcode === 'notenumber');

	if (moduleId == formId) {//表头
		if (value) {
			item.itemtype = 'refer';
			item.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
			tableItem.itemtype = 'refer';
			tableItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
		} else {
			item.itemtype = 'input';
			item.refcode = null;
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
		}
		props.renderItem('form', formId, 'notenumber', null);
		props.renderItem('table', tableId, 'notenumber', null);
		props.meta.setMeta(meta);
	}
	if (moduleId == tableId) {//表体
		if (value) {
			tableItem.itemtype = 'refer';
			tableItem.refcode = 'fbm/refer/fbm/Bill4CmpReceiveGridRef/index.js';
			tableItem.queryCondition= () => {
                let table_org = props.form.getFormItemsValue(formId, 'pk_org').value;
                let table_currtype = props.cardTable.getValByKeyAndIndex(moduleId, index, 'pk_currtype')
                let table_noteType= props.cardTable.getValByKeyAndIndex(moduleId, index, 'pk_notetype')
    
                if (table_noteType && table_noteType.value) {
                    table_noteType = table_noteType.value;
                }
                if (table_currtype && table_currtype.value) {
                    table_currtype = table_currtype.value;
                }
                return {
                    pk_org: table_org,
                    fbmbilltype: table_noteType,
                    pk_curr: table_currtype
                };
            }
		} else {
			tableItem.itemtype = 'input';
			tableItem.refcode = null;
		}
		props.renderItem('table', tableId, 'notenumber', null);
		props.meta.setMeta(meta);
	}
};

/*uZLtZFUDsXr/PbCrMlFkKKHOOsx8cogsO6AXMyU6fw7w4UoFKggVqz8tclUsJL2b*/