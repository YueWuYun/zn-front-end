/*4QRdcvAUtPN0vWjc43EgOOkBLiwAYq/Y+RMUBD9W5c+lyKQqgIuZLKs+txii4JTX*/
/**
 * SF 编辑后事件处理公共API
 * @author wangyyx
 * @version 1.0
 */
/**
* 设置表头字段属性
* @param {*} props 页面内置对象
* @param {*} headCode 表头编码
* @param {*} headItemProps 表头页面属性
*/
export const setHeadItemProp = function (props, headCode, headItemProps) {
    let form = props.form;
    let editArray = {};
    let requireArray = {};
    if (headItemProps.length == 0) {
        return;
    }
    for (let itemProp of headItemProps) {
        if (!itemProp.hasOwnProperty('itemName')) {
            continue;
        }
        let itemName = itemProp.itemName;
        if (itemName == null || itemName == '') {
            continue;
        }
        if (itemProp.hasOwnProperty('eidtable')) {
            let flag = itemProp.eidtable;
            editArray[itemName] = flag;
        }
        if (itemProp.hasOwnProperty('require')) {
            let flag = itemProp.require;
            requireArray[itemName] = flag;
        }
    }
    if (Object.keys(requireArray).length > 0) {
        //批量设置字段必输性
        form.setFormItemsRequired(headCode, requireArray);
    }
    if (Object.keys(editArray).length > 0) {
        //批量设置字段编辑性
        form.setFormItemsDisabled(headCode, editArray);
    }
}
/**
 * 设置表体字段属性
 * @param {*} props 页面内置对象
 * @param {*} bodyCode 区域编码(table_code)
 * @param {*} bodyItemProps 表体页面属性
 * @param {*} body table对象 单表为table[0]
 */
export function setBodyItemProp(props, bodyCode, bodyItemProps, body) {
	let flag = '';
    let tableItemProps = bodyItemProps[bodyCode];
    let tableValue =null;
    if(body) {
        tableValue = body[bodyCode];
    }
    
	if (tableItemProps == undefined) {
		return;
    }
	for (let i = 0; i < tableItemProps.length; i++) {
        let rowId=tableItemProps[i].rowID;
        if(!rowId&&tableValue) {
            rowId=tableValue.rows[i].rowid;
        }
		if (tableItemProps[i].editable === 'true') {
			flag = true;
		} else {
			flag = false;
		}
	    // 设定每行的可编辑行 setEditableByRowId,目前方法不好使 等待平台张横修复  xuhrc 2018-7-30
		props.cardTable.setEditableByRowId(bodyCode,
			rowId,
			tableItemProps[i].itemName,
            flag);
    }
}
/*4QRdcvAUtPN0vWjc43EgOOkBLiwAYq/Y+RMUBD9W5c+lyKQqgIuZLKs+txii4JTX*/