/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
//引入配置常量定义
import { card_page_id, card_form_id, card_table_id, FIELD, VOSTATUS } from '../../cons/constant.js';
//原始聚合vomap：存放修改保存前，调整后积数不为空的表体和表头，即被修改过的VO
var originalVOs = new Map();
//当前编辑的聚合vomap：存放当前编辑后，调整后积数不为空的表体和表头，即将保存的VO
var editedVOs = new Map();

export default function afterEvent(props, moduleId, key, value, changedrows, i) {
    let card = props.createMasterChildData(card_page_id, card_form_id, card_table_id);
    switch (key) {
        // 调整积数
        case FIELD.BODY.ADJUSTMENT:
            recalAdjustedaggregate.call(this, props, card);
            putEditedVOToMap.call(this, props, card, i);
            break;
        // 初始化操作，清空编辑过的数据，初始化原始VOmap
        case 'init':
            initOriginalMap.call(this, props, value);
            editedVOs.clear();
            break;
        default:
            break;
    }
}

/**
 * 取变更聚合VO集合，集合存放三类VO，新增、删除和更新
 * @param {*} props 页面属性
 */
export const getChangeCards = function (props) {
    let editvo = {
        head: null,
        body: null
    };
    let oldvo = {
        head: null,
        body: null
    };
    let newVOs = [];	// 新增的VO
    let deleteVOs = [];	// 删除的VO
    let updateVOs = [];	// 更新的VO
    // 遍历正在编辑的聚合vomap
    editedVOs.forEach((value, key, map) => {
        editvo = value;
        oldvo = originalVOs.get(key);
        let children = JSON.parse(JSON.stringify(editvo.body));	// 需要保存到数据库的表体行，使用JSON深拷贝对象。
        children[card_table_id].rows = [];
        let editvoRows = editvo.body[card_table_id].rows; // 本次修改的表体行
        // 该聚合VO没有被编辑过
        if (!oldvo) {
            // 给表体设置状态
            for (let index in editvoRows) {

                let flag = editvoRows[index].values[FIELD.BODY.ADJUSTMENT].value;
                if(!flag){//判断如果积数调整没有数据  跳过
                    continue;
                }

                editvoRows[index].status = VOSTATUS.NEW;
                children[card_table_id].rows.push(editvoRows[index]);
            }
            // 给表头设置状态，把vo添加到新增VO数组里
            if (children[card_table_id].rows.length > 0) {
                editvo.head[card_form_id].rows[0].status = VOSTATUS.NEW;
                editvo.body = children;
                newVOs.push(editvo);
            }
        }
        // 取更新后VO，并编辑VO状态
        else {
            let isAllDelete = true;
            let oldChildren = new Map();
            let oldvoRows = oldvo.body[card_table_id].rows;
            for (let index in oldvoRows) {
                //用调整日期作为表体行map的key
                oldChildren.set(oldvoRows[index].values[FIELD.BODY.ADJUSTDATE].value, oldvoRows[index]);
            }
            for (let i in editvoRows) {
                // 根据表体调整日期，从原始VOmap里面取出该表体
                let oldChild = oldChildren.get(editvoRows[i].values[FIELD.BODY.ADJUSTDATE].value);
                // 原始VO里面存在当前表体
                if (oldChild) {
                    // 当前编辑表体的调整积数为空，表示删除
                    if (!editvoRows[i].values[FIELD.BODY.ADJUSTMENT].value) {
                        editvoRows[i].status = VOSTATUS.DELETED;
                        children[card_table_id].rows.push(editvoRows[i]);
                    }
                    // 当前编辑表体的调整积数不为空，且和原始调整积数不相等，表示更新
                    else if (editvoRows[i].values[FIELD.BODY.ADJUSTMENT].value != oldChild.values[FIELD.BODY.ADJUSTMENT].value) {
                        isAllDelete = false;
                        editvoRows[i].status = VOSTATUS.UPDATED;
                        children[card_table_id].rows.push(editvoRows[i]);
                    }
                    else {
                        // 当前编辑表体的调整积数和原始调整积数相等，不做处理
                    }
                }
                // 原始VO里面不存在当前表体，即新增表体VO
                else {
                    if (editvoRows[i].values[FIELD.BODY.ADJUSTMENT].value) {
                        isAllDelete = false;
                        editvoRows[i].status = VOSTATUS.NEW;
                        children[card_table_id].rows.push(editvoRows[i]);
                    }
                }
            }
            if (children[card_table_id].rows.length > 0) {
                editvo.body = children;
                // 所有表体都被删除了（调整积数全都设置为空了）
                if (isAllDelete && oldChildren.size == children[card_table_id].rows.length) {
                    editvo.head[card_form_id].rows[0].status = VOSTATUS.DELETED;
                    deleteVOs.push(editvo);
                }
                // 更新
                else {
                    editvo.head[card_form_id].rows[0].status = VOSTATUS.UPDATED;
                    updateVOs.push(editvo);
                }
            }
        }
    });
    let changeCards = {
        NEW: newVOs,
        UPDATE: updateVOs,
        DELETE: deleteVOs
    }
    return changeCards;
}

/**
 * 初始化原始VO集合
 * @param {*} props 页面属性
 * @param {*} card 页面数据
 */
