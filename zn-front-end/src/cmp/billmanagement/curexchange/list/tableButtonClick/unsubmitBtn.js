/*gi3ba4BiTBJEvBdDUlI7+2AnDN0CIYlY9aMUUpQa0W36aEPLW8aQ/5QtyTK3ULbg*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-收回按钮
 * @param {*} props  
 */
export const unsubmitBtn = function (record, index) {

    let tsunmap = {
        'ts': record.ts.value,
        'pk': record.pk_cruexchange.value,
        'index': index
    }
    let listunTsmap = [];//ts的list类型
    listunTsmap.push(tsunmap);
    let unsubmitdata = {
        'pk': record.pk_cruexchange.value,
        'pageid': this.pageCode,
        'ts': record.ts.value,
        'listTsmap': listunTsmap
    };
    ajax({
        url: Templatedata.tablebutton_unsubmit,
        data: unsubmitdata,
        success: (res) => {
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList } = res.data;
            BatchToast.call(this,'UNCOMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
            //加载更新缓存数据
            if (gridList != null && gridList.length > 0) {
                let gridRows = res.data.gridList;
                gridRows.forEach((val) => {
                    let test = val.index;
                    let value = val.rows.values;
                    let unsubmitUpdateDataArr = [{
                        index: index,
                        data: { values: val.rows.values }
                    }];
                    this.props.table.updateDataByIndexs(this.tableId, unsubmitUpdateDataArr);
                });
            }

        }
    });

}

/*gi3ba4BiTBJEvBdDUlI7+2AnDN0CIYlY9aMUUpQa0W36aEPLW8aQ/5QtyTK3ULbg*/