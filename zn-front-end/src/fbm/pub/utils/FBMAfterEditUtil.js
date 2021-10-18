/*F0cGMXyaFBgG1j2RZco8yc4U9rQHSTKrNlHMGwSjEB4nvZZ7PCNjX1ODSr+kXzBb*/

/**
 * FBM 编辑后事件处理公共API
 * @author xuhrc
 * @version 1.0
 */
/**
* 设置表头字段属性
* @param {*} props 页面内置对象
* @param {*} headCode 表头编码
* @param {*} headItemProps 表头页面属性
*/
export const setHeadItemProp = function (props, headCode, headItemProps) {
    let obj = {};
    let requireArray = {};
    headItemProps.forEach(element => {
        obj[element["itemName"]] = element["editable"] === "true" ? false : true;
    });
    headItemProps.forEach(element => {
        if(element["require"] === "true"){
            requireArray[element["itemName"]] = element["require"] === "true" ? true : false;
        }else{
            requireArray[element["itemName"]] = element["require"] === "true" ? true : false;
        }
    });
    props.form.setFormItemsDisabled(headCode, obj);
    props.form.setFormItemsRequired(headCode, requireArray);
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
    let tableValue = null;
    if (body) {
        tableValue = body[bodyCode];
    }

    if (tableItemProps == undefined) {
        return;
    }
    for (let i = 0; i < tableItemProps.length; i++) {
        let rowId = tableItemProps[i].rowID;
        if (!rowId && tableValue) {
            rowId = tableValue.rows[i].rowid;
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
/*F0cGMXyaFBgG1j2RZco8yc4U9rQHSTKrNlHMGwSjEB4nvZZ7PCNjX1ODSr+kXzBb*/