const initOriginalMap = function (props, tabDataMap) {
    originalVOs.clear();
    tabDataMap && tabDataMap.forEach((card, key, map) => {
        if (!card || !card.head[card_form_id]) {
            return;
        }
        // 调整后的表体vo，使用JSON深拷贝对象。
        let adjustedBodys = JSON.parse(JSON.stringify(card.body));
        // 页面上所有的表体行，使用JSON深拷贝对象。
        let allbody = JSON.parse(JSON.stringify(card.body));
        // 判断调整积数是否有值，有值的添加到调整后表体vo中
        adjustedBodys[card_table_id].rows = [];
        for (let index in allbody[card_table_id].rows) {
            if (allbody[card_table_id].rows[index].values[FIELD.BODY.ADJUSTMENT].value) {
                adjustedBodys[card_table_id].rows.push(allbody[card_table_id].rows[index]);
            }
        }
        // 如果有表体行被调整过，添加到原始聚合vomap里面
        if (adjustedBodys[card_table_id].rows.length > 0) {
            // let key = card.head[card_form_id].rows[0].values[FIELD.HEAD.TABTITLE].value;
            originalVOs.set(key, {
                head: card.head,
                body: adjustedBodys
            });
        }
    });
}

/**
 * 重算调整后积数
 * @param {*} props 页面属性
 * @param {*} card 页面数据
 */
const recalAdjustedaggregate = function (props, card) {
    if (!card || !card.head || !card.body) {
        return;
    }
    let allbodyRows = card.body[card_table_id].rows;
    let adjustedaggregate = 0;	//调整后积数
    for (let i in allbodyRows) {
        let tmpIntBalance = Number(allbodyRows[i].values[FIELD.BODY.INTBALANCE].value);	// 计息余额
        let tmpAdjustment = Number(allbodyRows[i].values[FIELD.BODY.ADJUSTMENT].value);	// 调整积数
        let resetFlag = allbodyRows[i].values[FIELD.BODY.RESETFLAG].value;	// 归零标识
        // 归零标识为true或者为第一行数据，调整后积数等于计息积数
        if (resetFlag == true || i == 0) {
            adjustedaggregate = Number(allbodyRows[i].values[FIELD.BODY.INTAGGREGATE].value);	// 计息积数
        }
        // 调整后积数等于上一天的调整后积数加上这一天的计息余额
        else {
            adjustedaggregate += tmpIntBalance;
        }
        // 调整积数不为空时，调整后积数只等于调整积数
        if (tmpAdjustment) {
            adjustedaggregate = tmpAdjustment;
        }
        allbodyRows[i].values[FIELD.BODY.ADJUSTEDAGGREGATE].value = adjustedaggregate;
        allbodyRows[i].values[FIELD.BODY.ADJUSTEDAGGREGATE].display = adjustedaggregate;
    }
}

/**
 * 把正在编辑的VO加到映射中
 * @param {*} props 页面属性
 * @param {*} card 页面数据
 * @param {*} i 行号
 */
const putEditedVOToMap = function (props, card, i) {
    if (!card || !card.head[card_form_id]) {
        return;
    }
    // let key = card.head[card_form_id].rows[0].values[FIELD.HEAD.TABTITLE].value;
    let key = this.state.selectedGroup;
    // 修改的表体行
    let editedRow = props.cardTable.getRowsByIndexs(card_table_id, i)[0];
    // 修改的聚合VO，使用JSON深拷贝对象。
    var editedAggvo = JSON.parse(JSON.stringify(card));
    editedAggvo.head[card_form_id].rows = [];
    editedAggvo.body[card_table_id].rows = [];
    if (editedVOs.has(key)) {
        editedAggvo = editedVOs.get(key);
    }
    else {
        editedAggvo.head = card.head;
    }
    updateChildVO(editedAggvo, editedRow, card);
    // 把最新的编辑聚合vo放到map中
    editedVOs.set(key, editedAggvo);
}

/**
 * 把正在编辑的表体VO加到映射中
 * @param {*} editedAggvo 
 * @param {*} editedRow 
 * @param {*} card 
 */
const updateChildVO = function (editedAggvo, editedRow, card) {
    // 在编辑后的VO集合里查找正在编辑的表体
    let orignalBody = searchBody(editedAggvo.body, editedRow);
    // 找不到，追加到编辑后VO的集合里
    if (!orignalBody) {
        orignalBody = searchBody(card.body, editedRow);
        let oldChildren = editedAggvo.body;
        let size = !oldChildren[card_table_id].rows ? 1 : oldChildren[card_table_id].rows.length + 1;
        let childrenRows = [];
        childrenRows[size - 1] = orignalBody;
        for (let i = size - 2; i >= 0; i--) {
            childrenRows[i] = oldChildren[card_table_id].rows[i];
        }
        editedAggvo.body[card_table_id].rows = childrenRows;
    }
    orignalBody.values[FIELD.BODY.ADJUSTMENT] = editedRow.values[FIELD.BODY.ADJUSTMENT];
}

/**
 * 把正在编辑的VO加到映射中
 * @param {*} allbody 所有表体
 * @param {*} target 目标表体
 */
const searchBody = function (allbody, target) {
    if (!allbody) {
        return null;
    }
    // 通过调整日期判断是否为同一行数据
    for (let index in allbody[card_table_id].rows) {
        if (allbody[card_table_id].rows[index].values[FIELD.BODY.ADJUSTDATE].value == target.values[FIELD.BODY.ADJUSTDATE].value) {
            return allbody[card_table_id].rows[index];
        }
    }
    return null;
}

/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/