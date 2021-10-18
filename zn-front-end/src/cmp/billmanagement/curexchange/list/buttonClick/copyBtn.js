/*HJa/O7N0fyCqJl/L/a6SXmRlem2azSsyPt3cjCJGrt4u4FXe7eMLCmnyIwUKXmBo*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
/**
 * [外币兑换]-复制按钮
 * @param {*} props  
 */
export const copyBtn = function () {

    let copyData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (copyData.length != 1) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000053')   // 提示内容,非必输/* 国际化处理： 请选择单条数据,进行复制!*/
        })
        return
    }
    let copyid = 0;
    let bill_num = 1;
    copyData.forEach((val) => {
        copyid = val.data.values.pk_cruexchange.value;
        bill_num = val.data.values.busistatus.value;
    });
    this.props.pushTo('/card', {
        status: 'copy',
        id: copyid,
        bill_no: bill_num,
        pagecode: this.pageCode
    });
}

/*HJa/O7N0fyCqJl/L/a6SXmRlem2azSsyPt3cjCJGrt4u4FXe7eMLCmnyIwUKXmBo*/