/*gi3ba4BiTBJEvBdDUlI7+2AnDN0CIYlY9aMUUpQa0W36aEPLW8aQ/5QtyTK3ULbg*/
import { createPage, ajax, base, high, cacheTools,toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款]-收回按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const unsubmitBtn = function () {
    let unsubmitData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (unsubmitData.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000094') });/* 国际化处理： 请选择数据,进行收回!*/
        return;
    }

    let unsubmitdataArr = [];
    let unlistTsmap = [];//ts的list类型
    //处理选择数据
    unsubmitData.forEach((val) => {
        unsubmitdataArr.push(val.data.values.pk_recbill.value);//主键数组
        let untsmap = {
            'pk': val.data.values.pk_recbill.value,
            'ts': val.data.values.ts.value,
            'index': val.index,
        }
        console.log(val.data.values.ts.value,'收回的ts');
        unlistTsmap.push(untsmap);
    });
    //自定义请求数据
    let unsubmitdata = {
        'pks': unsubmitdataArr,
        'pageid': this.pageId,
        'listTsmap': unlistTsmap
    };

    ajax({
        url: '/nccloud/cmp/recbill/listunsubmit.do',
        data: unsubmitdata,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList } = res.data;
            if (success) {
                BatchToast.call(this,'UNCOMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
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

/*gi3ba4BiTBJEvBdDUlI7+2AnDN0CIYlY9aMUUpQa0W36aEPLW8aQ/5QtyTK3ULbg*/