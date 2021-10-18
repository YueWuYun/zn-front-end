/*efSMTMCRQfmG60QYxKrMoCkPSKPMfnbDrGzTMkwwK8TPLRLNCnhXwQbyAR9RSS5Q*/
import { loadMultiLang } from "../../../tmpub/pub/util/index";

/**
 * FTS 编辑后事件处理公共API
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
/**
 * 冲销业务单据的金额校验 只有勾选冲销业务的单据才可以填写负数金额
 * @param {*} props 页面内置对象
 * @param {*} headCode 表头区域编码
 * @param {*} mnyValue 金额
 * @param {*} writeOffField 冲销业务字段(位于表头区域)
 */
export const validateWriteOffMny = function (props, headCode, mnyValue, writeOffField) {
    //金额>=0不处理
    if (Math.sign(mnyValue) >= 0) {
        return;
    }
    //获取冲销业务值
    let writeOff = props.form.getFormItemsValue(headCode, writeOffField) && props.form.getFormItemsValue(headCode, writeOffField).value;
    //未勾选冲销业务且金额<0则校验不通过
    if (writeOff) {
        return;
    } else {
        throw new Error(loadMultiLang(props, '36300-000000'));/* 国际化处理： 非冲销业务不能填写负数金额！*/
    }
}
/**
 * 构建精简表体编辑后事件数据(旨在替代原来平台API：createBodyAfterEventData，只保留修改的当前行数据)
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 表头区域编码
 * @param {*} handleBodyCode 当前操作表体区域编码
 * @param {*} relationBodyCode 关联区域编码
 * @param {*} attrCode 编辑的字段
 * @param {*} changeRows 编辑的行信息
 * @param {*} index 行索引
 * @param {*} isSingleBody 是否是单表体
 */
export const buildLightBodyAfterEditData = function (props, pageCode, headCode, handleBodyCode, relationBodyCode, attrCode, changeRows, index, isSingleBody = false) {
    try {
        //参数判空
        if (!props || !pageCode || !headCode || !handleBodyCode || !attrCode || !changeRows) {
            throw new Error("参数缺失！");
        }
        //构建表体编辑后事件数据
        let eventData = buildAfterEditEventData(props, pageCode, headCode, handleBodyCode, relationBodyCode, attrCode, changeRows, index, isSingleBody);
        let { card } = eventData;
        let { body, bodys } = card;
        //当编辑后事件数据只有一行表体时，不做额外处理。有多行时，对多行表体过滤，只保留当前编辑行
        if ((isSingleBody && body[handleBodyCode].rows.length == 1)
            || (!isSingleBody && bodys[handleBodyCode].rows.length == 1)) {
            return eventData;
        }
        return eventData;
    } catch (e) {
        //console.log("构建精简表体编辑后数据时出错！:" + e.message);
        throw e;
    }
}
/**
 * 构建编辑后事件表头数据
 * @param {*} props 页面内置对象
 * @param {*} headCode 表头区域编码
 */
const buildAfterEditHeadData = function (props, headCode) {
    let data = {};
    let formData = props.form.getAllFormValue(headCode);
    formData['areacode'] = headCode;
    data[headCode] = formData;
    return data;
}

/**
 * 构建表体编辑后事件数据
 * @param {*} props 页面内置对象
 * @param {*} bodyCode 表体区域编码
 */
const buildAfterEditBodyData = function (props, bodyCode, relationCode, changeRows) {
    let bodyRows = props.cardTable.getChangedRows(bodyCode);
    //修改行的行ID
    let changeRowID = changeRows[0].rowid;
    let newRowArr = [];
    //当编辑后事件数据只有一行表体时，不做额外处理。有多行时，对多行表体过滤，只保留当前编辑行
    if (bodyRows && bodyRows.length > 1) {
        for (let row of bodyRows) {
            let { rowid } = row;
            //过滤非当前修改的行
            if (!rowid || rowid != changeRowID) {
                continue;
            }
            newRowArr.push(row);
            break;
        }
    }else if(bodyRows && bodyRows.length == 1){
        newRowArr.push(bodyRows[0]);
    }
   
    let bodyData = {
        'rows': newRowArr,
        'areaType': 'table',
        'areacode': bodyCode
    };
    let data = {};
    data[bodyCode] = bodyData;

    let rowno1 = newRowArr && newRowArr[0].values.relationindex.value;
    if(rowno1){
        let relationRow = queryRelationRowsByRowno(props, relationCode, rowno1);
        if(relationRow && relationRow.length > 0){
            let relationData = {
                'rows': relationRow,
                'areaType': 'table',
                'areacode': relationCode
            };
            data[relationCode] = relationData;
        }
    }
    return data;
}

/**
 * 构建编辑后事件的卡片数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 表头区域编码
 * @param {*} bodyCode 表体区域编码（当前修改的表体）
 * @param {*} relationCode 关联表体区域编码
 * @param {*} attrcode 修改的字段
 * @param {*} changedrows 修改的行信息
 * @param {*} index 行索引
 * @param {*} isSingleBody 是否单表体
 */
const buildAfterEditEventData = function (props, pageCode, headCode, bodyCode, relationCode, attrcode, changedrows, index, isSingleBody) {
    let card = {
        'head': buildAfterEditHeadData(props, headCode),
        'pageid': pageCode
    };
    if (isSingleBody) {
        card['body'] = buildAfterEditBodyData(props, bodyCode);
    } else {
        card['bodys'] = buildAfterEditBodyData(props, bodyCode, relationCode, changedrows);
    }
    return {
        'areacode': bodyCode,
        attrcode,
        card,
        changedrows,
        index,
    };
}
/**
 * 根据财务页签rowno获取关联的资金页签表体行
 * @param {*} props 
 * @param {*} selectRownos 财务页签relationindex的数组
 */
export const queryRelationRowsByRowno = function (props, relationCode, selectRownos) {
    let queryRows = [];
    let allRows = props.cardTable.getAllRows(relationCode, false);
    for (let index = 0; index < allRows.length; index++) {
        const element = allRows[index];
        if (selectRownos == element.values.relationindex.value) {
            queryRows.push(allRows[index]);
        }
    }
    return queryRows;
  }
/*efSMTMCRQfmG60QYxKrMoCkPSKPMfnbDrGzTMkwwK8TPLRLNCnhXwQbyAR9RSS5Q*/