/*5K2YMwAJ1ucutOtxybkhr8jkYNLtMcevWx3qzzz51SMfiRPrd3528GX9OTX2N16s*/
import { createPage, ajax, base, high, toast, cacheTools, cardCache, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
import { MakeBillApp } from '../../../../public/utils/Makebill';//制单
import { linkApp, linkVoucherApp } from '../../../../public/utils/LinkUtil';//凭证
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款协同]-附件
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const annexBtn = function () {
    let pk_rec = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;;//单据pk
    let bill_no = this.props.form.getFormItemsValue(this.formId, 'bill_no').value;;//单据编号
    if (!pk_rec) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070RBMCP") &&
                this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000003')
        });/* 国际化处理： 操作失败，无数据*/
    }
    this.setState({
        showUploader: !this.state.showUploader,
        target: null
    })
    this.billno = bill_no;//附件管理使用单据编号
    this.billId = pk_rec;//单据pk
}

/*5K2YMwAJ1ucutOtxybkhr8jkYNLtMcevWx3qzzz51SMfiRPrd3528GX9OTX2N16s*/