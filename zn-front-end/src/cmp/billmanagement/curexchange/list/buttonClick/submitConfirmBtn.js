/*Mhtv/cyl2gpcAyMUDq7M1qzGzNJo8uNW+t4M6hfRH/C2CksS/AiAngESsSNJ+M06*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
/**
 * [外币兑换]-提交指派确认按钮
 * @param {*} props  
 */
export const submitConfirmBtn = function () {
    let app_submitData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (app_submitData.length == 0) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000054')   // 提示内容,非必输/* 国际化处理： 请选择数据,进行提交!*/
        })
        return
    }
    let indexArr66 = [];
    let dataArr66 = [];
    let listTsmap6 = [];//ts的list类型
    //处理选择数据
    app_submitData.forEach((val) => {
        dataArr66.push(val.data.values.pk_cruexchange.value);//主键数组
        indexArr66.push(val.index);
        let tsmap = {
            'pk': val.data.values.pk_cruexchange.value,
            'ts': val.data.values.ts.value,
            'index': val.index,
            'value': this.state.getAssginUsedr
        }
        listTsmap6.push(tsmap);
    });
    //自定义请求数据
    let data66 = {
        'pks': dataArr66,
        'pageid': this.pageCode,
        'listTsmap': listTsmap6
    };

    ajax({
        url: Templatedata.buttonclick_submit,
        data: data66,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList, appointmap } = res.data;
            //提交--指派
            //没有指派直接提示成功
            if (success) {
                BatchToast('COMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                //加载更新缓存数据
                if (gridList != null && gridList.length > 0) {
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
    });
}

/*Mhtv/cyl2gpcAyMUDq7M1qzGzNJo8uNW+t4M6hfRH/C2CksS/AiAngESsSNJ+M06*/