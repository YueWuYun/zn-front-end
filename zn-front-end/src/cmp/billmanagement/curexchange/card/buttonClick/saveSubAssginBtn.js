/*NQ/8gz5x+PvbP/VKwVdsKljZJG+/4j851G8Yc3len+VUvSyCrlHCfyn8Ecn08B/t*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-保存提交指派按钮
 * @param {*} props  
 */
export const saveSubAssginBtn = function () {
    let savesubmitdata = this.props.createFormAfterEventData(this.pageId, this.formId);
    let subflag = this.props.form.isCheckNow(this.formId);
    if (!this.getAssginUsedr) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            content: this.props.MutiInit.getIntl("36070FCE") &&
                this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000081')   //* 国际化处理：请选择指派人!*/
        });
        return;
    }
    let data = {
        'event': savesubmitdata,//form表单数据
        'param': this.getAssginUsedr//封装请求参数
    };
    if (subflag) {
        ajax({
            url: '/nccloud/cmp/curexchange/saveassginSubmit.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                //提交--指派
                if (data && data.workflow &&
                    (data.workflow == 'approveflow' ||
                        data.workflow == 'workflow')) {
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
                        this.props.setUrlParam({
                            status: 'browse',
                            id: saveSubpk,
                            pk: saveSubstatus
                        });
                        this.toggleShow();//切换页面状态
                    }
                         //关闭指派框
                         this.setState({
                            compositedisplay: false
                        });
                }
            }
        });
    }
}

/*NQ/8gz5x+PvbP/VKwVdsKljZJG+/4j851G8Yc3len+VUvSyCrlHCfyn8Ecn08B/t*/