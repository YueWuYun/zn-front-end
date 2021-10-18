/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import './index.less';
import { base, promptBox } from 'nc-lightapp-front';

import { saveMultiLangRes, loadMultiLang, tbbWarnDialog, getTBBMsg } from '../../../../tmpub/pub/util/index'
import cons from '../cons'
const { NCIcon, NCTooltip } = base;


/**创建提示图标 */
const buildWarnIcon = function (props, { record }) {
    //获取是否重复支付
    let hasduplicatepay = record.values ? ((record.values[cons.field.field_checkflag] && record.values[cons.field.field_checkflag].value) || false) : ((record[cons.field.field_checkflag] && record[cons.field.field_checkflag].value) || false);
    //重复支付时渲染图标
    return (hasduplicatepay && <span class="opration-wrapper">
        <NCIcon type='uf-i-c-2' className="warning_icon" />
    </span>
    );
}

/** 指定字段中追加图标 */
const appendIcon = function ({ props, item, field }) {
    if (!item || !field) {
        return;
    }
    if (item.attrcode == field) {
        item.renderStatus = 'browse';
        item.render = (text, record, index) => {
            //判断是否重复支付
            let hasduplicatepay = record.values ? ((record.values[cons.field.field_checkflag] && record.values[cons.field.field_checkflag].value) || false) : ((record[cons.field.field_checkflag] && record[cons.field.field_checkflag].value) || false);
            let display = record.values ? ((record.values[field] && (record.values[field].display || record.values[field].value)) || '') : ((record[field] && (record[field].display || record[field].vallue)) || '');
            return (
                <div class="warning_div">
                    {hasduplicatepay && <i className="warning_icon" />}
                    {display}
                </div>
            );
        };
    }
}
/** 重复支付提示 */
const duplicatePayDialog = function (props, { confirm }) {
    promptBox({
        color: "warning",
        title: loadMultiLang(props, '3601-000011'),/* 国际化处理： 疑似重复支付*/
        content: loadMultiLang(props, '3601-000012'),/* 国际化处理： 疑似重复支付，是否继续操作?*/
        beSureBtnClick: () => {
            confirm();
        }
    });
}

/** 批量数据进行重复支付检查 */
const multiDataDuplicatePayCheck = function (props, { tableCode, confirm }) {
    let selectDatas = props.table.getCheckedRows(tableCode);
    /**如果未选中，走确定逻辑，按照确定逻辑中的逻辑进行判断 */
    if (!selectDatas || selectDatas.length == 0) {
        confirm();
        return;
    }
    //是否有重复支付
    let hasduplicatepay = false;
    //遍历选中的数据，如果数据中有重复支付数据，则进行
    for (let selectData of selectDatas) {
        hasduplicatepay = (selectData && selectData.data && selectData.data.values && selectData.data.values[cons.field.field_checkflag] && selectData.data.values[cons.field.field_checkflag].value) || false;
        if (hasduplicatepay) {
            break;
        }
    }
    //如果有重复支付，则提示
    if (hasduplicatepay) {
        duplicatePayDialog(props, { confirm })
    } else {
        confirm();
    }
}

/**列表单笔数据重复支付检查 */
const listSingleDuplicatePayCheck = function (props, { record, confirm }) {
    let hasduplicatepay = (record && record[cons.field.field_checkflag] && record[cons.field.field_checkflag].value) || false;
    if (hasduplicatepay) {
        duplicatePayDialog(props, { confirm })
    } else {
        confirm();
    }
}

/**卡片重复支付检查 */
const cardDuplicatePayCheck = function (props, { bodyCode, confirm }) {
    let rows = props.cardTable.getAllData(bodyCode).rows;
    /**如果没有表体数据，走确定逻辑，让原有逻辑来判断是否继续 */
    if (!rows || rows.length == 0) {
        confirm();
        return;
    }
    //是否有重复支付
    let hasduplicatepay = false;
    for (let row of rows) {
        hasduplicatepay = (row && row.values && row.values[cons.field.field_checkflag] && row.values[cons.field.field_checkflag].value) || false;
        if (hasduplicatepay) {
            break;
        }
    }
    if (hasduplicatepay) {
        duplicatePayDialog(props, { confirm })
    } else {
        confirm();
    }
}

/**列表操作 同步重复支付标志 */
const listSynCheckFlag = function (props, { tableCode, indexArr, datas }) {
    if (!tableCode || !indexArr || indexArr.length == 0 || !datas || datas.length == 0 || indexArr.length != datas.length) {
        return;
    }
    let data = props.table.getAllTableData(tableCode);
    for (let i = 0; i < indexArr.length; i++) {
        let index = indexArr[i];
        let flag = (data && data.rows && data.rows[index] && data.rows[index].values && data.rows[index].values[cons.field.field_checkflag] && data.rows[index].values[cons.field.field_checkflag].value) || false;
        if (!flag) {
            continue;
        }
        datas[i].values[cons.field.field_checkflag] = { value: true };
    }
}

/**卡片操作 同步重复支付标志 */
const cardSynCheckFlag = function (props, { tableCode, bodyData }) {
    if (!tableCode || !bodyData || !bodyData.rows || bodyData.rows.length == 0) {
        return;
    }
    let rowSize = bodyData.rows.length;
    for (let index = 0; index < rowSize; index++) {
        let flag = (props.cardTable.getValByKeyAndIndex(tableCode, index, cons.field.field_checkflag) && props.cardTable.getValByKeyAndIndex(tableCode, index, cons.field.field_checkflag).value) || false;
        if (!flag) {
            continue;
        }
        bodyData.rows[index].values[cons.field.field_checkflag] = { value: true };
    }
}

/**预算预警确认 */
const tbbAlarmConfim = function ({
    //页面属性
    props,
    //签字/取消签字请求数据
    data,
    //签字/取消签字的返回数据
    res,
    //预算预警提示后确认请求
    confirm }) {
    let { tbbctrlinfo } = (res && res.data) || {};
    if (!tbbctrlinfo) {
        //返回是否有预算提示
        return false;
    }
    tbbWarnDialog(props, {
        ntbinfos: tbbctrlinfo,
        onConfirm: (pks) => {
            //将超额度的单据数据注入到新的请求数据中
            data.pks = pks;
            //预算超额确认标志
            data.tbbConfirm = true;
            //确认后再次签字
            confirm(data);
        }
    });
    //返回是否有预算提示
    return true;
}
export default {
    /**创建提示图标 */
    buildWarnIcon, appendIcon, saveMultiLangRes, loadMultiLang, tbbWarnDialog, multiDataDuplicatePayCheck, listSingleDuplicatePayCheck, cardDuplicatePayCheck, listSynCheckFlag, cardSynCheckFlag, tbbAlarmConfim
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/