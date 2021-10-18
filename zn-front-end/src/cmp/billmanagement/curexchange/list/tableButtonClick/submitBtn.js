/*2dJDSOWW04YBvwykI0nbYL4L12n32XnRq4RxL818dyQT7vWwLY8EQaY065s40Wea*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-提交按钮
 * @param {*} props  
 */
export const submitBtn = function (record, index) {

    let tsmap = {
        'ts': record.ts.value,
        'pk': record.pk_cruexchange.value,
        'index': index
    }
    let listTsmap = [];//ts的list类型
    listTsmap.push(tsmap);
    let data = {
        'pk': record.pk_cruexchange.value,
        'pageid': this.pageCode,
        'ts': record.ts.value,
        'listTsmap': listTsmap
    };
    ajax({
        url: Templatedata.tablebutton_submit,
        data: data,
        success: (res) => {
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList, appointmap } = res.data;
            //提交--指派
            if (appointmap && appointmap.workflow &&
                (appointmap.workflow == 'approveflow' ||
                    appointmap.workflow == 'workflow')) {
                this.compositedata = appointmap;
                this.setState({
                    compositedisplay: true,
                    record: record,
                    index: index
                });
            } else {
                BatchToast.call(this,'COMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                //加载更新缓存数据
                if (gridList != null && gridList.length > 0) {
                    let gridRows = res.data.gridList;
                    gridRows.forEach((val) => {
                        let test = val.index;
                        let value = val.rows.values;
                        let updateDataArr = [{
                            index: index,
                            data: { values: val.rows.values }
                        }];
                        this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
                    });
                }
            }

        }
    });

}

/*2dJDSOWW04YBvwykI0nbYL4L12n32XnRq4RxL818dyQT7vWwLY8EQaY065s40Wea*/