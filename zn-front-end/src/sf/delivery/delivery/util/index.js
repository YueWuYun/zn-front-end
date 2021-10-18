/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
import { ajax, toast } from 'nc-lightapp-front';
import { card_from_id } from '../cons/constant'

/**
 * 上收支付前校验
 * 
 */
export const payBeforeValidate = function (props, batchdata) {
    return new Promise(resolve => ajax({
        url: '/nccloud/sf/delivery/deliverypaybeforevalidate.do',
        data: batchdata,
        loading: false,
        async: false,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                resolve(data);
            }
        },
        error: res => resolve(null)
    }));
}

export const clsRowno = function (props, card_table_id) {
    let allTableData = props.cardTable.getAllRows(card_table_id);
    let maxrowno;
    if (allTableData[0].values.rowno && allTableData[0].values.rowno.value) {
        maxrowno = parseInt(allTableData[0].values.rowno.value);
    } else {
        maxrowno = parseInt(0);
    }
    if (allTableData) {
        allTableData.forEach((val) => {
            if (maxrowno < parseInt(val.values.rowno.value)) {
                maxrowno = parseInt(val.values.rowno.value);
            }
        });
        allTableData.forEach((val) => {
            if (val.values.rowno && val.values.rowno.value) {

            } else {
                maxrowno = (parseInt(maxrowno) + parseInt(10));
                val.values.rowno.value = String(maxrowno);
            }
        });
    }
}

/**清空卡片界面数据 */
export const clearCardData = function ({ props, headCode, bodyCode, repainFunc }) {
    props.form.setAllFormValue({ [headCode]: { rows: [] } });
    props.cardTable.setTableData(bodyCode, { rows: [] });
    if (repainFunc && (typeof repainFunc == 'function')) {
        repainFunc();
    }
}

/**操作异常处理 */
export const operErr = function ({ props, headCode, bodyCode, repainFunc, isWarn = true, error }) {
    if (isWarn && error) {
        toast({ color: 'danger', content: error.message });
    }
    clearCardData({ props, headCode, bodyCode, repainFunc });
}

/** 分录作废按钮可用性逻辑 */
export const recorddisuseEnbale = function (props, headAreaCode = card_from_id) {
    let srcbusitype = props.form.getFormItemsValue(headAreaCode, 'srcbusitype') && props.form.getFormItemsValue(headAreaCode, 'srcbusitype').value;
    let billstatus = props.form.getFormItemsValue(headAreaCode, 'billstatus') && props.form.getFormItemsValue(headAreaCode, 'billstatus').value;
    let enable = (srcbusitype != 5) && (billstatus == 3 || billstatus == 2);
    props.button.setButtonVisible(['recorddisuse'], enable);
}
/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/