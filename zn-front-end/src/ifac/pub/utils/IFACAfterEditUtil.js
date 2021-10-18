/*nL0VWi8+Cc/NhO+sUhvw766F+At6IxU/iS4ayvV3GoUGp20Hzl+b5WE0/0qMX2Vc*/
/**
 * CMP 编辑后事件处理公共API
 * @author tangleic
 * @version 1.0 
 */
/**
* 设置表头字段属性
* 支持设置字段的编辑性、必输性和可见性
*
* @param {*} props 页面内置对象
* @param {*} headCode 表头编码
* @param {*} headItemProps 表头页面属性
*/
export const setHeadItemProp = function (props, headCode, headItemProps) {
    let form = props.form;
    let editArray = {};
    let requireArray = {};
    let visibleArray = {};
    if (!headItemProps || headItemProps.length == 0) {
        return;
    }
    for (let itemProp of headItemProps) {
        if (!itemProp.hasOwnProperty('itemName')) {
            continue;
        }
        let itemName = itemProp.itemName;
        if (!itemName) {
            continue;
        }
        if (itemProp.hasOwnProperty('editable')) {
            let flag = itemProp.editable;
            if (flag != null) {
                editArray[itemName] = !(flag == 'true' ? true : false);
            }

        }
        if (itemProp.hasOwnProperty('require')) {
            let flag = itemProp.require;
            if (flag != null) {
                requireArray[itemName] = flag == 'true' ? true : false;
            }
        }
        if (itemProp.hasOwnProperty('visible')) {
            let flag = itemProp.visible;
            if (flag != null) {
                visibleArray[itemName] = flag == 'true' ? true : false;
            }
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
    if (Object.keys(visibleArray).length > 0) {
        //批量设置字段可见性
        form.setFormItemsVisible(headCode, visibleArray);
    }
}

/**
 * 设置表体字段编辑性
 * @param {*} props 页面内置对象
 * @param {*} bodyCode  表体编码
 * @param {*} bodyItemProp  表体字段属性
 * @param {*} editableItemArr 可编辑表体字段数组
 * @param {*} disableItemArr  不可编辑表体字段数组
 */
const setBodyItemEditbale = function (props, bodyCode, itemProp, editableItemArr, disableItemArr) {
    if (!itemProp.hasOwnProperty('editable') || itemProp.editable == null) {
        return;
    }
    let { rowID, rowIndex, itemName } = itemProp;
    let flag = itemProp.editable;
    //当行id和行索引都为空，则表明设置的是表体的整个列
    if (itemProp.editable === 'true') {
        flag = true;
    } else {
        flag = false;
    }
    if (!rowID && !rowIndex) {
        if (flag) {
            editableItemArr.push(itemName);
        } else {
            disableItemArr.push(itemName);
        }
    }
    //行id不为空，则通过行id来设置
    else if (rowID) {
        props.cardTable.setEditableByRowId(bodyCode, rowID, itemName, flag);
    }
    //行索引不为空，则通过行索引来设置
    else if (rowIndex) {
        props.cardTable.setEditableByIndex(bodyCode, rowIndex, itemName, flag);
    }
}
/**
 * 设置表体字段显隐性(操作整个列)
 * @param {*} props 页面内置对象
 * @param {*} bodyCode  表体区域编码
 * @param {*} itemProp  字段属性
 * @param {*} showItemArr  可见字段数组
 * @param {*} hideItemArr  不可见字段数组
 */
const setBodyItemVisible = function (props, bodyCode, itemProp, showItemArr, hideItemArr) {
    if (!itemProp.hasOwnProperty('visible') || itemProp.visible == null) {
        return;
    }
    let { rowID, rowIndex, itemName } = itemProp;
    let flag = itemProp.visible;
    //当行id和行索引都为空，则表明设置的是表体的整个列
    // if (!rowID && !rowIndex) {
    if (flag) {
        showItemArr.push(itemName);
    } else {
        hideItemArr.push(itemName);
    }
    // }
    //行id不为空，则通过行id来设置
    // else if (rowID) {
    //     props.cardTable.setEditableByRowId(bodyCode, rowID, itemName, flg);
    // }
    //行索引不为空，则通过行索引来设置
    // else if (rowIndex) {
    //     props.cardTable.setEditableByIndex(bodyCode, rowIndex, itemName, flag);
    // }
}
/**
 * 设置表体字段属性
 * @param {*} props 页面内置对象
 * @param {*} bodyItemProp 表体字段属性明细 
 */
export const setBodyItemProp = function (props, bodyItemProp) {
    if (!props || Object.keys(bodyItemProp).length == 0) {
        return;
    }
    //遍历表体编码，兼容多表体
    for (let bodyCode of Object.keys(bodyItemProp)) {
        let itemPropArr = bodyItemProp[bodyCode];
        if (itemPropArr.length == 0) {
            continue;
        }
        //可编辑字段数组
        let editableItemArr = [];
        //不可编辑字段数组
        let disableItemArr = [];
        //显示字段数组
        let showItemArr = [];
        //隐藏字段数组
        let hideItemArr = [];
        for (let itemProp of itemPropArr) {
            let itemName = itemProp.itemName;
            if (!itemName) {
                continue;
            }
            //设置表体字段编辑性
            setBodyItemEditbale(props, bodyCode, itemProp, editableItemArr, disableItemArr);
            //设置表体字段显隐性
            setBodyItemVisible(props, bodyCode, itemProp, showItemArr, hideItemArr);
        }
        if (editableItemArr.length > 0) {
            props.cardTable.setColEditableByKey(bodyCode, editableItemArr, true);
        }
        if (disableItemArr.length > 0) {
            props.cardTable.setColEditableByKey(bodyCode, disableItemArr, false);
        }
        if (showItemArr.length > 0) {
            props.cardTable.showColByKey(bodyCode, showItemArr);
        }
        if (hideItemArr.length > 0) {
            props.cardTable.hideColByKey(bodyCode, hideItemArr);
        }
    }
}


/*nL0VWi8+Cc/NhO+sUhvw766F+At6IxU/iS4ayvV3GoUGp20Hzl+b5WE0/0qMX2Vc*/