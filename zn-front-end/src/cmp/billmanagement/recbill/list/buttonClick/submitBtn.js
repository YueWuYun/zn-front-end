/*2dJDSOWW04YBvwykI0nbYL4L12n32XnRq4RxL818dyQT7vWwLY8EQaY065s40Wea*/
import { ajax, base, high, cacheTools, toast, cardCache } from 'nc-lightapp-front';
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
import appBase from '../../base';
const { api } = appBase;
/**
 * [收款]-提交按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const submitBtn = function () {
    let submitData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (submitData.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000093') });/* 国际化处理： 请选择数据,进行提交!*/
        return
    }
    let submitdataArr = [];
    let listTsmap = [];//ts的list类型
    //处理选择数据
    submitData.forEach((val) => {
        submitdataArr.push(val.data.values.pk_recbill.value);//主键数组
        let tsmap = {
            'pk': val.data.values.pk_recbill.value,
            'ts': val.data.values.ts.value,
            'index': val.index
        }
        console.log(val.data.values.ts.value, '提交的ts');
        listTsmap.push(tsmap);
    });
    //自定义请求数据
    let submitdata = {
        'pks': submitdataArr,
        'pageid': this.pageId,
        'listTsmap': listTsmap
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
                        compositedisplay: true
                    });

                } else {
                    // BatchToast.call(this, 'COMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                    //加载更新缓存数据
                    if (gridList != null && gridList.length > 0) {
                        let gridRows = res.data.gridList;
                        gridRows.forEach((val) => {
                            let test = val.index;
                            let value = val.rows.values;
                            let tbbMsg = api.comm.getTbbMsg({ props: this.props, row: val.rows });
                            if (tbbMsg) {
                                message.push(tbbMsg);
                            }
                            let submitUpdateDataArr = [{
                                index: val.index,
                                data: { values: val.rows.values }//自定义封装数据
                            }];
                            this.props.table.updateDataByIndexs(this.tableId, submitUpdateDataArr);
                        });
                    }
                    BatchToast.call(this, 'COMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                }
            }
        }
    });
}

/*2dJDSOWW04YBvwykI0nbYL4L12n32XnRq4RxL818dyQT7vWwLY8EQaY065s40Wea*/