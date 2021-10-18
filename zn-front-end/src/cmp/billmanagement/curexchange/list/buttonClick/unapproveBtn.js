/*qi+kpmcs/SaAc4lLDiQVc92jZJStfMsGfLX9i9G60RxqO9TDmj+NLPx6PrnOoPrL*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
/**
 * [外币兑换]-退审按钮
 * @param {*} props 
 */
export const unapproveBtn = function () {
   
    let unapproveData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (unapproveData.length == 0) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000047')   // 提示内容,非必输/* 国际化处理： 请选择数据!*/
        })
        return
    }
    let indexArr3 = [];
    let dataArr3 = [];
    //处理选择数据
    unapproveData.forEach((val) => {
        dataArr3.push(val.data.values.pk_cruexchange.value);//主键数组
        indexArr3.push(val.index);
    });
    //自定义请求数据
    let data3 = {
        'pks': dataArr3
    };

    ajax({
        url: Templatedata.buttonclick_unapproce,
        data: data3,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'success',     // 提示类别，默认是 "success",非必输
                    title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000048'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 已成功*/
                    content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000050')   // 提示内容,非必输/* 国际化处理： 审批取消成功!*/
                })
                this.refresh();
            }
        }
    });
}

/*qi+kpmcs/SaAc4lLDiQVc92jZJStfMsGfLX9i9G60RxqO9TDmj+NLPx6PrnOoPrL*/