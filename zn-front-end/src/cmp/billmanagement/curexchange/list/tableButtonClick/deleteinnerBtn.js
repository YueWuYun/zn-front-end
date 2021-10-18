/*VcstAr2d0Wqcj6jQQoZEkWSe3qOUHl2xxw/5hxW0CRx3Ya0tUSFSx+RDZyEQQEJO*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-删除按钮
 * @param {*} props  
 */
export const deleteinnerBtn = function (record, index) {
    let { deleteCacheId, addCacheId } = this.props.table;
    let data = {
        'pk': record.pk_cruexchange.value,
        'ts': record.ts.value,
        'pageid': this.pageCode
    };
    ajax({
        url: Templatedata.tablebutton_deleteinnerBtn,
        data: data,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex } = res.data;
            if (success) {
                //删除提示信息
                BatchToast.call(this, 'DELETE', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                if (sumNumIndex === successNumIndex) {
                    deleteCacheId(this.tableId, record.pk_cruexchange.value);//删除成功后, 删除allpk中pk
                    this.props.table.deleteTableRowsByIndex(this.tableId, index)//直接删除table中的行列
                }
            }
        }
    });

}

/*VcstAr2d0Wqcj6jQQoZEkWSe3qOUHl2xxw/5hxW0CRx3Ya0tUSFSx+RDZyEQQEJO*/