/*PmETh3G9Mp9znykR2R1O5/F7/9uPxtKkE+/L+L/kEAzJoZQDmBqbZ72sqPBIGROM*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
import { restNavData } from "./restNavData";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换index]-确认删除方法
 * @param {*}  
 */
export const delConfirm = function () {

    let { deleteCacheId, addCacheId } = this.props.table;
    let selectedData = this.props.table.getCheckedRows(this.tableId);
    let deletTableId = this.tableId;
    let indexArr = [];//索引数组
    let dataArr = [];//数据数组
    let liststsmap = [];
    //处理选择数据
    selectedData.forEach((val) => {
        dataArr.push(val.data.values.pk_cruexchange.value);//主键数组
        indexArr.push(val.index);
        let deletetsmap = {
            'ts': val.data.values.ts.value,
            'pk': val.data.values.pk_cruexchange.value,
            'index': val.index//新增每行的index
        }
        liststsmap.push(deletetsmap);
    });
    let data = {
        'pks': dataArr,
        'listTsmap': liststsmap
    };
    let self = this;
    ajax({
        url: '/nccloud/cmp/curexchange/curexchangedelete.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex } = res.data;
            if (success) {
                //删除提示信息
                BatchToast.call(this,'DELETE', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                if (successPks.length > 0) {
                    successPks.forEach((val) => {
                        deleteCacheId(this.tableId, val);//删除成功后, 删除allpk中pk
                    })
                }
                if (successIndex.length > 0) {
                    this.props.table.deleteTableRowsByIndex(this.tableId, successIndex)//直接删除table中的行列
                }

            }
        }
    });
}

/*PmETh3G9Mp9znykR2R1O5/F7/9uPxtKkE+/L+L/kEAzJoZQDmBqbZ72sqPBIGROM*/