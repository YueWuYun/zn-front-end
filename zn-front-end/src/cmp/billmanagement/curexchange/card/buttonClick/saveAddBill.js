/*GPMlJVmN04MG3BhjopLQSijsYOefeyU5f6RnPaCsCSm3HnSxY6DC3d7+MPhNAlAf*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-保存新增按钮
 * @param {*} props  
 */
export const saveAddBill = function () {
    let saveadddata = this.props.createFormAfterEventData(this.pageId, this.formId);
    let flag = this.props.form.isCheckNow(this.formId);
    if (flag) {
        ajax({
            url: '/nccloud/cmp/curexchange/curexchangesave.do',
            data: saveadddata,
            success: (res) => {
                let { success, data } = res;
                if (success && res.data && res.data.form) {
                    let res_pk = res.data.form[this.formId].rows[0].values.pk_cruexchange.value;//单据编号
                    let res_billstatus = res.data.form[this.formId].rows[0].values.busistatus.value;//单据状态
                    let warning = res.data.warning;//提示信息{针对透支额度}
                    let res_isauthpass = res.data.form[this.formId].rows[0].values.isauthpass.value;//提示信息{针对透支额度}
                    if (res_isauthpass && warning && warning != '') {
                        toast(
                            {
                                color: 'warning',
                                content: this.props.MutiInit.getIntl("36070FCE") &&
                                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000004') + warning
                            });/* 国际化处理： 保存成功! */
                    } else {
                        toast(
                            {
                                color: 'success',
                                content: this.props.MutiInit.getIntl("36070FCE") &&
                                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000003')
                            });/* 国际化处理： 保存成功*/
                    }
                    //增加缓存
                    let saveAddStatus = this.props.getUrlParam('status');
                    if (!saveAddStatus || saveAddStatus == 'add' || saveAddStatus == 'copy') {
                        //新增缓存
                        addCache(res_pk, res.data.form, this.formId, this.dataSource, res.data.form[this.formId].rows[0].values);
                    } else {
                        //更新缓存
                        updateCache(this.pkname, res_pk, res.data.form, this.formId, this.dataSource, res.data.form[this.formId].rows[0].values);
                    }
                    this.props.setUrlParam({
                        status: 'add',
                        pk: '',
                        id: res_pk,
                        bill_no: res_billstatus,
                        pagecode: this.pageId
                    });
                    this.refresh();//切换页面状态
                }
            }
        });
    }
}

/*GPMlJVmN04MG3BhjopLQSijsYOefeyU5f6RnPaCsCSm3HnSxY6DC3d7+MPhNAlAf*/