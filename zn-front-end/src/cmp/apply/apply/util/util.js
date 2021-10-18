/*Fnw/+7RrVHUifmTwZcmqxdrY3lVTDPaV0QO7i2EeE9k=*/

/**
 * 清空卡片字段
 * @param {*} form 表单对象
 * @param {*} formID 卡片表单编码
 * @param {*} items 字段数组
 */
export const clearCardItemValue = function (form, formID, items) {
    if (items.length == 0) {
        return;
    }
    let clearItems = {};
    for (let item of items) {
        let clearItem = { 'value': null, 'display': null };
        clearItems[item] = clearItem;
    }
    form.setFormItemsValue(formID, clearItems);
};

/**
 * 设置表头字段属性
 * @param {*} props 页面内置对象
 * @param {*} areaCode 区域编码
 * @param {*} headItemProps 表头页面属性
 */
export const setHeadItemProp = function (props, areaCode, headItemProps) {
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
        form.setFormItemsRequired(areaCode, requireArray);
    }
    if (Object.keys(editArray).length > 0) {
        form.setFormItemsDisabled(areaCode, editArray);
    }
}

export const setBodyItemProp = function (props, areaCode, bodyProp) {
    let { require, editable } = bodyProp;
}

/*Fnw/+7RrVHUifmTwZcmqxdrY3lVTDPaV0QO7i2EeE9k=*/