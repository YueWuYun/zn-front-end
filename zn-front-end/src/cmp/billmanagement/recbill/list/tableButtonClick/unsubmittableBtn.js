/*7+xkpDsA2zyjltjjRatyRRjlBB0cI2zZpGA+4Fb0RFJsuRd9c1tZZNZ/eE6L1cW6*/
import { ajax } from 'nc-lightapp-front';
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
/**
 * [收款结算]-收回按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const unsubmittableBtn = function (record, index) {
    let unsubmitdataArr = [];
    let tsmpa3 = {
        'pk': record.pk_recbill.value,
        'ts': record.ts.value,
        'index': index
    }
    let listTsmap3 = [];
    listTsmap3.push(tsmpa3);
    unsubmitdataArr.push(record.pk_recbill.value);
    let unsubmitdata = {
        'pks': unsubmitdataArr,
        'pageid': this.pageId,
        'ts': record.ts.value,
        'listTsmap': listTsmap3
    };

    ajax({
        url: '/nccloud/cmp/recbill/listunsubmit.do',
        data: unsubmitdata,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList } = res.data;
            if (success) {
                BatchToast.call(this, 'UNCOMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                //加载更新缓存数据
                if (gridList != null && gridList.length > 0) {
                    let gridRows = res.data.gridList;
                    gridRows.forEach((val) => {
                        let test = val.index;
                        let value = val.rows.values;
                        let unsubmitUpdateDataArr = [{
                            index: val.index,
                            data: { values: val.rows.values }//自定义封装数据
                        }];
                        this.props.table.updateDataByIndexs(this.tableId, unsubmitUpdateDataArr);
                    });
                }
            }
        }
    });
}

/*7+xkpDsA2zyjltjjRatyRRjlBB0cI2zZpGA+4Fb0RFJsuRd9c1tZZNZ/eE6L1cW6*/