/*Hww6PtgxVS/IBvX5Xe4Z/E7iMoQCh6376Cev4K1FJH4CtNRzoNDb9YTocDFNutkN*/
import { ajax, toast } from 'nc-lightapp-front';
import * as CONSTANTS from '../const/constants';
let { tableId, pageCodeList, payPK_field } = CONSTANTS;
import { PromptMessage } from '../../public/listEvent.js';
import{ buttonDisable } from '../list/events/';

/**
 * 列表头部按钮交互
 * @param {*} opername     操作名称
 * @param {*} pk           主键
 * @param {*} path         接口地址
 * @param {*} content      toast弹框显示内容
 */
export const BusinessOperatorHead = function (key, opername, path, content) {
    let pk = "";
    let selectDatas = this.props.table.getCheckedRows(tableId);
    if (IsSelectedDate(this.props, selectDatas)) return;
    let index = 0;
    let pkMap = [];
    let pkMapTs = new Map();
    let ts;
    let pkMapRowIndex = new Map();
    while (selectDatas && selectDatas.length && index < selectDatas.length) {
        //获取行主键值
        pk =
            selectDatas[index] &&
            selectDatas[index].data &&
            selectDatas[index].data.values &&
            selectDatas[index].data.values[payPK_field] &&
            selectDatas[index].data.values[payPK_field].value;
        //获取行ts
        ts =
            selectDatas[index] &&
            selectDatas[index].data &&
            selectDatas[index].data.values &&
            selectDatas[index].data.values.ts &&
            selectDatas[index].data.values.ts.value;
        //主键与行号Map
        pkMapRowIndex.set(pk, selectDatas[index].index);
        pkMapTs.set(pk, ts);
        pkMap.push(pk);
        index++;
    }
    let data;
    if (selectDatas && selectDatas.length) {
        data = {
            pks: pkMap,
            pkMapTs: pkMapTs,
            pageCode: pageCodeList
        };
    }
    if (key == 'tryIntst' || key == 'preIntst') {
        let { startDate, endDate } = this.state;
        data.startDate = startDate;
        data.endDate = endDate;
        data.userObj = 'Unit';
    }
    if (key == 'cancelPreIntst' || key == 'cancelRedPreIntst') {
        data.userObj = 'Unit';
    }
    ajax({
        url: path,
        data: data,
        success: res => {
            if (res.success) {
                let result;
                if (res.data && res.data.billCards) {
                    result = res.data.billCards;
                }
                if (key == 'tryIntst' && res.data.status == "0") {
                    toast({ color: "success", content: content });
                    this.setState({
                        showTryCalModal: true,
                        showInterestTrialModal: false,
                        trycalData: result[0]
                    });
                } else if (key !== 'tryIntst' && res.data.status == "0" || res.data.status == "2") {
                    if (result) {
                        result.forEach(value => {
                            let pk =
                                value.head[tableId].rows[0].values[
                                    payPK_field
                                ].value;
                            let updateDataArr = [
                                {
                                    index: pkMapRowIndex.get(pk),
                                    data: {
                                        values:
                                            value.head[tableId].rows[0]
                                                .values
                                    }
                                }
                            ];
                            this.props.table.updateDataByIndexs(
                                tableId,
                                updateDataArr
                            );
                        });
                    }
                    if (key == 'preIntst') {
                        this.setState({
                            showWithholdingModal: false
                        });
                    }
                }

            }
            if (key !== 'tryIntst') {
                PromptMessage.call(this, res, opername);
            }
            buttonDisable(this.props);
        }
    });
    
}

function IsSelectedDate(props, selectedData) {
    if (selectedData.length == 0) {
        toast({
            content: props.MutiInit.getIntl("36362IWI") && props.MutiInit.getIntl("36362IWI").get('36362IWI-000001'),
            color: 'warning'
        });
        return true;
    }
    return false;
}

/*Hww6PtgxVS/IBvX5Xe4Z/E7iMoQCh6376Cev4K1FJH4CtNRzoNDb9YTocDFNutkN*/