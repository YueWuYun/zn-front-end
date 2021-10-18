/*P7CTA1ZRiHVpSNmRlI6/An0iKRTeMjWA1tpYbFQ+0enf54moZVdhD/3oGtwF9HNd*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
/**
 * [外币兑换]-附件按钮
 * @param {*} props  
 */
export const accessoryBtn = function () {

    let accessoryBtnData = this.props.table.getCheckedRows(this.tableId);

    let pk_rec = '';//单据pk
    let bill_no = '';//单据编号
    //选择一个或者不选择，多选默认显示空数据
    if (accessoryBtnData.length == 1) {
        accessoryBtnData.forEach((val) => {
            if (val.data.values.pk_cruexchange && val.data.values.pk_cruexchange.value != null) {
                pk_rec = val.data.values.pk_cruexchange.value;
            }
            if (val.data.values.vbillno && val.data.values.vbillno.value != null) {
                bill_no = val.data.values.vbillno.value;
            }
        });
    } else {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000070')   // 提示内容,非必输/* 国际化处理： 附件支持单条操作!*/
        })
        return;
    }

    if (!pk_rec) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000011')   // 提示内容,非必输/* 国际化处理： 操作失败，无数据!*/
        })
        return;
    }

    this.setState({
        billId: pk_rec,//单据pk
        billno: bill_no,//附件管理使用单据编号
        showUploader: !this.state.showUploader,
        target: null
    })
}

/*P7CTA1ZRiHVpSNmRlI6/An0iKRTeMjWA1tpYbFQ+0enf54moZVdhD/3oGtwF9HNd*/