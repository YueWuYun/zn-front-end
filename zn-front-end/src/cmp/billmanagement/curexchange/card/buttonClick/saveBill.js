/*VcOrD49QzbhDt4hEK/IMD3cCf54YNBpg/cZXO8R7/EfsMZVNthG4JJMyAjOToCrB*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-保存按钮
 * @param {*} props  
 */
export const saveBill = function () {
    let savedata = this.props.createFormAfterEventData(this.pageId, this.formId);
    let flag = this.props.form.isCheckNow(this.formId);
    let firstStatus = this.props.getUrlParam('status');
    if (flag) {
        ajax({
            url: '/nccloud/cmp/curexchange/curexchangesave.do',
            data: savedata,
            success: (res) => {
                if (res.data && res.data.form) {
                    let isauthpass = res.data.form[this.formId].rows[0].values.isauthpass.value;//提示信息{针对透支额度}
                    let warning = res.data.warning;
                    if (isauthpass && warning && warning!='') {
                        toast(
                            {
                                color: 'warning',
                                content: this.props.MutiInit.getIntl("36070FCE") &&
                                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000004') + ' ' + warning
                            });/* 国际化处理： 保存成功! */
                    } else {
                        toast(
                            {
                                color: 'success',
                                content: this.props.MutiInit.getIntl("36070FCE") &&
                                    this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000003')
                            });/* 国际化处理： 保存成功*/
                    }
                    this.props.form.setAllFormValue({ [this.formId]: res.data.form[this.formId] });
                    //页面跳转按钮显示
                    let savepk = res.data.form[this.formId].rows[0].values.pk_cruexchange.value;
                    let savebillno = res.data.form[this.formId].rows[0].values.vbillno.value;
                    let savestatus = res.data.form[this.formId].rows[0].values.busistatus.value;
                    this.billno = savebillno;
                    //增加缓存
                    if (!firstStatus || firstStatus == 'add' || firstStatus == 'copy') {
                        //新增缓存
                        addCache(savepk, res.data.form, this.formId, this.dataSource, res.data.form[this.formId].rows[0].values);
                    } else {
                        //更新缓存
                        updateCache(this.pkname, savepk, res.data.form, this.formId, this.dataSource, res.data.form[this.formId].rows[0].values);
                    }
                    this.props.setUrlParam({
                        status: 'browse',
                        id: savepk,
                        pk: savestatus
                    });
                    this.toggleShow();//切换页面状态
                }
            }
        });
    }
}

/*VcOrD49QzbhDt4hEK/IMD3cCf54YNBpg/cZXO8R7/EfsMZVNthG4JJMyAjOToCrB*/