/*TeytldWPnXV5g4CoxrgXxudYLNciVl8jHUEkPnPg+KDgaT/WDjRKRZw9XdXltUEm*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-保存提交按钮
 * @param {*} props  
 */
export const saveSubBill = function () {
    let savesubmitdata = this.props.createFormAfterEventData(this.pageId, this.formId);
    let subflag = this.props.form.isCheckNow(this.formId);
    if (subflag) {
        ajax({
            url: '/nccloud/cmp/curexchange/curexchangesavesubmit.do',
            data: savesubmitdata,
            success: (res) => {
                let { success, data } = res;
                //提交--指派
                if (data && data.workflow &&
                    (data.workflow == 'approveflow' ||
                        data.workflow == 'workflow')) {
                    //渲染保存后的数据
                    if (data.form) {
                        if (data.isautopass) {//存在预警信息
                            let warning = data.warning == null ? '' : data.warning;
                            if (warning && warning != '') {
                                toast(
                                    {
                                        color: 'warning',
                                        content: warning
                                    });//保存成功，预警信息
                            }
                        }
                        //浏览态页面
                        this.props.form.setAllFormValue({ [this.formId]: res.data.form[this.formId] });
                        //页面跳转按钮显示
                        let saveSubpk = res.data.form[this.formId].rows[0].values.pk_cruexchange.value;
                        let saveSubbillno = res.data.form[this.formId].rows[0].values.vbillno.value;
                        let saveSubstatus = res.data.form[this.formId].rows[0].values.busistatus.value;
                        this.billno = saveSubbillno;
                        //增加缓存
                        let status = this.props.getUrlParam('status');
                        if (!status || status == 'add' || status == 'copy') {
                            //新增缓存
                            addCache(saveSubpk, res.data.form, this.formId, this.dataSource, res.data.form[this.formId].rows[0].values);
                        } else {
                            //更新缓存
                            updateCache(this.pkname, saveSubpk, res.data.form, this.formId, this.dataSource, res.data.form[this.formId].rows[0].values);
                        }
                        this.props.setUrlParam({
                            status: 'browse',
                            id: saveSubpk,
                            pk: saveSubstatus
                        });
                        this.toggleShow();//切换页面状态
                    }
                    this.compositedata = data;
                    this.setState({
                        isSaveSub: true,//保存提交标识
                        compositedisplay: true
                    });
                } else if (data) {
                    if (data.form) {
                        let busistatus = res.data.form[this.formId].rows[0].values.busistatus.value;
                        if (data.isautopass) {//存在预警信息
                            let warning = data.warning == null ? '' : data.warning;
                            if (busistatus && busistatus == 1) {
                                toast(
                                    {
                                        color: 'warning',
                                        content: this.props.MutiInit.getIntl("36070FCE") &&
                                            this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000084') + warning
                                    });//保存成功，提交失败
                            } else {
                                toast(
                                    {
                                        color: 'warning',
                                        content: this.props.MutiInit.getIntl("36070FCE") &&
                                            this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000085') + warning
                                    });//保存提交成功
                            }

                        } else {
                            //不存在预警信息
                            if (busistatus && busistatus == 1) {
                                toast(
                                    {
                                        color: 'warning',
                                        content: this.props.MutiInit.getIntl("36070FCE") &&
                                            this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000084')
                                    });
                            } else {
                                toast(
                                    {
                                        color: 'success',
                                        content: this.props.MutiInit.getIntl("36070FCE") &&
                                            this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000085')
                                    });
                            }
                        }
                        //浏览态页面
                        this.props.form.setAllFormValue({ [this.formId]: res.data.form[this.formId] });
                        //页面跳转按钮显示
                        let saveSubpk = res.data.form[this.formId].rows[0].values.pk_cruexchange.value;
                        let saveSubbillno = res.data.form[this.formId].rows[0].values.vbillno.value;
                        let saveSubstatus = res.data.form[this.formId].rows[0].values.busistatus.value;
                        this.billno = saveSubbillno;
                        //增加缓存
                        let status = this.props.getUrlParam('status');
                        if (!status || status == 'add' || status == 'copy') {
                            //新增缓存
                            addCache(saveSubpk, res.data.form, this.formId, this.dataSource, res.data.form[this.formId].rows[0].values);
                        } else {
                            //更新缓存
                            updateCache(this.pkname, saveSubpk, res.data.form, this.formId, this.dataSource, res.data.form[this.formId].rows[0].values);
                        }
                        this.props.setUrlParam({
                            status: 'browse',
                            id: saveSubpk,
                            pk: saveSubstatus
                        });
                        this.toggleShow();//切换页面状态
                    }
                }
            }
        });
    }
}

/*TeytldWPnXV5g4CoxrgXxudYLNciVl8jHUEkPnPg+KDgaT/WDjRKRZw9XdXltUEm*/