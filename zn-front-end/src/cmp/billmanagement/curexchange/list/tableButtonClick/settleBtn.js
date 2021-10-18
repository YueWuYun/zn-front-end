/*vYFQPtH5n95sOHpDF4fDqNeGcciZVdonR9wrH4+fDmzlurpFOy7YJ0fcAJB/TelN*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-结算按钮
 * @param {*} props  
 */
export const settleBtn = function (record, index) {

    let settle_tsmap = {
        'ts': record.ts.value,
        'pk': record.pk_cruexchange.value,
        'index': index
    }
    let settle_listTsmap = [];//ts的list类型
    settle_listTsmap.push(settle_tsmap);
    let data = {
        'pk': record.pk_cruexchange.value,
        'pageid': this.pageCode,
        'ts': record.ts.value,
        'listTsmap': settle_listTsmap
    };

    ajax({
        url: Templatedata.tablebutton_settleBtn,
        data: data,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList } = res.data;
            if (success) {
                BatchToast.call(this,'SETTLE', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                //加载更新缓存数据
                if (gridList != null && gridList.length > 0) {
                    let gridRows = res.data.gridList;
                    gridRows.forEach((val) => {
                        let test = val.index;
                        let value = val.rows.values;
                        let settledataArr = [{
                            index: val.index,
                            data: { values: val.rows.values }//自定义封装数据
                        }];
                        this.props.table.updateDataByIndexs(this.tableId, settledataArr);
                    });
                }
            }
        }
    });

}

/*vYFQPtH5n95sOHpDF4fDqNeGcciZVdonR9wrH4+fDmzlurpFOy7YJ0fcAJB/TelN*/