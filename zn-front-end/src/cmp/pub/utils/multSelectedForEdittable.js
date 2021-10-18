/*ccpEEpY2eIpMeIA6b+JtLtU/fGR8JoXbymcgTpgwUGSr/VdY42anexHVT82duWjsUxDkImn40TVw
tTcJPEHsXQ==*/
/**
 * 
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} index 
 * @param {*} record 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} nameField 字段对应的name
 * @param {*} copyFields 新增行需要复制的字段
 */
export default function(props, moduleId, key, index, record, value, changedrows, nameField, copyFields) {
	if (value.length > 1) {
		if (changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			props.editTable.setValByKeyAndIndex(moduleId, index, key, {
				value: value[0].refpk,
				display: value[0].refcode,
				isEdit: true
			});
			props.editTable.setValByKeyAndIndex(moduleId, index, nameField, {
				value: value[0].refname,
				display: value[0].refname,
				isEdit: false
			});
		}
		let insertrows = [];
		for (let i = 1; i < value.length; i++) {
			let insertRow = { status: 2 };
			let values = {};
			copyFields.forEach((field) => {
				values[field] = record.values[field];
			});
			values[key] = { value: value[i].refpk, display: value[i].refcode };
			values[nameField] = { value: value[i].refname, display: value[i].refname };
			insertRow.values = values;
			insertrows.push(insertRow);
		}
		props.editTable.insertRowsAfterIndex(moduleId, insertrows, index);
	}
}

/*ccpEEpY2eIpMeIA6b+JtLtU/fGR8JoXbymcgTpgwUGSr/VdY42anexHVT82duWjsUxDkImn40TVw
tTcJPEHsXQ==*/