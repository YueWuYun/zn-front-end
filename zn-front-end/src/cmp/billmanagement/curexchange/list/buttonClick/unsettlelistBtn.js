/*Qt410DQgA/34zVsZri62+pHJatDqCb4Z7uRqkAH2hUmR51r2WvVolXQELp8jR3To*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
/**
 * [外币兑换]-取消结算按钮
 * @param {*} props  
 */
export const unsettlelistBtn = function () {

    let unsettleData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (unsettleData.length == 0) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000052')   // 提示内容,非必输/* 国际化处理： 请选择数据,进行取消结算!*/
        })
        return;
    }
    let indexArr5 = [];
    let dataArr5 = [];
    let unsettlelistTsmap = [];//ts的list类型
    //处理选择数据
    unsettleData.forEach((val) => {
        dataArr5.push(val.data.values.pk_cruexchange.value);//主键数组
        indexArr5.push(val.index);
        let unsettletsmap = {
            'pk': val.data.values.pk_cruexchange.value,
            'ts': val.data.values.ts.value,
            'index': val.index
        }
        unsettlelistTsmap.push(unsettletsmap);
    });
    //自定义请求数据
    let data5 = {
        'pks': dataArr5,
        'pageid': this.pageCode,
        'listTsmap': unsettlelistTsmap,
    };

    ajax({
        url: Templatedata.buttonclick_unsettle,
        data: data5,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList } = res.data;
            if (success) {
                BatchToast.call(this,'SETTLE', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                //加载更新缓存数据
                if (gridList != null && gridList.length > 0) {
                    let gridRows = res.data.gridList;
                    gridRows.forEach((val) => {
                        let test = val.index;
                        let value = val.rows.values;
                        let unsettledataArr = [{
                            index: val.index,
                            data: { values: val.rows.values }//自定义封装数据
                        }];
                        this.props.table.updateDataByIndexs(this.tableId, unsettledataArr);
                    });
                }
            }
        }
    });
}

/*Qt410DQgA/34zVsZri62+pHJatDqCb4Z7uRqkAH2hUmR51r2WvVolXQELp8jR3To*/