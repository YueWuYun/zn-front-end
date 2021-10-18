/*5K2YMwAJ1ucutOtxybkhr8jkYNLtMcevWx3qzzz51SMfiRPrd3528GX9OTX2N16s*/
import { createPage, ajax, base, high,cacheTools, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款]-附件按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const annexBtn = function () {
    let accessoryBtnData = this.props.table.getCheckedRows(this.tableId);
    let pk_rec = '';//单据pk
    let bill_no = '';//单据编号
    //选择一个或者不选择，多选默认显示空数据
    if (accessoryBtnData.length == 1) {
        accessoryBtnData.forEach((val) => {

            if (val.data.values.pk_recbill && val.data.values.pk_recbill.value != null) {
                pk_rec = val.data.values.pk_recbill.value;
            }
            if (val.data.values.bill_no && val.data.values.bill_no.value != null) {
                bill_no = val.data.values.bill_no.value;
            }
        });
    } else {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000078'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000079')   // 提示内容,非必输/* 国际化处理： 附件支持单条操作!*/
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

/*5K2YMwAJ1ucutOtxybkhr8jkYNLtMcevWx3qzzz51SMfiRPrd3528GX9OTX2N16s*/