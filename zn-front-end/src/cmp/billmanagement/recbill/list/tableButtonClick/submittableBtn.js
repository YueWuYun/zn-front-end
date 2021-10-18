/*/cPwJ/sLrFE3w25QRlhBIOP2Njf3VlsaXzPP0Zi3jZkyaJU7iAECHQLxXxUKbPZz*/
import { ajax } from 'nc-lightapp-front';
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
import appBase from '../../base';
const { api } = appBase;
/**
 * [收款结算]-提交按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const submittableBtn = function (record, index) {
    let submitdataArr = [];
    let tsmpa2 = {
        'pk': record.pk_recbill.value,
        'ts': record.ts.value,
        'index': index
    }
    let listTsmap2 = [];
    listTsmap2.push(tsmpa2);
    submitdataArr.push(record.pk_recbill.value);
    let submitdata = {
        'pks': submitdataArr,
        'pageid': this.pageId,
        'ts': record.ts.value,
        'listTsmap': listTsmap2
    };

    ajax({
        url: '/nccloud/cmp/recbill/listsubmit.do',
        data: submitdata,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList, appointmap } = res.data;
            if (success) {
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
                    BatchToast.call(this, 'COMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                    //加载更新缓存数据
                    if (gridList != null && gridList.length > 0) {

                        //begin tm tangleic 20200219 提交支持预算交互异常信息输出
                        api.comm.showTbbMsg({ props: this.props, row: res.data.gridList[0].rows });
                        //end tm tangleic

                        let gridRows = res.data.gridList;
                        gridRows.forEach((val) => {
                            let test = val.index;
                            let value = val.rows.values;
                            let submitUpdateDataArr = [{
                                index: val.index,
                                data: { values: val.rows.values }//自定义封装数据
                            }];
                            this.props.table.updateDataByIndexs(this.tableId, submitUpdateDataArr);
                        });
                    }
                }

            }
        }
    });
}

/*/cPwJ/sLrFE3w25QRlhBIOP2Njf3VlsaXzPP0Zi3jZkyaJU7iAECHQLxXxUKbPZz*/