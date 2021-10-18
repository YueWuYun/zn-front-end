/*8yIwvr8LjXsThYjPnGT+TUp11LEmcAxGgkP/6S24mxV5HbNM25GNbWOsPA/diZ9R*/
import {  ajax,toast } from 'nc-lightapp-front';
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
/**
 * [收款]-取消关联结算信息按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const unlinksettleBtn = function () {
    let unlinksettleBtnData = this.props.table.getCheckedRows(this.tableId);
    if (unlinksettleBtnData.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000095') });/* 国际化处理： 请选择数据,进行取消关联结算信息!*/
        return
    }
    let unlinksettleBtn_dataArr = [];
    let listTsmap = [];//ts的list类型
    //处理选择数据
    unlinksettleBtnData.forEach((val) => {
        unlinksettleBtn_dataArr.push(val.data.values.pk_recbill.value);//主键数组
        let tsmap = {
            'pk': val.data.values.pk_recbill.value,
            'ts': val.data.values.ts.value,
            'index': val.index
        }
        listTsmap.push(tsmap);
    });
    //自定义请求数据
    let send_data = {
        'pks': unlinksettleBtn_dataArr,
        'pageid': this.pageId,
        'listTsmap': listTsmap
    };

    ajax({
        url: '/nccloud/cmp/recbill/recbilllistcancelsettle.do',
        data: send_data,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList, appointmap } = res.data;
            if (success) {
                BatchToast.call(this, 'CANCEL', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                if(sumNumIndex != failNumIndex){
                    this.refresh();
                }
                //加载更新缓存数据，取消管理其实就是删除操作，没有必要更新表格
                // if (gridList != null && gridList.length > 0) {
                //     let gridRows = res.data.gridList;
                //     gridRows.forEach((val) => {
                //         let test = val.index;
                //         let value = val.rows.values;
                //         let submitUpdateDataArr = [{
                //             index: val.index,
                //             data: { values: val.rows.values }//自定义封装数据
                //         }];
                //         this.props.table.updateDataByIndexs(this.tableId, submitUpdateDataArr);
                //     });
                // }
            }
        }
    });
}

/*8yIwvr8LjXsThYjPnGT+TUp11LEmcAxGgkP/6S24mxV5HbNM25GNbWOsPA/diZ9R*/