/*Ra48+IEKzQNlYkA74ZYFnarcAOInbIgdG0VBD88t02I44zHookhJ6oQZurWuMJU7*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-取消结算按钮
 * @param {*} props  
 */
export const unsettleBtn = function (record, index) {

    let unsettle_tsmap = {
        'ts': record.ts.value,
        'pk': record.pk_cruexchange.value,
        'index': index
    }
    let unsettle_listTsmap = [];//ts的list类型
    unsettle_listTsmap.push(unsettle_tsmap);
    let data = {
        'pk': record.pk_cruexchange.value,
        'pageid': this.pageCode,
        'ts':  record.ts.value,
        'listTsmap': unsettle_listTsmap
    };
    ajax({
        url: Templatedata.tablebutton_unsettltBtn,
        data: data,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList } = res.data;
            if (success) {
                BatchToast.call(this,'UNSETTLE', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                //加载更新缓存数据
                if (gridList != null && gridList.length > 0) {
                    let gridRows = res.data.gridList;
                    gridRows.forEach((val) => {
                        let test = val.index;
                        let value = val.rows.values;
                        let unsettleupdateDataArr = [{
                            index: val.index,
                            data: { values: val.rows.values }
                        }];
                        this.props.table.updateDataByIndexs(this.tableId, unsettleupdateDataArr);
                    });
                }
            }
        }
    });

}

/*Ra48+IEKzQNlYkA74ZYFnarcAOInbIgdG0VBD88t02I44zHookhJ6oQZurWuMJU7*/