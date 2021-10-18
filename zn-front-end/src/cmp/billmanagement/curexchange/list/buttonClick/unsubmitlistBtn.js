/*AXTpKmDVEhBzpPaxtEkwFW1vm7IzAVy1reTf3fMDZOKO6cHYkMbbLLtYFqfMYevS*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
/**
 * [外币兑换]-收回按钮
 * @param {*} props  
 */
export const unsubmitlistBtn = function () {
    let unsubmitData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (unsubmitData.length == 0) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000055')   // 提示内容,非必输/* 国际化处理： 请选择数据，进行收回*/
        })
        return
    }
    let indexArr7 = [];
    let dataArr7 = [];
    let unsubmitlistTsmap = [];//ts的list类型
    //处理选择数据
    unsubmitData.forEach((val) => {
        dataArr7.push(val.data.values.pk_cruexchange.value);//主键数组
        indexArr7.push(val.index);
        let unsubTsmap = {
            'ts': val.data.values.ts.value,
            'pk': val.data.values.pk_cruexchange.value,
            'index': val.index
        }
        unsubmitlistTsmap.push(unsubTsmap);
    });
    //自定义请求数据
    let data7 = {
        'pks': dataArr7,
        'pageid': this.pageCode,
        'listTsmap': unsubmitlistTsmap
    };
    ajax({
        url: Templatedata.buttonclick_unsubmit,
        data: data7,
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

/*AXTpKmDVEhBzpPaxtEkwFW1vm7IzAVy1reTf3fMDZOKO6cHYkMbbLLtYFqfMYevS*/